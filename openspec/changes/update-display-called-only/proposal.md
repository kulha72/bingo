# Change: Update Display to Show Only Called Balls

## Why
The projector screen displays all 75 balls in each column, making it very long and difficult to read from a distance. By showing only the balls that have been called, the display becomes more compact and easier for the audience to see which numbers are active.

## What Changes
- Modify display screen to show only called balls in each column
- Maintain numerical order within each column (ascending by number)
- Add visual highlight to the most recently called ball
- Remove display of uncalled balls (no dimmed/opacity effect)

## Impact
- Affected specs: `bingo-display` (MODIFIED)
- Affected code: `bingo-app/scripts/display.js`, `bingo-app/styles/display.css`
- User experience: More compact, readable projector display; easier to see called numbers
