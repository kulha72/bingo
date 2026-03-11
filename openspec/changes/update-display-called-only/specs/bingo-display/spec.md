# Bingo Display Specification Changes

## MODIFIED Requirements

### Requirement: Ball Column Display
The display screen SHALL show only called balls in each column (B, I, N, G, O), organized in numerical ascending order within each column.

#### Scenario: Initial empty display
- **WHEN** the display screen loads with no balls called
- **THEN** each column shows only the header (B, I, N, G, O) with no ball elements

#### Scenario: First ball called
- **WHEN** a ball is called (e.g., B-5)
- **THEN** the ball appears in the appropriate column (B) at its numerical position
- **AND** the ball is marked as the most recently called ball

#### Scenario: Multiple balls in same column
- **WHEN** multiple balls are called in the same column (e.g., B-12, B-5, B-8)
- **THEN** balls appear in numerical ascending order (B-5, B-8, B-12)
- **AND** the most recently called ball (B-8) is highlighted regardless of its position

#### Scenario: Balls called across columns
- **WHEN** balls are called from different columns (e.g., B-5, N-42, O-75, B-12)
- **THEN** each ball appears in its respective column in numerical order
- **AND** only the most recent ball (B-12) has the highlight treatment

#### Scenario: Reset game
- **WHEN** the game is reset
- **THEN** all ball elements are removed from all columns
- **AND** columns show only headers with no content

#### Scenario: Display sync after refresh
- **WHEN** the display screen refreshes and receives full sync data
- **THEN** all previously called balls appear in their columns in numerical order
- **AND** the most recently called ball is highlighted

### Requirement: Recent Ball Highlight
The display screen SHALL visually distinguish the most recently called ball from previously called balls.

#### Scenario: New ball highlighted
- **WHEN** a ball is called
- **THEN** the ball receives a visual highlight (border, glow, or similar effect)
- **AND** any previous highlight on other balls is removed

#### Scenario: Highlight persists until next call
- **WHEN** a ball is highlighted as most recent
- **THEN** the highlight remains until another ball is called
- **AND** the highlight is visible during animations and transitions

#### Scenario: Highlight removed on reset
- **WHEN** the game is reset
- **THEN** no balls have highlight treatment
- **AND** the next called ball after reset receives the highlight

## REMOVED Requirements

### Requirement: Show All Balls with Opacity
**Reason**: Display is now compact, showing only called balls instead of all 75 balls with dimmed uncalled ones.

**Migration**: Replace full board initialization with dynamic ball addition. Remove opacity-based selected/unselected visual states.
