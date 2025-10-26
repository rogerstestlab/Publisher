import React from 'react';

const Toolbar = ({
  onNew,
  onOpen,
  onSave,
  theme,
  onThemeToggle,
  fontSize,
  onFontSizeChange,
  currentFileName,
  wordCount,
  characterCount
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
      {/* Left side - File operations */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          className="px-3 py-1.5 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors"
          title="New File (Ctrl+N)"
        >
          New
        </button>
        <button
          onClick={onOpen}
          className="px-3 py-1.5 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors"
          title="Open File (Ctrl+O)"
        >
          Open
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1.5 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors"
          title="Save File (Ctrl+S)"
        >
          Save
        </button>

        {currentFileName && (
          <span className="ml-4 text-sm text-light-text-muted dark:text-dark-text-muted">
            {currentFileName}
          </span>
        )}
      </div>

      {/* Right side - Theme and font controls */}
      <div className="flex items-center gap-3">
        {/* Font size controls */}
        <div className="flex items-center gap-2 border-r border-light-border dark:border-dark-border pr-3">
          <button
            onClick={() => onFontSizeChange(fontSize - 1)}
            disabled={fontSize <= 10}
            className="w-7 h-7 flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Decrease Font Size"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-light-text-muted dark:text-dark-text-muted w-8 text-center">
            {fontSize}
          </span>
          <button
            onClick={() => onFontSizeChange(fontSize + 1)}
            disabled={fontSize >= 24}
            className="w-7 h-7 flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Increase Font Size"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Word and character count */}
        <div className="flex items-center gap-2 border-r border-light-border dark:border-dark-border pr-3">
          <svg
            className="w-4 h-4"
            style={{ color: '#9ca3af' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span
            className="text-xs font-medium select-none transition-opacity duration-200"
            style={{ color: '#9ca3af' }}
            title="Document statistics"
          >
            Words: {wordCount} | Characters: {characterCount}
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="w-9 h-9 flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg rounded transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
