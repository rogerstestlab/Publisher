import React, { useState, useEffect, useMemo, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import SplitPane from './components/SplitPane';
import TemplatePanel from './components/TemplatePanel';
import Toast from './components/Toast';

const DEFAULT_CONTENT = `# Welcome to Markdown Previewer

## Features

- **Split-pane design** with draggable divider
- **Live preview** with syntax highlighting
- **Dark/Light theme** support
- **Auto-save** to localStorage
- **File operations** (New, Open, Save)
- **Font size controls**

## Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item

### Ordered List
1. First item
2. Second item
3. Third item

## Blockquote

> This is a blockquote.
> It can span multiple lines.

## Table

| Feature | Status |
|---------|--------|
| Markdown | ✓ |
| Syntax Highlighting | ✓ |
| Dark Theme | ✓ |

## Link

[Visit GitHub](https://github.com)

---

**Happy writing!**
`;

function App() {
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [currentFilePath, setCurrentFilePath] = useState(null);
  const [currentFileName, setCurrentFileName] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  const editorRef = useRef(null);

  // Calculate word and character counts
  const { wordCount, characterCount } = useMemo(() => {
    // Character count includes all characters
    const charCount = content.length;

    // Word count: split by whitespace, filter out empty strings and whitespace-only entries
    const words = content
      .split(/\s+/)
      .filter(word => word.trim().length > 0);

    return {
      wordCount: words.length,
      characterCount: charCount
    };
  }, [content]);

  // Load saved content and preferences on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('markdown-content');
    const savedTheme = localStorage.getItem('markdown-theme');
    const savedFontSize = localStorage.getItem('markdown-fontSize');

    setContent(savedContent || DEFAULT_CONTENT);
    setTheme(savedTheme || 'dark');
    setFontSize(parseInt(savedFontSize) || 14);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('markdown-theme', theme);
  }, [theme]);

  // Auto-save content to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('markdown-content', content);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [content]);

  // Save font size preference
  useEffect(() => {
    localStorage.setItem('markdown-fontSize', fontSize.toString());
  }, [fontSize]);

  const handleNew = () => {
    if (content && content !== DEFAULT_CONTENT) {
      const confirmed = confirm('Create a new file? Any unsaved changes will be lost.');
      if (!confirmed) return;
    }
    setContent(DEFAULT_CONTENT);
    setCurrentFilePath(null);
    setCurrentFileName(null);
  };

  const handleOpen = async () => {
    if (!window.electronAPI) {
      alert('File operations are only available in Electron app');
      return;
    }

    try {
      const result = await window.electronAPI.openFile();
      if (result) {
        setContent(result.content);
        setCurrentFilePath(result.filePath);
        setCurrentFileName(result.filePath.split('/').pop());
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open file');
    }
  };

  const handleSave = async () => {
    if (!window.electronAPI) {
      alert('File operations are only available in Electron app');
      return;
    }

    try {
      const filePath = await window.electronAPI.saveFile(content, currentFilePath);
      if (filePath) {
        setCurrentFilePath(filePath);
        setCurrentFileName(filePath.split('/').pop());
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    }
  };

  const handleExport = async () => {
    if (!window.electronAPI) {
      alert('Export is only available in Electron app');
      return;
    }

    try {
      // Configure marked the same way as in Preview.jsx
      marked.setOptions({
        highlight: function(code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
              console.error(err);
            }
          }
          return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
      });

      // Convert markdown to HTML
      const markdownHtml = marked(content || '# Welcome to Markdown Previewer\n\nStart typing to see the preview!');

      // Create standalone HTML document
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentFileName ? currentFileName.replace('.md', '') : 'Markdown Export'}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${theme === 'dark' ? 'github-dark' : 'github'}.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: ${theme === 'dark' ? '#1e1e1e' : '#f5f5f5'};
      color: ${theme === 'dark' ? '#e0e0e0' : '#1a1a1a'};
      padding: 32px 16px;
      min-height: 100vh;
    }

    code {
      font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
    }

    /* Custom scrollbar styles */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: ${theme === 'dark' ? '#444' : '#888'};
      border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${theme === 'dark' ? '#666' : '#555'};
    }

    /* Markdown preview styles */
    .markdown-preview {
      line-height: 1.6;
      word-wrap: break-word;
      max-width: 1024px;
      margin: 0 auto;
      font-size: ${fontSize}px;
    }

    .markdown-preview h1,
    .markdown-preview h2,
    .markdown-preview h3,
    .markdown-preview h4,
    .markdown-preview h5,
    .markdown-preview h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    .markdown-preview h1 {
      font-size: 2em;
      border-bottom: 1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'};
      padding-bottom: 0.3em;
    }

    .markdown-preview h2 {
      font-size: 1.5em;
      border-bottom: 1px solid ${theme === 'dark' ? '#333' : '#e0e0e0'};
      padding-bottom: 0.3em;
    }

    .markdown-preview h3 {
      font-size: 1.25em;
    }

    .markdown-preview h4 {
      font-size: 1em;
    }

    .markdown-preview h5 {
      font-size: 0.875em;
    }

    .markdown-preview h6 {
      font-size: 0.85em;
      color: ${theme === 'dark' ? '#999' : '#666'};
    }

    .markdown-preview p {
      margin-top: 0;
      margin-bottom: 16px;
    }

    .markdown-preview ul,
    .markdown-preview ol {
      margin-top: 0;
      margin-bottom: 16px;
      padding-left: 2em;
    }

    .markdown-preview li + li {
      margin-top: 0.25em;
    }

    .markdown-preview blockquote {
      margin: 16px 0;
      padding: 0 1em;
      color: ${theme === 'dark' ? '#999' : '#666'};
      border-left: 0.25em solid ${theme === 'dark' ? '#444' : '#ddd'};
    }

    .markdown-preview code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: ${theme === 'dark' ? 'rgba(110, 118, 129, 0.4)' : 'rgba(175, 184, 193, 0.2)'};
      border-radius: 6px;
    }

    .markdown-preview pre {
      margin-bottom: 16px;
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: ${theme === 'dark' ? '#161b22' : '#f6f8fa'};
      border-radius: 6px;
    }

    .markdown-preview pre code {
      display: inline;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: transparent;
      border: 0;
    }

    .markdown-preview table {
      border-spacing: 0;
      border-collapse: collapse;
      margin-bottom: 16px;
      width: 100%;
    }

    .markdown-preview table th,
    .markdown-preview table td {
      padding: 6px 13px;
      border: 1px solid ${theme === 'dark' ? '#333' : '#ddd'};
    }

    .markdown-preview table th {
      font-weight: 600;
      background-color: ${theme === 'dark' ? '#161b22' : '#f6f8fa'};
    }

    .markdown-preview table tr:nth-child(2n) {
      background-color: ${theme === 'dark' ? '#0d1117' : '#f6f8fa'};
    }

    .markdown-preview a {
      color: #3b82f6;
      text-decoration: none;
    }

    .markdown-preview a:hover {
      text-decoration: underline;
    }

    .markdown-preview hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: ${theme === 'dark' ? '#30363d' : '#e1e4e8'};
      border: 0;
    }

    .markdown-preview img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="markdown-preview">
    ${markdownHtml}
  </div>
