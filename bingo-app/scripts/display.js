// Display Screen Controller
let bingoGame;
let currentAnimatingBall = null;

document.addEventListener('DOMContentLoaded', () => {
    bingoGame = new BingoModel();
    initializeBoard();
    setupMessageListener();
    requestSync();
});

function initializeBoard() {
    // Don't render any balls initially - they will be added dynamically when called
    // Columns start empty with just headers
}

function createBallElement(ball) {
    const div = document.createElement('div');
    div.className = 'ball';
    div.id = `ball-${ball.id}`;
    div.dataset.ballId = ball.id;
    div.dataset.ballNumber = ball.number;
    
    const color = BingoModel.getColorForLetter(ball.letter);
    div.style.setProperty('--ball-color', color);
    
    div.innerHTML = `
        <div class="ball-inner">
            <span class="ball-number-display">${ball.number}</span>
        </div>
    `;
    
    // All visible balls are selected, so add selected class
    div.classList.add('selected');
    
    return div;
}

function insertBallInOrder(ballElement, ball) {
    const container = document.getElementById(`column${ball.letter}`);
    const ballNumber = ball.number;
    
    // Find the correct position to insert (maintain numerical order)
    const existingBalls = Array.from(container.children);
    let insertIndex = existingBalls.length;
    
    for (let i = 0; i < existingBalls.length; i++) {
        const existingNumber = parseInt(existingBalls[i].dataset.ballNumber);
        if (ballNumber < existingNumber) {
            insertIndex = i;
            break;
        }
    }
    
    // Insert at the correct position
    if (insertIndex >= existingBalls.length) {
        container.appendChild(ballElement);
    } else {
        container.insertBefore(ballElement, existingBalls[insertIndex]);
    }
}

function setupMessageListener() {
    // Listen for BroadcastChannel messages
    if (bingoGame.channel) {
        bingoGame.channel.onmessage = (event) => {
            handleMessage(event.data);
        };
    }
    
    // Fallback to storage events
    window.addEventListener('storage', (e) => {
        if (e.key === 'bingo-state' && e.newValue) {
            const data = JSON.parse(e.newValue);
            handleMessage(data);
        }
    });
}

function handleMessage(data) {
    if (data.type === 'selection') {
        handleBallSelection(data.ball);
    } else if (data.type === 'unselect') {
        handleBallUnselect(data.ballId);
    } else if (data.type === 'reset') {
        handleReset();
    } else if (data.type === 'full-sync') {
        handleFullSync(data);
    }
}

function handleBallUnselect(ballId) {
    bingoGame.applyUnselect(ballId);

    // Remove the ball element from the board
    const ballElement = document.getElementById(`ball-${ballId}`);
    if (ballElement) {
        ballElement.remove();
    }

    // Update the banner to show the new current ball (or reset it)
    if (bingoGame.currentBall) {
        // Re-highlight the new most-recent ball
        document.querySelectorAll('.recent-call').forEach(el => el.classList.remove('recent-call'));
        const newCurrent = document.getElementById(`ball-${bingoGame.currentBall.id}`);
        if (newCurrent) newCurrent.classList.add('recent-call');
        updateCurrentBallBanner(bingoGame.currentBall);
    } else {
        document.querySelectorAll('.recent-call').forEach(el => el.classList.remove('recent-call'));
        const banner = document.getElementById('currentBallDisplay');
        const content = banner.querySelector('.banner-content');
        content.innerHTML = `<span class="banner-text">Waiting for first ball...</span>`;
        banner.classList.remove('pulse');
    }
}

function handleBallSelection(ball) {
    // Update local state
    bingoGame.applySelection(ball);
    
    // Remove highlight from previously highlighted ball
    const previousHighlight = document.querySelector('.recent-call');
    if (previousHighlight) {
        previousHighlight.classList.remove('recent-call');
    }
    
    // Check if ball already exists (from sync)
    let ballElement = document.getElementById(`ball-${ball.id}`);
    
    if (!ballElement) {
        // Create and insert ball in numerical order
        ballElement = createBallElement(ball);
        insertBallInOrder(ballElement, ball);
        
        // Animate the selection
        animateBallSelection(ballElement, ball);
    }
    
    // Add highlight to this ball (most recent)
    ballElement.classList.add('recent-call');
    
    // Update current ball banner
    updateCurrentBallBanner(ball);
}

