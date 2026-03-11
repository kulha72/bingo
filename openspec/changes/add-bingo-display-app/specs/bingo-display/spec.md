# Bingo Display Application Specification

## ADDED Requirements

### Requirement: Bingo Ball Model
The system SHALL maintain a complete set of 75 bingo balls organized by letter with the following distribution: B (1-15), I (16-30), N (31-45), G (46-60), O (61-75).

#### Scenario: Ball initialization
- **WHEN** the application starts
- **THEN** all 75 balls SHALL be initialized in an unselected state
- **AND** balls SHALL be organized by their corresponding letter category

#### Scenario: Ball state tracking
- **WHEN** a ball is selected
- **THEN** the system SHALL track its selected state
- **AND** the ball SHALL not be available for random selection
- **AND** the selection timestamp SHALL be recorded

### Requirement: Manual Ball Selection
The system SHALL allow users to manually input a letter/number combination to select a specific bingo ball.

#### Scenario: Valid manual input
- **WHEN** user enters a valid letter (B, I, N, G, O) and number combination
- **THEN** the system SHALL validate the input is within the correct range for that letter
- **AND** the ball SHALL be marked as selected
- **AND** the selection SHALL be broadcast to the display screen

#### Scenario: Invalid manual input
- **WHEN** user enters an invalid letter or number outside the valid range
- **THEN** the system SHALL display an error message
- **AND** the ball SHALL NOT be marked as selected

#### Scenario: Duplicate manual selection
- **WHEN** user attempts to select an already-selected ball
- **THEN** the system SHALL notify the user the ball was already selected
- **AND** SHALL NOT update the selection state

### Requirement: Random Ball Selection
The system SHALL provide a random ball selection feature that automatically picks an unselected ball and eliminates it from future random selections.

#### Scenario: Random selection with available balls
- **WHEN** user clicks the random selection button
- **AND** unselected balls are available
- **THEN** the system SHALL randomly select one unselected ball
- **AND** mark it as selected
- **AND** broadcast the selection to the display screen

#### Scenario: Random selection with no available balls
- **WHEN** user clicks the random selection button
- **AND** all balls have been selected
- **THEN** the system SHALL notify the user all balls have been called
- **AND** SHALL NOT make a selection

#### Scenario: Automatic duplicate elimination
- **WHEN** the random selection feature is used
- **THEN** the system SHALL only consider unselected balls for random selection
- **AND** SHALL never select the same ball twice

### Requirement: Input Screen Interface
The system SHALL provide an input screen interface optimized for laptop use by the operator.

#### Scenario: Input controls display
- **WHEN** the input screen is loaded
- **THEN** the screen SHALL display a manual input field for letter/number entry
- **AND** SHALL display a random selection button
- **AND** SHALL display a list of all selected balls in chronological order
- **AND** SHALL display a reset/clear button

#### Scenario: Selected balls history
- **WHEN** balls are selected via manual or random input
- **THEN** the input screen SHALL display the history of selected balls
- **AND** SHALL show the most recent selection prominently
- **AND** SHALL organize the list by selection order

#### Scenario: Reset functionality
- **WHEN** user activates the reset/clear function
- **THEN** all balls SHALL be returned to unselected state
- **AND** the selection history SHALL be cleared
- **AND** the display screen SHALL be updated to reflect the reset

### Requirement: Display Screen Interface
The system SHALL provide a display screen interface optimized for projector presentation to an audience.

#### Scenario: Ball grid organization
- **WHEN** the display screen is loaded
- **THEN** all 75 balls SHALL be displayed in a grid layout
- **AND** balls SHALL be organized into five columns by letter (B, I, N, G, O)
- **AND** each column SHALL display 15 balls in numerical order

#### Scenario: Visual ball representation
- **WHEN** balls are displayed
- **THEN** each ball SHALL be rendered as a circular bingo ball
- **AND** SHALL be color-coded by letter (B=blue, I=red, N=gray, G=green, O=orange)
- **AND** SHALL display the letter and number clearly

#### Scenario: Selected vs unselected visual state
- **WHEN** a ball is in unselected state
- **THEN** it SHALL be displayed with reduced opacity or muted styling
- **WHEN** a ball is in selected state
- **THEN** it SHALL be displayed with full opacity and prominent styling

#### Scenario: Current selection highlight
- **WHEN** a new ball is selected
- **THEN** the display screen SHALL prominently highlight the most recently selected ball
- **AND** SHALL differentiate it from previously selected balls

### Requirement: Ball Selection Animation
The system SHALL provide a visual animation when a ball is selected to draw attention and enhance the user experience.

#### Scenario: Selection animation trigger
- **WHEN** a ball is selected on the input screen
- **THEN** the display screen SHALL trigger an animation on that ball
- **AND** the animation SHALL complete before the next selection can be made

#### Scenario: Animation style
- **WHEN** the selection animation plays
- **THEN** the ball SHALL scale up and fade in with a bounce effect
- **AND** the animation duration SHALL be between 0.5-1.5 seconds
- **AND** the animation SHALL be smooth and visible from projector distance

#### Scenario: Animation performance
- **WHEN** animations are triggered
- **THEN** they SHALL run at 60fps or higher
- **AND** SHALL not block user interaction on the input screen

### Requirement: Screen Synchronization
The system SHALL maintain real-time synchronization between the input screen and display screen.

#### Scenario: Selection broadcast
- **WHEN** a ball is selected on the input screen
- **THEN** the selection SHALL be broadcast to all connected display screens
- **AND** the display SHALL update within 100ms

#### Scenario: State consistency
- **WHEN** multiple screens are open
- **THEN** all screens SHALL reflect the same ball selection state
- **AND** updates SHALL propagate to all screens automatically

#### Scenario: Screen reconnection
- **WHEN** a display screen is opened or refreshed
- **THEN** it SHALL synchronize with the current game state
- **AND** display all previously selected balls correctly

### Requirement: Input Validation
The system SHALL validate all user inputs to ensure only valid bingo ball selections are processed.

#### Scenario: Letter validation
- **WHEN** user inputs a letter
- **THEN** the system SHALL only accept B, I, N, G, or O (case-insensitive)
- **AND** SHALL reject any other characters

#### Scenario: Number range validation
- **WHEN** user inputs a number for a specific letter
- **THEN** the system SHALL validate the number is within the correct range
- **AND** B SHALL accept 1-15
- **AND** I SHALL accept 16-30
- **AND** N SHALL accept 31-45
- **AND** G SHALL accept 46-60
- **AND** O SHALL accept 61-75

#### Scenario: Validation feedback
- **WHEN** invalid input is detected
- **THEN** the system SHALL display a clear error message
- **AND** SHALL highlight the invalid field
- **AND** SHALL not process the invalid selection

### Requirement: Responsive Design
The system SHALL provide responsive layouts that work on various screen sizes and aspect ratios.

#### Scenario: Input screen responsiveness
- **WHEN** the input screen is displayed on different laptop screen sizes
- **THEN** all controls SHALL remain accessible and usable
- **AND** text SHALL be readable at standard laptop viewing distances

#### Scenario: Display screen responsiveness
- **WHEN** the display screen is projected or displayed on various screen sizes
- **THEN** the ball grid SHALL scale appropriately
- **AND** all balls SHALL be clearly visible from typical viewing distances
- **AND** the layout SHALL maintain proper aspect ratio

#### Scenario: Minimum resolution support
- **WHEN** screens are displayed at minimum supported resolution
- **THEN** the system SHALL function properly at 1024x768 or higher
- **AND** SHALL maintain readability and usability
