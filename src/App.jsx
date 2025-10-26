import React, { useState, useEffect, useMemo, useRef } from 'react';
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, currentFilePath]);

  return (
    <div className="h-screen w-screen flex flex-col bg-light-bg dark:bg-dark-bg overflow-hidden">
      <Toolbar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
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
