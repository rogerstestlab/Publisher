import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const Editor = forwardRef(({ content, onChange, fontSize }, ref) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Expose method to insert text at cursor position
  useImperativeHandle(
    ref,
    () => ({
      insertTextAtCursor: (text, cursorOffset = 0) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = content;

        // Save current scroll position
        const scrollTop = textarea.scrollTop;
        const scrollLeft = textarea.scrollLeft;

        // Insert text at cursor position
        const newContent =
          currentContent.substring(0, start) + text + currentContent.substring(end);

        onChange(newContent);

        // Set cursor position after insertion and restore scroll position
        setTimeout(() => {
          const newCursorPos = start + cursorOffset;
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);

          // Restore scroll position
          textarea.scrollTop = scrollTop;
          textarea.scrollLeft = scrollLeft;
        }, 0);
      },
    }),
    [content, onChange]
  );

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleInput = (e) => {
    onChange(e.target.value);
  };

  const lineCount = content.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  useEffect(() => {
    if (textareaRef.current) {
      // Sync scroll position
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }
  }, [content]);

  return (
    <div className="flex h-full bg-light-surface dark:bg-dark-surface">
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="flex flex-col overflow-y-auto overflow-x-hidden bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border py-4 px-2 select-none"
        style={{ fontSize: `${fontSize}px` }}
      >
        {lineNumbers.map((num) => (
          <div
            key={num}
            className="text-light-text-muted dark:text-dark-text-muted text-right font-mono leading-6 px-2"
            style={{ minHeight: '24px' }}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleInput}
        onScroll={handleScroll}
        className="flex-1 resize-none outline-none font-mono bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text p-4 leading-6 overflow-y-auto"
        style={{ fontSize: `${fontSize}px` }}
        spellCheck="false"
        placeholder="# Start typing markdown here..."
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
