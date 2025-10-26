# Markdown Previewer

A modern, professional Electron-based markdown previewer with live preview, syntax highlighting, and a clean interface inspired by VS Code.

## Features

- **Split-pane Design**: Editor on the left, live preview on the right with a draggable divider
- **Live Preview**: Real-time markdown rendering as you type
- **Syntax Highlighting**: Code blocks with highlight.js support
- **Dark/Light Theme**: Toggle between dark and light themes
- **Auto-save**: Content automatically saved to localStorage
- **File Operations**: Open and save markdown files to disk
- **Font Size Controls**: Adjust text size with +/- buttons
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + N`: New file
  - `Ctrl/Cmd + O`: Open file
  - `Ctrl/Cmd + S`: Save file

## Technologies

- **Electron**: Desktop app framework
- **React**: UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **marked**: Markdown parser
- **highlight.js**: Syntax highlighting for code blocks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

### Running the App

#### Development Mode

Run the Vite dev server and Electron together:

```bash
npm run electron:dev
```

Or run them separately:

```bash
# Terminal 1 - Start Vite dev server
npm run dev

# Terminal 2 - Start Electron
npm run electron
```

#### Production Build

Build the app and package it:

```bash
npm run package
```

## Project Structure

```
markdown-previewer/
├── src/
│   ├── components/
│   │   ├── Editor.jsx          # Markdown editor with line numbers
│   │   ├── Preview.jsx         # Live markdown preview
│   │   ├── SplitPane.jsx       # Draggable split pane layout
│   │   └── Toolbar.jsx         # Top toolbar with controls
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles and Tailwind
├── main.js                     # Electron main process
├── preload.js                  # Electron preload script
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Project dependencies and scripts

```

## Styling

The app features a professional, clean design with:
- Dark theme (default): `#1e1e1e` background, `#e0e0e0` text
- Light theme: `#f5f5f5` background, `#1a1a1a` text
- Accent color: Vibrant blue `#3b82f6`
- Smooth transitions and hover effects
- Custom scrollbars
- Professional markdown rendering

## License

ISC
