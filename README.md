# HTML Code Editor

A modern, desktop HTML code editor built with Electron and Monaco Editor. Features 33+ production-ready templates, live preview, and intelligent code formatting. Built entirely through AI pair programming with Claude Code - documented on YouTube.

> 🎥 **Building in Public:** This editor is being built as part of a YouTube series documenting AI-assisted development. [Watch the series →](https://www.youtube.com/@RogersTestLab)

## Features

### 🎨 Professional Code Editing
- **Monaco Editor** - The same editor that powers VS Code
- **Live Preview** - See your HTML render in real-time
- **Prettier Integration** - Format code with Shift+Alt+F or one click
- **Syntax Highlighting** - Full HTML/CSS/JS support
- **Dark/Light Themes** - Toggle between VS Code-inspired themes

### 📦 Template Library (33+ Templates)
- **Full Page Starters** - Complete landing pages, about pages, contact pages
- **Hero Sections** - Split heroes, centered heroes, hero with forms
- **Navigation & Layout** - Navbars, footers, sidebars, grid layouts
- **Components** - Buttons, cards, alerts, badges, modals, tabs
- **Content Blocks** - Feature grids, testimonials, pricing tables, FAQs
- **Forms** - Contact forms, login forms, newsletter signups, multi-step wizards

All templates use **Tailwind CSS** for modern, responsive styling.

### 🚀 Smart Insertion
- **Full Pages** → Replace entire document
- **Components** → Insert at cursor position
- **Auto-formatted** → HTML comments added for code organization

### 💾 File Management
- Open/Save HTML files
- Export standalone HTML
- Recent files tracking
- Auto-save to localStorage

## Tech Stack

- **Electron** - Cross-platform desktop app framework
- **React** - UI library
- **Monaco Editor** - Professional code editor component
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling (CDN in preview)
- **Prettier** - Automatic code formatting

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rogerstestlab/Publisher.git
cd Publisher

# Install dependencies
npm install
```

### Development

```bash
# Run in development mode (Vite + Electron)
npm run electron:dev

# Or run separately:
npm run dev        # Start Vite dev server
npm run electron   # Start Electron app
```

### Building

```bash
# Build for production
npm run build

# Package as desktop app
npm run package
```

## Keyboard Shortcuts

| Command | Shortcut |
|---------|----------|
| New File | `Ctrl/Cmd + N` |
| Open File | `Ctrl/Cmd + O` |
| Save File | `Ctrl/Cmd + S` |
| Export HTML | `Ctrl/Cmd + E` |
| Format Code | `Shift + Alt + F` |

## Project Structure

```
Publisher/
├── src/
│   ├── components/
│   │   ├── Editor.jsx          # Monaco editor wrapper
│   │   ├── Preview.jsx         # Live HTML preview (iframe)
│   │   ├── TemplatePanel.jsx   # 33-template library sidebar
│   │   ├── SplitPane.jsx       # Draggable divider
│   │   ├── Toolbar.jsx         # Top controls
│   │   └── Toast.jsx           # Notification system
│   ├── App.jsx                 # Root component & state
│   └── main.jsx                # React entry point
├── main.js                     # Electron main process
├── preload.js                  # Electron IPC bridge
└── package.json
```

## Built with AI Pair Programming

This entire editor was built using AI-assisted development with Claude Code. Every feature, bug fix, and architectural decision is documented on YouTube as part of the **"Building a Website Editor with Claude Code"** series on [Rogers Test Lab](https://www.youtube.com/@RogersTestLab).

**Why this matters:** This isn't just another code editor - it's a case study in how AI can accelerate real product development. The template library, formatting integration, and editor UX were all implemented through natural language prompts to Claude.

### YouTube Series Episodes

- **Episode 1-5**: Foundation setup, Monaco integration, template library expansion
- **More episodes coming weekly** - Subscribe to follow along!

[→ Watch the full series](https://www.youtube.com/@RogersTestLab)

## Roadmap

- [ ] Search & Replace (Ctrl+F)
- [ ] Template search/filter
- [ ] Settings panel
- [ ] Custom template creation
- [ ] Multi-file projects
- [ ] Git integration

## Contributing

This is primarily an educational project for the YouTube series, but suggestions and issues are welcome! Feel free to:

- Open an issue for bugs or feature requests
- Submit PRs for improvements
- Share your feedback on YouTube

## License

MIT

## Links

- **YouTube Channel**: [Rogers Test Lab](https://www.youtube.com/@RogersTestLab)
- **GitHub Repository**: [rogerstestlab/Publisher](https://github.com/rogerstestlab/Publisher)

## Acknowledgments

- Built with [Claude Code](https://docs.anthropic.com/claude/docs/claude-code) by Anthropic
- Monaco Editor by Microsoft
- Tailwind CSS for template styling
