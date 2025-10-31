import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import MonacoEditor from '@monaco-editor/react';

const Editor = forwardRef(({ content, onChange, fontSize, theme }, ref) => {
  const editorRef = useRef(null);

  // Expose method to insert text at cursor position (for template insertion)
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
    }),
    []
  );

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
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
    <div className="h-full w-full bg-light-surface dark:bg-dark-surface">
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
