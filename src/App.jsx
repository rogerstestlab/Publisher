import React, { useState, useEffect, useMemo, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import SplitPane from './components/SplitPane';
import TemplatePanel from './components/TemplatePanel';
import Toast from './components/Toast';
import * as prettier from 'prettier';
import prettierPluginHtml from 'prettier/plugins/html';

const DEFAULT_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HTML Code Editor</title>
</head>
<body>
  <!-- Welcome Section -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">HTML Code Editor</h1>
        <p class="text-xl text-gray-600">Build beautiful interfaces with HTML, CSS, and JavaScript</p>
      </header>

      <!-- Feature Cards -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-semibold mb-2 text-gray-800">Live Preview</h3>
          <p class="text-gray-600">See your changes instantly as you type</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">🎨</div>
          <h3 class="text-xl font-semibold mb-2 text-gray-800">Tailwind CSS</h3>
          <p class="text-gray-600">Utility-first CSS framework built-in</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">🚀</div>
          <h3 class="text-xl font-semibold mb-2 text-gray-800">Interactive</h3>
          <p class="text-gray-600">Add JavaScript for dynamic behavior</p>
        </div>
      </div>

      <!-- Interactive Demo -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Interactive Demo</h2>
        <p class="text-gray-600 mb-4">Click the button below to see JavaScript in action:</p>

        <button
          id="demoButton"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Click Me!
        </button>

        <p id="output" class="mt-4 text-lg font-semibold text-green-600"></p>
      </div>

      <!-- Getting Started -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            Edit the HTML on the left to see changes instantly
          </li>
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            Use Tailwind CSS classes for styling (e.g., <code class="bg-gray-100 px-2 py-1 rounded">class="text-blue-500"</code>)
          </li>
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            Add JavaScript in &lt;script&gt; tags for interactivity
          </li>
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            Include custom CSS in &lt;style&gt; tags if needed
          </li>
        </ul>
      </div>

    </div>
  </div>

  <!-- Custom Styles -->
  <style>
    /* Add your custom CSS here */
    code {
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
  </style>

  <!-- JavaScript -->
  <script>
    // Add your JavaScript here
    let clickCount = 0;

    document.getElementById('demoButton').addEventListener('click', function() {
      clickCount++;
      const output = document.getElementById('output');
      output.textContent = \`Button clicked \${clickCount} time\${clickCount !== 1 ? 's' : ''}!\`;

      // Add a fun animation
      this.classList.add('scale-95');
      setTimeout(() => this.classList.remove('scale-95'), 100);
    });
  </script>
</body>
</html>`;

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Find line numbers for HTML element matching the selector
function findElementLines(content, selector, innerHTML) {
  if (!content || !selector) return null;

  // Extract just the tag name
  const tagMatch = selector.match(/^(\w+)/);
  if (!tagMatch) return null;

  const tagName = tagMatch[1].toLowerCase();
  const searchPattern = `<${tagName}`;

  const lines = content.split('\n');
  const matches = [];

  // Find all lines with this tag
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchPattern)) {
      matches.push(i);
    }
  }

  if (matches.length === 0) return null;

  // If only one match, use it
  if (matches.length === 1) {
    const startLine = matches[0];
    let endLine = startLine;
    for (let i = startLine; i < Math.min(startLine + 10, lines.length); i++) {
      if (lines[i].includes(`</${tagName}`)) {
        endLine = i;
        break;
      }
    }
    return { startLine: startLine + 1, endLine: endLine + 1 };
  }

  // Multiple matches - use innerHTML to find the right one
  if (innerHTML && innerHTML.trim().length > 0) {
    // Get a meaningful snippet from innerHTML (remove extra whitespace)
    const contentSnippet = innerHTML
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, 50);

    console.log('Looking for content snippet:', contentSnippet);

    for (const lineNum of matches) {
      // Check this tag and the next 5 lines for the innerHTML content
      const searchWindow = lines
        .slice(lineNum, Math.min(lineNum + 6, lines.length))
        .join(' ')
        .replace(/\s+/g, ' ');

      // Check if the content snippet appears in this section
      if (searchWindow.includes(contentSnippet)) {
        console.log('Found match at line:', lineNum + 1);

        let endLine = lineNum;
        for (let i = lineNum; i < Math.min(lineNum + 10, lines.length); i++) {
          if (lines[i].includes(`</${tagName}`)) {
            endLine = i;
            break;
          }
        }

        return { startLine: lineNum + 1, endLine: endLine + 1 };
      }
    }
  }

  // Fallback to first match if innerHTML matching fails
  console.log('Using first match as fallback');
  const startLine = matches[0];
  let endLine = startLine;
  for (let i = startLine; i < Math.min(startLine + 10, lines.length); i++) {
    if (lines[i].includes(`</${tagName}`)) {
      endLine = i;
      break;
    }
  }
  return { startLine: startLine + 1, endLine: endLine + 1 };
}

