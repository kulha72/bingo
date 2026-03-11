# Bingo State Persistence Specification

## ADDED Requirements

### Requirement: State Persistence to localStorage
The system SHALL automatically persist game state to localStorage whenever the state changes, allowing games to survive page refreshes and browser restarts.

#### Scenario: Auto-save on ball selection
- **WHEN** a ball is selected (manually or randomly)
- **THEN** the complete game state SHALL be saved to localStorage
- **AND** the saved state SHALL include all selected balls, current ball, and timestamps

#### Scenario: Auto-save on game reset
- **WHEN** the game is reset
- **THEN** localStorage SHALL be cleared
- **AND** the game SHALL start with a fresh state

#### Scenario: State persistence key
- **WHEN** state is persisted to localStorage
- **THEN** it SHALL use the key `bingo-game-state`
- **AND** the key SHALL be distinct from the BroadcastChannel fallback key

### Requirement: State Restoration on Load
The system SHALL automatically restore persisted game state when the application initializes, allowing users to continue their game after a refresh.

#### Scenario: Load persisted state on initialization
- **WHEN** the application loads
- **AND** persisted state exists in localStorage
- **THEN** the system SHALL restore all selected balls in their original order
- **AND** SHALL restore the current ball
- **AND** SHALL restore timestamps for all selections

#### Scenario: Fresh start with no persisted state
- **WHEN** the application loads
- **AND** no persisted state exists in localStorage
- **THEN** the system SHALL initialize with an empty game state
- **AND** all balls SHALL be unselected

#### Scenario: Corrupted state handling
- **WHEN** the application loads
- **AND** persisted state exists but is invalid or corrupted
- **THEN** the system SHALL ignore the corrupted state
- **AND** SHALL initialize with an empty game state
- **AND** SHALL log a warning to the console

### Requirement: Sync Priority Management
The system SHALL prioritize live cross-window synchronization over persisted state when both are available.

#### Scenario: Sync with other active windows
- **WHEN** a screen loads and requests sync
- **AND** another window responds with live state
- **THEN** the live state SHALL take precedence over localStorage
- **AND** the localStorage SHALL be updated with the live state

#### Scenario: No active windows available
- **WHEN** a screen loads and requests sync
- **AND** no other windows respond within timeout period
- **THEN** the system SHALL load state from localStorage
- **AND** SHALL use that as the source of truth

#### Scenario: Timeout duration
- **WHEN** a screen requests sync from other windows
- **THEN** it SHALL wait at least 200ms for a response
- **AND** SHALL fall back to localStorage if no response received

### Requirement: State Data Structure
The system SHALL persist a complete snapshot of game state in a structured JSON format.

#### Scenario: Persisted state schema
- **WHEN** state is saved to localStorage
- **THEN** it SHALL include an array of all 75 balls with their state
- **AND** SHALL include the selectedBalls array with selection order
- **AND** SHALL include the currentBall object
- **AND** SHALL include timestamps in ISO 8601 format

#### Scenario: State serialization
- **WHEN** state is saved
- **THEN** Date objects SHALL be serialized to ISO 8601 strings
- **AND** the structure SHALL be valid JSON
- **AND** SHALL be parseable by JSON.parse()

#### Scenario: State deserialization
- **WHEN** state is loaded from localStorage
- **THEN** ISO 8601 timestamp strings SHALL be converted back to Date objects
- **AND** all ball references SHALL be properly reconstructed
- **AND** the state SHALL be functionally equivalent to the pre-save state
