// Input Screen Controller
let bingoGame;

document.addEventListener('DOMContentLoaded', () => {
    bingoGame = new BingoModel();
    bingoGame.loadState();
    initializeEventListeners();
    updateUI();
    
    // Listen for updates from other screens
    window.addEventListener('storage', handleExternalUpdate);
});

function initializeEventListeners() {
    // Manual selection
    document.getElementById('manualSelectBtn').addEventListener('click', handleManualSelection);
    document.getElementById('manualInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleManualSelection();
        }
    });

    // Random selection
    document.getElementById('randomSelectBtn').addEventListener('click', handleRandomSelection);

    // Reset game
    document.getElementById('resetBtn').addEventListener('click', handleReset);

    // Open display screen
    document.getElementById('openDisplayBtn').addEventListener('click', openDisplayScreen);

    // Clear error on input
    document.getElementById('manualInput').addEventListener('input', clearError);
}

function handleManualSelection() {
    const input = document.getElementById('manualInput').value.trim();
    
    if (!input) {
        showError('Please enter a ball number (e.g., B5, N42)');
        return;
    }

    // Validate input
    const validation = bingoGame.validateInput(input);
    if (!validation.valid) {
        showError(validation.error);
        return;
    }

    // Select the ball
    const result = bingoGame.selectBall(validation.ballId);
    if (!result.success) {
        showError(result.error);
        return;
    }

    // Success - clear input and update UI
    document.getElementById('manualInput').value = '';
    clearError();
    updateUI();
    flashSuccess();
}

function handleRandomSelection() {
    const result = bingoGame.selectRandom();
    
    if (!result.success) {
        showError(result.error);
        return;
    }

    clearError();
    updateUI();
    flashSuccess();
}

function handleReset() {
    if (bingoGame.selectedBalls.length > 0) {
        if (!confirm('Are you sure you want to reset the game? All called balls will be cleared.')) {
            return;
        }
    }

    bingoGame.resetGame();
    updateUI();
    clearError();
}

function openDisplayScreen() {
    window.open('display.html', 'BingoDisplay', 'width=1920,height=1080');
}

function handleExternalUpdate() {
    updateUI();
}

function updateUI() {
    updateStats();
    updateCurrentBall();
    updateHistory();
}

function updateStats() {
    const stats = bingoGame.getStats();
    document.getElementById('calledCount').textContent = stats.selected;
    document.getElementById('remainingCount').textContent = stats.remaining;

    // Disable random button if all balls called
    const randomBtn = document.getElementById('randomSelectBtn');
    if (stats.remaining === 0) {
        randomBtn.disabled = true;
        randomBtn.textContent = 'All Balls Called';
    } else {
        randomBtn.disabled = false;
        randomBtn.innerHTML = '<span class="icon">🎱</span> Pick Random Ball';
    }
}

function updateCurrentBall() {
    const currentBallDiv = document.getElementById('currentBall');
    
    if (!bingoGame.currentBall) {
        currentBallDiv.innerHTML = '<span class="no-selection">No ball selected</span>';
        return;
    }

    const ball = bingoGame.currentBall;
    const color = BingoModel.getColorForLetter(ball.letter);
    
    currentBallDiv.innerHTML = `
        <div class="ball-display" style="background-color: ${color}">
            <span class="ball-letter">${ball.letter}</span>
            <span class="ball-number">${ball.number}</span>
        </div>
    `;
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    
    if (bingoGame.selectedBalls.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No balls called yet</p>';
        return;
    }

    // Show most recent first
    const reversed = [...bingoGame.selectedBalls].reverse();
    
    historyList.innerHTML = reversed.map((ball, index) => {
        const color = BingoModel.getColorForLetter(ball.letter);
        const isLatest = index === 0;
        
        return `
            <div class="history-item ${isLatest ? 'latest' : ''}">
                <div class="history-ball" style="background-color: ${color}">
                    <span class="history-ball-text">${ball.id}</span>
                </div>
                <span class="history-time">${formatTime(ball.timestamp)}</span>
                <button class="undo-btn" onclick="handleUndoBall('${ball.id}')" title="Remove ${ball.id}">&times;</button>
            </div>
        `;
    }).join('');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

function showError(message) {
    const errorDiv = document.getElementById('inputError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearError() {
    const errorDiv = document.getElementById('inputError');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

function handleUndoBall(ballId) {
    const result = bingoGame.unselectBall(ballId);
    if (result.success) {
        updateUI();
    }
}

function flashSuccess() {
    const currentBallDiv = document.getElementById('currentBall');
    currentBallDiv.classList.add('flash');
    setTimeout(() => {
        currentBallDiv.classList.remove('flash');
    }, 500);
}
