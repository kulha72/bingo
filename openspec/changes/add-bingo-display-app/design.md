# Design: Bingo Display Web Application

## Context
Building a web-based bingo calling system that separates the operator interface (input screen) from the audience display (projector screen). The system needs to track 75 bingo balls (B:1-15, I:16-30, N:31-45, G:46-60, O:61-75), support manual and random selection, and provide visual feedback through animations.

## Goals / Non-Goals

### Goals
- Dual-screen architecture (input + display)
- Real-time synchronization between screens
- Visual bingo ball representation organized by letter
- Smooth animations for ball selection
- Manual input and random selection modes
- Prevention of duplicate selections in random mode

### Non-Goals
- Multi-player bingo card generation
- Winner verification
- Network multiplayer support
- Mobile app versions (web-based only)
- Persistent storage across sessions

## Decisions

### Technology Stack
**Decision**: Use vanilla HTML/CSS/JavaScript
**Rationale**: 
- No build system complexity
- Easy deployment (single directory)
- No dependencies to manage
- Sufficient for application requirements
- Fast development cycle

**Alternatives considered**:
- React/Vue framework: Overkill for this scope, adds complexity
- Electron app: Not needed, browser works fine for dual screens

### Screen Communication
**Decision**: Use BroadcastChannel API for screen synchronization
**Rationale**:
- Native browser API, no external dependencies
- Real-time updates between tabs/windows
- Simple pub/sub pattern
- Better than localStorage polling

**Fallback**: localStorage with polling for browsers without BroadcastChannel support

### Ball Data Structure
**Decision**: Array of objects with structure:
```javascript
{
  letter: 'B' | 'I' | 'N' | 'G' | 'O',
  number: 1-75,
  selected: boolean,
  timestamp: Date | null
}
```

**Rationale**:
- Easy to filter by letter for organization
- Track selection state per ball
- Timestamp enables selection history
- Simple to serialize for cross-screen communication

### Display Layout
**Decision**: Grid layout organized by letter columns (B, I, N, G, O)
**Rationale**:
- Mirrors traditional bingo board layout
- Familiar to users
- Easy to locate specific balls
- Clear visual organization

### Animation Approach
**Decision**: CSS animations with JavaScript triggers
**Rationale**:
- Hardware-accelerated performance
- Smooth 60fps animations
- Easy to customize
- No animation library dependencies

**Animation style**: Scale + opacity transition with bounce easing
- Visible from projector distance
- Clear indication of selection
- Professional appearance

### Color Scheme
**Decision**: Traditional bingo colors per letter
- B: Blue
- I: Red
- N: White/Gray
- G: Green
- O: Orange/Yellow

**Rationale**: Familiar to bingo players, improves usability

## Architecture

### File Structure
```
bingo-app/
├── index.html          # Input screen
├── display.html        # Display/projector screen
├── styles/
│   ├── input.css       # Input screen styles
│   └── display.css     # Display screen styles
└── scripts/
    ├── bingo-model.js  # Ball data and state management
    ├── input.js        # Input screen logic
    └── display.js      # Display screen logic
```

### State Management Flow
1. Input screen modifies ball state
2. State broadcasted via BroadcastChannel
3. Display screen receives update and re-renders
4. Animation triggered on display screen

### Random Selection Algorithm
1. Filter balls array to only unselected balls
2. Generate random index within unselected balls
3. Mark selected and broadcast
4. If all balls selected, disable random button

## Risks / Trade-offs

### Risk: Browser Compatibility
**Mitigation**: Test in Chrome, Firefox, Safari; provide fallback for BroadcastChannel

### Risk: Screen Synchronization Lag
**Mitigation**: Optimize message size, use efficient rendering; acceptable for bingo pace

### Trade-off: No Persistence
**Impact**: Refresh loses state
**Mitigation**: Future enhancement could add localStorage persistence if needed

### Trade-off: Two-Window Requirement
**Impact**: User must open two browser windows/tabs
**Mitigation**: Clear instructions on input screen; consider "Open Display Screen" button

## Migration Plan
N/A - New application, no migration needed

## Open Questions
- Should we add undo/back functionality?
- Should we add audio cues on ball selection?
- Should we persist state to localStorage for accidental refreshes?
- Should we add keyboard shortcuts for faster operation?