function App() {
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [currentFilePath, setCurrentFilePath] = useState(null);
  const [currentFileName, setCurrentFileName] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [inspectModeEnabled, setInspectModeEnabled] = useState(false);

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
    const savedContent = localStorage.getItem('html-editor-content');
    const savedTheme = localStorage.getItem('html-editor-theme');
    const savedFontSize = localStorage.getItem('html-editor-fontSize');

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
    localStorage.setItem('html-editor-theme', theme);
  }, [theme]);

  // Auto-save content to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('html-editor-content', content);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [content]);

  // Save font size preference
  useEffect(() => {
    localStorage.setItem('html-editor-fontSize', fontSize.toString());
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
      // Export the current HTML content as-is
      const result = await window.electronAPI.exportHTML(content);
      if (result) {
        setToast({ show: true, message: `Exported to ${result}` });
      }
    } catch (error) {
      console.error('Error exporting HTML:', error);
      alert('Failed to export HTML');
    }
  };

  const handleFormatCode = async () => {
    try {
      // Get current content directly from Monaco editor (not from React state)
      // This ensures we always format the latest content, especially for keyboard shortcuts
      if (!editorRef.current) {
        console.error('Editor ref not available');
        return;
      }

      const currentContent = editorRef.current.getEditorContent();

      if (!currentContent || currentContent.trim().length === 0) {
        setToast({ show: true, message: 'Nothing to format' });
        return;
      }

      // Format with Prettier
      const formattedContent = await prettier.format(currentContent, {
        parser: 'html',
        plugins: [prettierPluginHtml],
        tabWidth: 2,
        printWidth: 100,
        htmlWhitespaceSensitivity: 'ignore',
      });

      // Update content with formatted version
      setContent(formattedContent);
      setToast({ show: true, message: 'Code formatted ✓' });
    } catch (error) {
      console.error('Error formatting code:', error);
      setToast({ show: true, message: 'Unable to format - check HTML syntax' });
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

  const handleInspectModeToggle = () => {
    const newValue = !inspectModeEnabled;
    setInspectModeEnabled(newValue);

    if (newValue) {
      setToast({ show: true, message: 'Inspect Mode enabled 🔍' });
    }
  };

  const handleInsertTemplate = ({ template, category }) => {
    if (editorRef.current) {
      // Check if this is a Full Page template
      if (category === 'Full Pages') {
        // Replace entire content for Full Pages
        editorRef.current.replaceAllContent(template.template, template.cursorOffset);
        setToast({ show: true, message: 'Page template loaded' });
      } else {
        // Insert at cursor for all other categories
        editorRef.current.insertTextAtCursor(template.template, template.cursorOffset);
        setToast({ show: true, message: 'Template inserted' });
      }
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

  // Preview iframe message listener for hover events
  useEffect(() => {
    console.log('Setting up message listener');

    const debouncedHandler = debounce((event) => {
      if (event.data.type !== 'element-hover') return;

      const { selector, innerHTML, tagName } = event.data;
      const matchResult = findElementLines(content, selector, innerHTML);

      if (matchResult && editorRef.current) {
        editorRef.current.highlightLines(matchResult.startLine, matchResult.endLine);
      } else if (editorRef.current) {
        editorRef.current.clearHighlight();
      }
    }, 50);

    const handlePreviewMessage = (event) => {
      debouncedHandler(event);
    };

    window.addEventListener('message', handlePreviewMessage);
    console.log('Message listener attached');

    return () => {
      window.removeEventListener('message', handlePreviewMessage);
      console.log('Message listener removed');
    };
  }, [content]);

  // Clear highlights when Inspect Mode is disabled
  useEffect(() => {
    if (!inspectModeEnabled && editorRef.current) {
      editorRef.current.clearHighlight();
    }
  }, [inspectModeEnabled]);

  // Menu event listeners - only set up once on mount
  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onMenuNew(() => handleNew());
    window.electronAPI.onMenuOpen(() => handleOpen());
    window.electronAPI.onMenuSave(() => handleSave());
    window.electronAPI.onMenuExport(() => handleExport());
    window.electronAPI.onMenuOpenRecent((filePath) => handleOpenRecent(filePath));

    // No cleanup needed - Electron IPC listeners persist for the app lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-light-bg dark:bg-dark-bg overflow-hidden">
      <Toolbar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onExport={handleExport}
        onFormat={handleFormatCode}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        currentFileName={currentFileName}
        wordCount={wordCount}
        characterCount={characterCount}
        inspectModeEnabled={inspectModeEnabled}
        onInspectModeToggle={handleInspectModeToggle}
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
                <Editor ref={editorRef} content={content} onChange={setContent} fontSize={fontSize} theme={theme} onFormat={handleFormatCode} />
              </div>
            </div>
          }
          right={<Preview content={content} fontSize={fontSize} inspectModeEnabled={inspectModeEnabled} />}
        />
      </div>

      <Toast show={toast.show} message={toast.message} onClose={handleCloseToast} />
    </div>
  );
}

export default App;
