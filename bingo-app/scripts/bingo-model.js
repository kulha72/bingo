// Bingo Ball Model and State Management
class BingoModel {
    constructor() {
        this.balls = this.initializeBalls();
        this.selectedBalls = [];
        this.currentBall = null;
        this.channel = null;
        this.initCommunication();
    }

    // Initialize all 75 bingo balls
    initializeBalls() {
        const balls = [];
        const letters = ['B', 'I', 'N', 'G', 'O'];
        const ranges = {
            'B': [1, 15],
            'I': [16, 30],
            'N': [31, 45],
            'G': [46, 60],
            'O': [61, 75]
        };

        letters.forEach(letter => {
            const [start, end] = ranges[letter];
            for (let num = start; num <= end; num++) {
                balls.push({
                    letter: letter,
                    number: num,
                    selected: false,
                    timestamp: null,
                    id: `${letter}${num}`
                });
            }
        });

        return balls;
    }

    // Initialize BroadcastChannel for screen communication
    initCommunication() {
        try {
            this.channel = new BroadcastChannel('bingo-game');
            this.channel.onmessage = (event) => {
                this.handleMessage(event.data);
            };
        } catch (e) {
            console.warn('BroadcastChannel not supported, using localStorage fallback');
            this.useFallback();
        }
    }

