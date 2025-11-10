import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import MonacoEditor from '@monaco-editor/react';

const Editor = forwardRef(({ content, onChange, fontSize, theme, isDragging, onFormat }, ref) => {
  const editorRef = useRef(null);
  const decorationsRef = useRef(null);
  const monacoRef = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(
    ref,
    () => ({
      insertTextAtCursor: (text, cursorOffset = 0) => {
        const editor = editorRef.current;
        if (!editor) return;

        const position = editor.getPosition();
        const selection = editor.getSelection();

        // Insert text at cursor position
        editor.executeEdits('', [
          {
            range: selection,
            text: text,
            forceMoveMarkers: true,
          },
        ]);

        // Calculate new cursor position
        const lines = text.substring(0, cursorOffset).split('\n');
        const lineCount = lines.length - 1;
        const lastLineLength = lines[lines.length - 1].length;

        const newPosition = {
          lineNumber: position.lineNumber + lineCount,
          column: lineCount > 0 ? lastLineLength + 1 : position.column + lastLineLength,
        };

        // Set cursor position after insertion
        editor.setPosition(newPosition);
        editor.focus();
      },
      // Replace all editor content (for Full Pages)
      replaceAllContent: (text, cursorOffset = 0) => {
        const editor = editorRef.current;
        if (!editor) return;

        // Replace entire content
        editor.setValue(text);

        // Set cursor position after replacing content
        if (cursorOffset) {
          const model = editor.getModel();
          const position = model.getPositionAt(cursorOffset);
          editor.setPosition(position);
        }

        editor.focus();
      },
      // Get current content from Monaco editor (for formatting)
      getEditorContent: () => {
        const editor = editorRef.current;
        if (!editor) return '';
        return editor.getValue();
      },
      highlightLines: (startLine, endLine) => {
        console.log('highlightLines called with:', startLine, endLine);
        const editor = editorRef.current;
        console.log('Editor exists:', !!editor);
        const monaco = monacoRef.current;
        console.log('Monaco exists:', !!monaco);

        if (!editor || !monaco) return;

        // Clear previous decorations
        if (decorationsRef.current) {
          console.log('Clearing previous decorations');
          decorationsRef.current.clear();
        }

        console.log('Creating new decoration');

        // Create new decoration
        decorationsRef.current = editor.createDecorationsCollection([
          {
            range: new monaco.Range(startLine, 1, endLine, 1),
            options: {
              isWholeLine: true,
              className: 'inspect-highlight',
              glyphMarginClassName: 'inspect-glyph'
            }
          }
        ]);

        console.log('Decoration created');
      },
      clearHighlight: () => {
        if (decorationsRef.current) {
          decorationsRef.current.clear();
          decorationsRef.current = null;
        }
      }
    }),
    []
  );

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.focus();

    // Add keyboard shortcut for formatting (Shift+Alt+F)
    if (onFormat) {
      editor.addAction({
        id: 'format-code',
        label: 'Format Code',
        keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
        run: () => {
          onFormat();
        },
      });
    }
  };

  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  // Monaco Editor options
  const options = {
    fontSize: fontSize,
    fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    lineNumbers: 'on',
    wordWrap: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    formatOnPaste: true,
    formatOnType: true,
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    bracketPairColorization: { enabled: true },
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
    contextmenu: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true,
    },
    suggest: {
      showWords: false,
    },
  };

  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  return (
    <div
      className="h-full w-full bg-light-surface dark:bg-dark-surface"
      style={{ pointerEvents: isDragging ? 'none' : 'auto' }} // Prevent editor from intercepting mouse events during drag
    >
      <MonacoEditor
        height="100%"
        language="html"
        theme={monacoTheme}
        value={content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={options}
        loading={
          <div className="flex items-center justify-center h-full bg-light-surface dark:bg-dark-surface">
            <div className="text-light-text-muted dark:text-dark-text-muted">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
