<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Build/Test Commands
- **Run app**: Open `bingo-app/index.html` and `bingo-app/display.html` in browser, or serve via `python3 -m http.server 8000` from `bingo-app/`
- **Run tests**: `node bingo-app/test.js` (currently fails due to module export issues - tests exist but need browser environment or module.exports)
- **Single test**: No test framework configured - edit `test.js` to comment out unwanted tests
- **Validate specs**: `openspec validate --strict` before committing any spec changes

## Code Style
- **Language**: Vanilla JavaScript (ES6+), HTML5, CSS3 - no build system or transpilation
- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use
- **Naming**: camelCase for variables/functions, PascalCase for classes (e.g., `BingoModel`), kebab-case for files/CSS classes
- **Imports**: N/A - browser globals only, scripts loaded via `<script>` tags
- **Types**: No TypeScript - use JSDoc comments for type hints where helpful
- **Error handling**: Defensive validation in model layer, return `{success: boolean, error?: string}` objects for operations
- **Architecture**: MVC-like pattern - separate model (`bingo-model.js`), view (HTML/CSS), and controllers (`input.js`, `display.js`)
- **State sync**: Use BroadcastChannel API for cross-window messaging, localStorage as fallback
- **CSS**: Organized by component, use CSS custom properties sparingly, BEM-like naming, hardware-accelerated animations with `@keyframes`