    // Fallback to localStorage for older browsers
    useFallback() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'bingo-state' && e.newValue) {
                const data = JSON.parse(e.newValue);
                this.handleMessage(data);
            }
        });
    }

    // Handle incoming messages
    handleMessage(data) {
        if (data.type === 'selection') {
            this.applySelection(data.ball);
        } else if (data.type === 'reset') {
            this.applyReset();
        } else if (data.type === 'sync-request') {
            this.broadcastState();
        } else if (data.type === 'full-sync') {
            // Apply full state and save to localStorage
            this.balls = data.balls.map(ball => ({
                ...ball,
                timestamp: ball.timestamp ? new Date(ball.timestamp) : null
            }));
            this.selectedBalls = data.selectedBalls.map(ball => ({
                ...ball,
                timestamp: ball.timestamp ? new Date(ball.timestamp) : null
            }));
            this.currentBall = data.currentBall ? {
                ...data.currentBall,
                timestamp: data.currentBall.timestamp ? new Date(data.currentBall.timestamp) : null
            } : null;
            this.saveState();
        }
    }

    // Broadcast a message to all screens
    broadcast(data) {
        if (this.channel) {
            this.channel.postMessage(data);
        } else {
            // Fallback to localStorage
            localStorage.setItem('bingo-state', JSON.stringify(data));
            localStorage.removeItem('bingo-state'); // Clear to allow repeated same values
        }
    }

    // Broadcast full state
    broadcastState() {
        this.broadcast({
            type: 'full-sync',
            balls: this.balls,
            selectedBalls: this.selectedBalls,
            currentBall: this.currentBall
        });
    }

    // Select a ball by ID (e.g., "B5")
    selectBall(ballId) {
        ballId = ballId.toUpperCase();
        const ball = this.balls.find(b => b.id === ballId);
        
        if (!ball) {
            return { success: false, error: 'Invalid ball ID' };
        }

        if (ball.selected) {
            return { success: false, error: 'Ball already selected' };
        }

        ball.selected = true;
        ball.timestamp = new Date();
        this.selectedBalls.push(ball);
        this.currentBall = ball;

        this.broadcast({
            type: 'selection',
            ball: ball
        });

        this.saveState();

        return { success: true, ball: ball };
    }

    // Apply selection from broadcast
    applySelection(ball) {
        const localBall = this.balls.find(b => b.id === ball.id);
        if (localBall && !localBall.selected) {
            localBall.selected = true;
            localBall.timestamp = new Date(ball.timestamp);
            this.selectedBalls.push(localBall);
            this.currentBall = localBall;
            this.saveState();
        }
    }

    // Select a random unselected ball
    selectRandom() {
        const unselected = this.balls.filter(b => !b.selected);
        
        if (unselected.length === 0) {
            return { success: false, error: 'All balls have been called' };
        }

        const randomIndex = Math.floor(Math.random() * unselected.length);
        const ball = unselected[randomIndex];
        
        return this.selectBall(ball.id);
    }

    // Validate input format and range
    validateInput(input) {
        input = input.toUpperCase().trim();

        const ranges = {
            'B': [1, 15],
            'I': [16, 30],
            'N': [31, 45],
            'G': [46, 60],
            'O': [61, 75]
        };

        let letter, number;

        // Accept number-only input (e.g., "5" or "42") — infer letter from range
        const numberOnlyMatch = input.match(/^(\d+)$/);
        if (numberOnlyMatch) {
            number = parseInt(numberOnlyMatch[1]);
            letter = Object.keys(ranges).find(l => number >= ranges[l][0] && number <= ranges[l][1]);
            if (!letter) {
                return { valid: false, error: 'Number must be between 1 and 75' };
            }
        } else {
            // Accept letter + number input (e.g., "B5" or "N42")
            const match = input.match(/^([BINGO])(\d+)$/);
            if (!match) {
                return { valid: false, error: 'Invalid format. Enter a number (e.g., 5, 42) or letter + number (e.g., B5, N42)' };
            }
            letter = match[1];
            number = parseInt(match[2]);
            const [min, max] = ranges[letter];
            if (number < min || number > max) {
                return { valid: false, error: `${letter} must be between ${min} and ${max}` };
            }
        }

        return { valid: true, ballId: `${letter}${number}` };
    }

    // Apply reset from broadcast (without re-broadcasting)
    applyReset() {
        this.balls.forEach(ball => {
            ball.selected = false;
            ball.timestamp = null;
        });
        this.selectedBalls = [];
        this.currentBall = null;
        BingoModel.clearPersistedState();
    }

    // Reset the game (and broadcast to other screens)
    resetGame() {
        this.balls.forEach(ball => {
            ball.selected = false;
            ball.timestamp = null;
        });
        this.selectedBalls = [];
        this.currentBall = null;

        BingoModel.clearPersistedState();

        this.broadcast({
            type: 'reset'
        });
    }

    // Get balls by letter
    getBallsByLetter(letter) {
        return this.balls.filter(b => b.letter === letter);
    }

    // Get statistics
    getStats() {
        return {
            total: this.balls.length,
            selected: this.selectedBalls.length,
            remaining: this.balls.length - this.selectedBalls.length
        };
    }

    // Get color for letter
    static getColorForLetter(letter) {
        const colors = {
            'B': '#2196F3', // Blue
            'I': '#F44336', // Red
            'N': '#9E9E9E', // Gray
            'G': '#4CAF50', // Green
            'O': '#FF9800'  // Orange
        };
        return colors[letter] || '#000';
    }

    // Save current state to localStorage
    saveState() {
        try {
            const state = {
                balls: this.balls.map(ball => ({
                    ...ball,
                    timestamp: ball.timestamp ? ball.timestamp.toISOString() : null
                })),
                selectedBalls: this.selectedBalls.map(ball => ({
                    ...ball,
                    timestamp: ball.timestamp ? ball.timestamp.toISOString() : null
                })),
                currentBall: this.currentBall ? {
                    ...this.currentBall,
                    timestamp: this.currentBall.timestamp ? this.currentBall.timestamp.toISOString() : null
                } : null
            };
            localStorage.setItem('bingo-game-state', JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save game state to localStorage:', e);
        }
    }

    // Load state from localStorage
    loadState() {
        try {
            const saved = localStorage.getItem('bingo-game-state');
            if (!saved) {
                return false;
            }

            const state = JSON.parse(saved);
            
            // Validate state structure
            if (!state.balls || !Array.isArray(state.balls) || state.balls.length !== 75) {
                console.warn('Invalid state structure in localStorage, ignoring');
                return false;
            }

            // Restore balls state
            this.balls = state.balls.map(ball => ({
                ...ball,
                timestamp: ball.timestamp ? new Date(ball.timestamp) : null
            }));

            // Restore selectedBalls
            this.selectedBalls = state.selectedBalls.map(ball => ({
                ...ball,
                timestamp: ball.timestamp ? new Date(ball.timestamp) : null
            }));

            // Restore currentBall
            if (state.currentBall) {
                this.currentBall = {
                    ...state.currentBall,
                    timestamp: state.currentBall.timestamp ? new Date(state.currentBall.timestamp) : null
                };
            } else {
                this.currentBall = null;
            }

            return true;
        } catch (e) {
            console.warn('Failed to load game state from localStorage:', e);
            return false;
        }
    }

    // Clear persisted state from localStorage
    static clearPersistedState() {
        try {
            localStorage.removeItem('bingo-game-state');
        } catch (e) {
            console.warn('Failed to clear persisted state:', e);
        }
    }
}
