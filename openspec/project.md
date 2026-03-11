# Project Context

## Purpose
Dual-screen bingo calling web application for live events and community games. Provides professional caller control panel and animated audience display with real-time synchronization between screens. Designed for simplicity, reliability, and ease of deployment without requiring installation or backend infrastructure.

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **No Build System**: Direct browser execution, no transpilation or bundling
- **No Framework**: Pure DOM manipulation, no React/Vue/Angular
- **State Management**: Class-based model with event broadcasting
- **Screen Sync**: BroadcastChannel API (primary), localStorage fallback (legacy browsers)
- **Testing**: Node.js with custom test runner (basic assertions)
- **Development**: Python HTTP server for local testing (`python3 -m http.server`)

## Project Conventions

### Code Style
- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Single quotes for strings (e.g., `'hello'`)
- **Semicolons**: Always required
- **Naming Conventions**:
  - Variables/functions: `camelCase` (e.g., `selectBall`, `currentBall`)
  - Classes: `PascalCase` (e.g., `BingoModel`)
  - Files: `kebab-case` (e.g., `bingo-model.js`, `input.css`)
  - CSS classes: `kebab-case` (e.g., `.ball-display`, `.btn-primary`)
  - HTML IDs: `camelCase` (e.g., `manualInput`, `randomSelectBtn`)
- **Comments**: JSDoc-style for classes/functions, inline for complex logic
- **Error Handling**: Return objects with `{success: boolean, error?: string}` pattern

### Architecture Patterns
- **MVC-like Pattern**:
  - **Model**: `bingo-model.js` (game state, validation, business logic)
  - **View**: HTML templates + CSS styling (declarative UI)
  - **Controller**: `input.js`, `display.js` (event handlers, DOM updates)
- **State Management**: Single source of truth in `BingoModel` class, broadcasted to all screens
- **Communication**: Pub/sub pattern via BroadcastChannel API for cross-window messaging
- **DOM Updates**: Direct manipulation, no virtual DOM or templating engine
- **CSS Organization**: Separate files per screen (`input.css`, `display.css`), component-scoped styles
- **Animation**: CSS `@keyframes` with JavaScript triggers, hardware-accelerated transforms

### Testing Strategy
- **Unit Tests**: Test model layer in isolation (`bingo-model.js`)
- **Manual Testing**: Open both screens in browser and verify synchronization
- **No Integration Tests**: Current setup relies on manual QA
- **Test Runner**: Custom Node.js script with `console.assert` (see `bingo-app/test.js`)
- **Coverage**: Model validation, ball selection logic, state management
- **Note**: Tests currently fail due to module export issues (browser-focused code)

### Git Workflow
- **Not yet initialized**: Project currently has no Git repository
- **Recommended**: Trunk-based development with feature branches
- **Commit Style**: Descriptive messages focusing on "why" over "what"
- **OpenSpec Integration**: Use proposal system for features, archive changes after deployment

## Domain Context

### Bingo Game Rules
- **75 Balls Total**: Divided into 5 letter categories (B, I, N, G, O)
- **Ball Ranges**:
  - B: 1-15 (Blue color)
  - I: 16-30 (Red color)
  - N: 31-45 (Gray color)
  - G: 46-60 (Green color)
  - O: 61-75 (Orange color)
- **Calling Format**: Letter + Number (e.g., "B5", "N42", "O75")
- **No Duplicates**: Each ball can only be called once per game
- **Random Selection**: Must exclude already-called balls

### Dual-Screen Workflow
1. **Caller** uses input screen (laptop) to control the game
2. **Audience** sees display screen (projector) with animations
3. Screens stay synchronized via BroadcastChannel API
4. If one screen refreshes, it requests sync from other screens

### Color Coding
All UI elements use consistent color scheme matching ball letter categories for visual recognition.

## Important Constraints
- **No Backend**: Pure frontend application, no server-side logic or database
- **No Build Step**: Must work directly in browser without compilation
- **No External Dependencies**: No npm packages, CDNs, or third-party libraries
- **Browser Compatibility**: Requires modern browser (Chrome/Firefox/Safari)
- **BroadcastChannel Required**: Older browsers (IE11) need localStorage fallback
- **Same-Origin Policy**: Both screens must be served from same domain/port
- **State Persistence**: Game state persists via localStorage, survives page refresh and browser restart

## External Dependencies
- **None**: Completely self-contained application
- **Browser APIs Only**: BroadcastChannel, localStorage, DOM, CSS Animations
