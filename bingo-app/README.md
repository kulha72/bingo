# Bingo Display Web App

A dual-screen bingo calling application with animated ball selection and professional display features.

## Features

- **Dual Screen Support**: Separate input screen (laptop) and display screen (projector)
- **Manual & Random Selection**: Choose specific balls or pick randomly
- **Automatic Duplicate Elimination**: Random selection never picks the same ball twice
- **Animated Ball Selection**: Smooth, eye-catching animations when balls are selected
- **Color-Coded Organization**: Balls organized by letter (B, I, N, G, O) with distinct colors
- **Real-Time Synchronization**: Instant updates between input and display screens
- **State Persistence**: Game state automatically saved to localStorage and survives page refreshes
- **Selection History**: Track all called balls with timestamps
- **Professional Display**: Optimized for projector presentation

## How to Use

1. **Open the Input Screen**:
   - Open `index.html` in your browser
   - This is your control panel

2. **Open the Display Screen**:
   - Click "Open Display Screen" button, OR
   - Manually open `display.html` in a new window/tab
   - Move this window to your projector

3. **Call Balls**:
   - **Manual**: Enter a ball (e.g., "B5", "N42") and click "Select"
   - **Random**: Click "Pick Random Ball" for automatic selection

4. **Reset Game**:
   - Click "Reset Game" to clear all selections and start over

## Ball Ranges

- **B**: 1-15 (Blue)
- **I**: 16-30 (Red)
- **N**: 31-45 (Gray)
- **G**: 46-60 (Green)
- **O**: 61-75 (Orange)

## Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

Requires support for BroadcastChannel API or localStorage for screen synchronization.

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No external dependencies
- Responsive design
- Hardware-accelerated CSS animations
- Real-time screen synchronization using BroadcastChannel API
- Game state persistence using localStorage (key: `bingo-game-state`)
- State automatically saves on ball selection and resets
- State automatically loads on page initialization
- Prioritizes live cross-window sync over stored state

## File Structure

```
bingo-app/
├── index.html          # Input/control screen
├── display.html        # Display/projector screen
├── styles/
│   ├── input.css       # Input screen styles
│   └── display.css     # Display screen styles
└── scripts/
    ├── bingo-model.js  # Core game logic and state
    ├── input.js        # Input screen controller
    └── display.js      # Display screen controller
```

## Deployment to Render

You can deploy this app to Render.com to make it publicly accessible without any local setup.

### Prerequisites

- Git installed on your computer
- A free Render.com account (sign up at https://render.com)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Push to Git Repository**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Render**:
   - Log in to your Render account
   - Click "New +" and select "Static Site"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` configuration

3. **Deploy**:
   - Render will automatically deploy your site
   - You'll receive a URL like `https://bingo-app.onrender.com`

4. **Access Both Screens**:
   - **Input Screen (Control Panel)**: `https://your-app.onrender.com/`
   - **Display Screen (Projector)**: `https://your-app.onrender.com/display.html`
   - Bookmark both URLs for easy access

### Important Notes

- **HTTPS Required**: The BroadcastChannel API requires a secure connection (HTTPS). Render provides HTTPS automatically, so cross-window synchronization will work perfectly when deployed.
- **Local Development**: When testing locally with `python3 -m http.server`, the app falls back to localStorage for synchronization (since local HTTP doesn't support BroadcastChannel).
- **Auto-Deploy**: Any changes pushed to your `main` branch will automatically trigger a new deployment on Render.
- **Free Tier**: This app works perfectly on Render's free static site tier.

## Tips

- Use fullscreen mode (F11) on the display screen for best projector experience
- Keep both windows open on different screens (laptop + projector)
- Game state persists across page refreshes and browser restarts
- Use the Reset Game button to clear both in-memory and persisted state
- If you refresh a screen, it will sync with other open windows or load from localStorage
- Perfect for bingo nights, fundraisers, or social events!
