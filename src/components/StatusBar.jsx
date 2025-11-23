import React from 'react';

const StatusBar = ({ lineCount, characterCount }) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-0.5 text-xs border-t"
      style={{
        backgroundColor: '#007acc',
        color: '#ffffff',
        height: '22px',
        borderColor: '#007acc'
      }}
    >
      {/* Left side - Language indicator */}
      <div className="flex items-center gap-4">
        <span className="font-medium">HTML</span>
      </div>

      {/* Right side - Statistics */}
      <div className="flex items-center gap-4">
        <span>Ln {lineCount}</span>
        <span>Characters {characterCount.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default StatusBar;
