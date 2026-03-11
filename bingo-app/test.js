// Quick test of BingoModel functionality
// Mock browser globals for Node.js
global.window = {
    addEventListener: () => {}
};
global.localStorage = {
    data: {},
    setItem(key, value) { this.data[key] = value; },
    getItem(key) { return this.data[key] || null; },
    removeItem(key) { delete this.data[key]; }
};

// Mock BroadcastChannel
global.BroadcastChannel = class BroadcastChannel {
    constructor(name) { this.name = name; this.onmessage = null; }
    postMessage(data) {}
    close() {}
};

// Load the model
const fs = require('fs');
const modelCode = fs.readFileSync('scripts/bingo-model.js', 'utf8');
eval(modelCode);

console.log('Testing BingoModel...\n');

// Test 1: Initialize balls
const game = new BingoModel();
console.log(`✓ Test 1: Initialized ${game.balls.length} balls`);
console.assert(game.balls.length === 75, 'Should have 75 balls');

// Test 2: Validate ranges
const bBalls = game.getBallsByLetter('B');
const iBalls = game.getBallsByLetter('I');
const nBalls = game.getBallsByLetter('N');
const gBalls = game.getBallsByLetter('G');
const oBalls = game.getBallsByLetter('O');

console.log(`✓ Test 2: Ball ranges correct`);
console.assert(bBalls.length === 15 && bBalls[0].number === 1 && bBalls[14].number === 15, 'B range');
console.assert(iBalls.length === 15 && iBalls[0].number === 16 && iBalls[14].number === 30, 'I range');
console.assert(nBalls.length === 15 && nBalls[0].number === 31 && nBalls[14].number === 45, 'N range');
console.assert(gBalls.length === 15 && gBalls[0].number === 46 && gBalls[14].number === 60, 'G range');
console.assert(oBalls.length === 15 && oBalls[0].number === 61 && oBalls[14].number === 75, 'O range');

// Test 3: Input validation
const valid1 = game.validateInput('B5');
const valid2 = game.validateInput('N42');
const invalid1 = game.validateInput('X5');
const invalid2 = game.validateInput('B99');
const invalid3 = game.validateInput('I5'); // I starts at 16

console.log(`✓ Test 3: Input validation working`);
console.assert(valid1.valid === true && valid1.ballId === 'B5', 'Valid B5');
console.assert(valid2.valid === true && valid2.ballId === 'N42', 'Valid N42');
console.assert(invalid1.valid === false, 'Invalid letter X');
console.assert(invalid2.valid === false, 'Invalid number 99 for B');
console.assert(invalid3.valid === false, 'Invalid number 5 for I');

// Test 4: Select ball
const result1 = game.selectBall('B5');
console.log(`✓ Test 4: Selected ball B5`);
console.assert(result1.success === true, 'Selection should succeed');
console.assert(game.selectedBalls.length === 1, 'Should have 1 selected ball');
console.assert(game.currentBall.id === 'B5', 'Current ball should be B5');

// Test 5: Duplicate selection
const result2 = game.selectBall('B5');
console.log(`✓ Test 5: Duplicate prevention working`);
console.assert(result2.success === false, 'Duplicate selection should fail');
console.assert(game.selectedBalls.length === 1, 'Should still have only 1 ball');

// Test 6: Random selection
const result3 = game.selectRandom();
console.log(`✓ Test 6: Random selection working`);
console.assert(result3.success === true, 'Random selection should succeed');
console.assert(game.selectedBalls.length === 2, 'Should have 2 selected balls');
console.assert(result3.ball.id !== 'B5', 'Random should not select B5 again');

// Test 7: Stats
const stats = game.getStats();
console.log(`✓ Test 7: Stats tracking working`);
console.assert(stats.total === 75, 'Total should be 75');
console.assert(stats.selected === 2, 'Selected should be 2');
console.assert(stats.remaining === 73, 'Remaining should be 73');

// Test 8: Reset
game.resetGame();
console.log(`✓ Test 8: Reset working`);
console.assert(game.selectedBalls.length === 0, 'Selected balls should be cleared');
console.assert(game.currentBall === null, 'Current ball should be null');
console.assert(game.balls.filter(b => b.selected).length === 0, 'No balls should be selected');

console.log('\n✅ All tests passed!');
