# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron-based markdown previewer desktop application with a React UI. The app uses a dual-process architecture (Electron main process + React renderer process) with Vite as the build tool.

## Development Commands

### Running the Application
```bash
# Development mode (recommended) - runs Vite dev server and Electron together
npm run electron:dev

# Or run separately:
npm run dev        # Start Vite dev server on http://localhost:5173
npm run electron   # Start Electron (requires dev server running first)
```

### Building and Packaging
```bash
npm run build      # Build React app with Vite
npm run package    # Build and package Electron app for distribution
```

## Architecture

### Electron Process Model
- **Main Process** (`main.js`): Manages BrowserWindow, handles IPC for file operations (open/save)
- **Preload Script** (`preload.js`): Secure bridge exposing `window.electronAPI` to renderer
- **Renderer Process** (React app in `src/`): UI runs in browser context with no direct Node.js access

The main process checks for development mode and loads either:
- Development: `http://localhost:5173` (Vite dev server)
- Production: `dist/index.html` (built files)

### React State Architecture
All application state lives in `App.jsx`:
- `content`: Markdown source text (auto-saved to localStorage with 500ms debounce)
- `theme`: Dark/light mode (persisted to localStorage)
- `fontSize`: Editor/preview font size (persisted to localStorage)
- `wordCount` / `characterCount`: Computed via `useMemo` from content
- File path state for save operations

### Component Structure
- **App.jsx**: Root component managing all state and localStorage persistence
- **Toolbar.jsx**: File operations, theme toggle, font controls, word/character count display
- **SplitPane.jsx**: Draggable divider component (20%-80% constraint) managing left/right pane widths
- **Editor.jsx**: Textarea with synchronized line numbers, handles scroll sync between line numbers and content
- **Preview.jsx**: Renders markdown with `marked` library and applies `highlight.js` syntax highlighting

### IPC Communication Pattern
React → Preload → Main Process:
1. User clicks "Open" in Toolbar
2. React calls `window.electronAPI.openFile()`
3. Preload forwards to main via `ipcRenderer.invoke('open-file')`
4. Main process shows dialog, reads file, returns `{ filePath, content }`
5. React updates state with result

Same pattern for save operations with `save-file` handler.

### Styling System
- Tailwind CSS v3 with custom theme colors defined in `tailwind.config.js`
- Dark/Light mode via Tailwind's `dark:` variant (controlled by `.dark` class on `<html>`)
- Custom markdown preview styles in `src/index.css` (`.markdown-preview` class)
- Theme colors: Dark `#1e1e1e`, Light `#f5f5f5`, Accent `#3b82f6`

### Markdown Rendering Pipeline
1. User types in Editor component
2. `onChange` updates `content` state in App.jsx
3. `useMemo` recalculates word/character counts
4. Auto-save debounce writes to localStorage
5. Preview component receives new content prop
6. `marked` converts markdown to HTML
7. `highlight.js` processes code blocks via `marked.setOptions({ highlight })`
8. HTML rendered via `dangerouslySetInnerHTML`

## Important Implementation Details

### LocalStorage Keys
- `markdown-content`: Current markdown text
- `markdown-theme`: Theme preference ('dark' or 'light')
- `markdown-fontSize`: Font size (10-24)

### Keyboard Shortcuts
Handled in App.jsx via global `keydown` listener:
- Ctrl/Cmd+N: New file
- Ctrl/Cmd+O: Open file
- Ctrl/Cmd+S: Save file

### Word Count Algorithm
- Splits content by whitespace regex (`/\s+/`)
- Filters out empty strings and whitespace-only entries
- Character count includes all characters (no filtering)

## Electron Security
- `nodeIntegration: false` - Renderer has no direct Node.js access
- `contextIsolation: true` - Preload script isolated from renderer
- Only specific APIs exposed via `contextBridge` in preload.js