</body>
</html>`;

      // Call Electron API to save file
      const result = await window.electronAPI.exportHTML(htmlContent);
      if (result) {
        setToast({ show: true, message: `Exported to ${result}` });
      }
    } catch (error) {
      console.error('Error exporting HTML:', error);
      alert('Failed to export HTML');
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFontSizeChange = (newSize) => {
    if (newSize >= 10 && newSize <= 24) {
      setFontSize(newSize);
    }
  };

  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleInsertTemplate = (template) => {
    if (editorRef.current) {
      editorRef.current.insertTextAtCursor(template.template, template.cursorOffset);
      setToast({ show: true, message: 'Template inserted' });
    }
  };

  const handleCloseToast = () => {
    setToast({ show: false, message: '' });
  };

  // Handle opening recent files
  const handleOpenRecent = async (filePath) => {
    if (!window.electronAPI) {
      alert('File operations are only available in Electron app');
      return;
    }

    try {
      const result = await window.electronAPI.openRecentFile(filePath);
      if (result) {
        setContent(result.content);
        setCurrentFilePath(result.filePath);
        setCurrentFileName(result.filePath.split('/').pop());
      } else {
        alert(`Failed to open ${filePath}. File may have been moved or deleted.`);
      }
    } catch (error) {
      console.error('Error opening recent file:', error);
      alert('Failed to open file');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNew();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, currentFilePath, theme, fontSize, currentFileName]);

  // Menu event listeners
  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onMenuNew(() => handleNew());
    window.electronAPI.onMenuOpen(() => handleOpen());
    window.electronAPI.onMenuSave(() => handleSave());
    window.electronAPI.onMenuExport(() => handleExport());
    window.electronAPI.onMenuOpenRecent((filePath) => handleOpenRecent(filePath));
  }, [content, currentFilePath, theme, fontSize, currentFileName]);

  return (
    <div className="h-screen w-screen flex flex-col bg-light-bg dark:bg-dark-bg overflow-hidden">
      <Toolbar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onExport={handleExport}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        currentFileName={currentFileName}
        wordCount={wordCount}
        characterCount={characterCount}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <SplitPane
          left={
            <div className="flex h-full">
              <TemplatePanel
                isOpen={isPanelOpen}
                onToggle={handleTogglePanel}
                onInsertTemplate={handleInsertTemplate}
              />
              <div className="flex-1 h-full overflow-hidden">
                <Editor ref={editorRef} content={content} onChange={setContent} fontSize={fontSize} />
              </div>
            </div>
          }
          right={<Preview content={content} fontSize={fontSize} />}
        />
      </div>

      <Toast show={toast.show} message={toast.message} onClose={handleCloseToast} />
    </div>
  );
}

export default App;
