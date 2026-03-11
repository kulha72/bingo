# Implementation Tasks

## 1. Add State Persistence Methods to BingoModel
- [x] 1.1 Add `saveState()` method to serialize and save game state to localStorage under key `bingo-game-state`
- [x] 1.2 Add `loadState()` method to deserialize and restore game state from localStorage
- [x] 1.3 Add `clearPersistedState()` static method to remove state from localStorage
- [x] 1.4 Handle Date object serialization (convert to ISO 8601 strings)
- [x] 1.5 Handle Date object deserialization (convert ISO strings back to Date objects)
- [x] 1.6 Add error handling for corrupted localStorage data with console warnings

## 2. Integrate Auto-Save with State Changes
- [x] 2.1 Call `saveState()` after successful ball selection in `selectBall()` method
- [x] 2.2 Call `saveState()` after applying selection from broadcast in `applySelection()` method
- [x] 2.3 Call `clearPersistedState()` in `resetGame()` method
- [x] 2.4 Ensure state is saved after full sync in `handleMessage()` for 'full-sync' type

## 3. Update Input Screen Initialization
- [x] 3.1 Load persisted state in input.js after creating BingoModel instance
- [x] 3.2 Update UI to reflect loaded state (stats, current ball, history)
- [x] 3.3 Handle case where no persisted state exists (fresh start)

## 4. Update Display Screen Initialization
- [x] 4.1 Modify `requestSync()` to wait 200ms for live sync response
- [x] 4.2 Add callback to load from localStorage if no sync response received
- [x] 4.3 Ensure loaded state properly renders balls on the display board
- [x] 4.4 Prefer live sync data over localStorage when both available
- [x] 4.5 Update localStorage with live sync data when received

## 5. Update Message Handling
- [x] 5.1 Modify `handleFullSync()` in display.js to update localStorage with received state
- [x] 5.2 Ensure consistency between BroadcastChannel sync and localStorage persistence
- [x] 5.3 Verify sync-request/full-sync flow works with persistence layer

## 6. Testing and Validation
- [x] 6.1 Test: Select balls, refresh input screen, verify state persists
- [x] 6.2 Test: Select balls, refresh display screen, verify state persists
- [x] 6.3 Test: Reset game, verify localStorage is cleared
- [x] 6.4 Test: Fresh start (no localStorage), verify clean initialization
- [x] 6.5 Test: Manually corrupt localStorage data, verify graceful handling
- [x] 6.6 Test: Multi-window sync with persistence (open display, select balls, refresh both)
- [x] 6.7 Test: Sync priority (verify live sync takes precedence over stale localStorage)
- [x] 6.8 Test: Browser restart, verify game state survives

## 7. Documentation
- [x] 7.1 Update project.md to reflect localStorage persistence (remove "No Persistence" constraint)
- [x] 7.2 Update bingo-app/README.md to document persistence behavior
- [x] 7.3 Document localStorage key usage and data format
