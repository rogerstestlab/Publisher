import React, { useState } from 'react';

const TEMPLATES = {
  Formatting: [
    { name: 'Bold', icon: '𝗕', template: '**text**', cursorOffset: 2 },
    { name: 'Italic', icon: '𝘐', template: '*text*', cursorOffset: 1 },
    { name: 'Strikethrough', icon: 'S̶', template: '~~text~~', cursorOffset: 2 },
    { name: 'Inline Code', icon: '</>', template: '`code`', cursorOffset: 1 },
    { name: 'Blockquote', icon: '❝', template: '> Quote', cursorOffset: 2 },
    { name: 'Horizontal Rule', icon: '─', template: '\n---\n', cursorOffset: 0 },
  ],
  Lists: [
    { name: 'Unordered List', icon: '•', template: '- Item 1\n- Item 2\n- Item 3', cursorOffset: 2 },
    { name: 'Ordered List', icon: '1.', template: '1. First item\n2. Second item\n3. Third item', cursorOffset: 3 },
    { name: 'Checklist', icon: '☑', template: '- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3', cursorOffset: 6 },
  ],
  Code: [
    { name: 'Code Block', icon: '{ }', template: '```language\ncode here\n```', cursorOffset: 3 },
  ],
  Tables: [
    { name: 'Table', icon: '⊞', template: '| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |', cursorOffset: 2 },
  ],
  Media: [
    { name: 'Link', icon: '🔗', template: '[link text](URL)', cursorOffset: 1 },
    { name: 'Image', icon: '🖼', template: '![alt text](image-url)', cursorOffset: 2 },
  ],
};

const TemplatePanel = ({ isOpen, onToggle, onInsertTemplate }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    Formatting: true,
    Lists: true,
    Code: true,
    Tables: true,
    Media: true,
  });

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isOpen) {
    return (
      <div className="h-full flex items-center justify-center w-10 border-r border-dark-border" style={{ backgroundColor: '#252526' }}>
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
          title="Show Templates"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r border-dark-border" style={{ width: '150px', backgroundColor: '#252526' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: '#3e3e42' }}>
        <span className="text-xs font-semibold" style={{ color: '#cccccc' }}>Templates</span>
        <button
          onClick={onToggle}
          className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
          title="Hide Templates"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Template Categories */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(TEMPLATES).map(([category, templates]) => (
          <div key={category} className="border-b" style={{ borderColor: '#3e3e42' }}>
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors"
              style={{ color: '#8c8c8c' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2d2e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>{category}</span>
              <svg
                className={`w-3 h-3 transition-transform ${expandedCategories[category] ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Template Buttons */}
            {expandedCategories[category] && (
              <div className="py-1">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => onInsertTemplate(template)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left"
                    style={{ color: '#cccccc' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2d2e'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title={template.name}
                  >
                    <span className="text-sm">{template.icon}</span>
                    <span className="truncate">{template.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatePanel;
