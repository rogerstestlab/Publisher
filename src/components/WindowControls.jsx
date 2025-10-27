import React from 'react';

const WindowControls = () => {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.windowMinimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.windowMaximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.windowClose();
    }
  };

  return (
    <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
      {/* Minimize Button */}
      <button
        onClick={handleMinimize}
        className="w-12 h-full flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
        title="Minimize"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      {/* Maximize/Restore Button */}
      <button
        onClick={handleMaximize}
        className="w-12 h-full flex items-center justify-center text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
        title="Maximize"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </button>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="w-12 h-full flex items-center justify-center text-light-text dark:text-dark-text hover:bg-red-600 hover:text-white transition-colors"
        title="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default WindowControls;