function animateBallSelection(ballElement, ball) {
    currentAnimatingBall = ball.id;
    
    // Add animation class
    ballElement.classList.add('selecting');
    
    // After animation, mark as selected
    setTimeout(() => {
        ballElement.classList.remove('selecting');
        ballElement.classList.add('selected');
        currentAnimatingBall = null;
    }, 1000);
}

function updateCurrentBallBanner(ball) {
    const banner = document.getElementById('currentBallDisplay');
    const color = BingoModel.getColorForLetter(ball.letter);

    const content = banner.querySelector('.banner-content');
    content.innerHTML = `
        <div class="banner-ball" style="background-color: ${color}">
            <span class="banner-letter">${ball.letter}</span>
            <span class="banner-number">${ball.number}</span>
        </div>
        <div class="banner-text">
            <span class="ball-call">${ball.letter}-${ball.number}</span>
        </div>
    `;

    // Trigger banner animation
    banner.classList.remove('pulse');
    void banner.offsetWidth; // Force reflow
    banner.classList.add('pulse');
}

function handleReset() {
    // Apply reset to local state without broadcasting
    bingoGame.applyReset();
    
    // Clear all ball elements from columns
    const letters = ['B', 'I', 'N', 'G', 'O'];
    letters.forEach(letter => {
        const container = document.getElementById(`column${letter}`);
        container.innerHTML = '';
    });
    
    // Reset banner
    const banner = document.getElementById('currentBallDisplay');
    const content = banner.querySelector('.banner-content');
    content.innerHTML = `<span class="banner-text">Waiting for first ball...</span>`;
    banner.classList.remove('pulse');
}

function handleFullSync(data) {
    // Apply full state from sync - only render selected balls
    const selectedBalls = data.balls.filter(ball => ball.selected);
    
    // Sort by letter and number to ensure correct order
    selectedBalls.sort((a, b) => {
        if (a.letter !== b.letter) {
            return a.letter.localeCompare(b.letter);
        }
        return a.number - b.number;
    });
    
    // Add each selected ball in order
    selectedBalls.forEach(ball => {
        let ballElement = document.getElementById(`ball-${ball.id}`);
        if (!ballElement) {
            ballElement = createBallElement(ball);
            insertBallInOrder(ballElement, ball);
        }
    });
    
    // Highlight the most recent ball if available
    if (data.currentBall) {
        const currentBallElement = document.getElementById(`ball-${data.currentBall.id}`);
        if (currentBallElement) {
            currentBallElement.classList.add('recent-call');
        }
        updateCurrentBallBanner(data.currentBall);
    }
}

function requestSync() {
    let syncReceived = false;
    
    // Listen for sync response
    const originalHandler = bingoGame.channel ? bingoGame.channel.onmessage : null;
    
    // Request current state from input screen
    setTimeout(() => {
        bingoGame.broadcast({
            type: 'sync-request'
        });
    }, 100);
    
    // Wait 200ms for sync response, then fall back to localStorage
    setTimeout(() => {
        if (!syncReceived) {
            // No sync received, try loading from localStorage
            const loaded = bingoGame.loadState();
            if (loaded) {
                // Render the loaded state
                renderPersistedState();
            }
        }
    }, 300);
    
    // Override message handler temporarily to detect sync
    if (bingoGame.channel) {
        const tempHandler = (event) => {
            if (event.data.type === 'full-sync') {
                syncReceived = true;
            }
            handleMessage(event.data);
        };
        bingoGame.channel.onmessage = tempHandler;
    }
}

function renderPersistedState() {
    // Render all selected balls from loaded state
    const selectedBalls = bingoGame.balls.filter(ball => ball.selected);
    
    selectedBalls.sort((a, b) => {
        if (a.letter !== b.letter) {
            return a.letter.localeCompare(b.letter);
        }
        return a.number - b.number;
    });
    
    selectedBalls.forEach(ball => {
        let ballElement = document.getElementById(`ball-${ball.id}`);
        if (!ballElement) {
            ballElement = createBallElement(ball);
            insertBallInOrder(ballElement, ball);
        }
    });
    
    // Highlight the most recent ball if available
    if (bingoGame.currentBall) {
        const currentBallElement = document.getElementById(`ball-${bingoGame.currentBall.id}`);
        if (currentBallElement) {
            currentBallElement.classList.add('recent-call');
        }
        updateCurrentBallBanner(bingoGame.currentBall);
    }
}
