# Change: Add State Persistence to Bingo Board

## Why
The bingo board currently loses all game state when any screen is refreshed, requiring users to restart their game from scratch. This is problematic during live events where accidental refreshes or browser crashes can disrupt the game and frustrate participants. Users need the ability to continue their game after a refresh without losing called balls.

## What Changes
- Add localStorage persistence to save game state (selected balls, current ball, timestamps)
- Auto-save state whenever balls are selected or game is reset
- Auto-load persisted state on application initialization
- Existing reset button will clear both in-memory state and localStorage
- Maintain existing BroadcastChannel sync for cross-window communication
- Persisted state serves as fallback when no other windows are broadcasting

## Impact
- Affected specs: bingo-state (new capability)
- Affected code:
  - `bingo-app/scripts/bingo-model.js` - Add save/load methods, integrate with existing state changes
  - `bingo-app/scripts/input.js` - Load state on initialization
  - `bingo-app/scripts/display.js` - Load state on initialization, prefer live sync over stored state
- No breaking changes to existing functionality
- localStorage key: `bingo-game-state` (separate from existing `bingo-state` used for BroadcastChannel fallback)
