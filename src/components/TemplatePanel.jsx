import React, { useState } from 'react';

const TEMPLATES = {
  'Full Pages': [],
  'Hero Sections': [
    {
      name: 'Hero Section',
      icon: '🎯',
      template: '<section class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">\n  <div class="container mx-auto text-center">\n    <h1 class="text-5xl font-bold mb-4">Welcome to Our Site</h1>\n    <p class="text-xl mb-8">Create something amazing today</p>\n    <button class="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">Get Started</button>\n  </div>\n</section>',
      cursorOffset: 128
    }
  ],
  Components: [
    {
      name: 'Button',
      icon: '🔘',
      template: '<button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">\n  Click Me\n</button>',
      cursorOffset: 109
    },
    {
      name: 'Card',
      icon: '🃏',
      template: '<div class="bg-white rounded-lg shadow-lg p-6 max-w-sm">\n  <h3 class="text-xl font-bold text-gray-800 mb-2">Card Title</h3>\n  <p class="text-gray-600">Card content goes here</p>\n</div>',
      cursorOffset: 77
    },
    {
      name: 'Form Input',
      icon: '📝',
      template: '<div class="mb-4">\n  <label class="block text-gray-700 text-sm font-bold mb-2" for="input-id">\n    Label\n  </label>\n  <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="input-id" type="text" placeholder="Enter text">\n</div>',
      cursorOffset: 85
    },
  ],
  Forms: [],
  'Content Blocks': [],
  'Navigation & Layout': [
    {
      name: 'Navigation Bar',
      icon: '📊',
      template: '<nav class="bg-gray-800 text-white p-4">\n  <div class="container mx-auto flex justify-between items-center">\n    <div class="text-xl font-bold">Logo</div>\n    <div class="space-x-4">\n      <a href="#" class="hover:text-gray-300">Home</a>\n      <a href="#" class="hover:text-gray-300">About</a>\n      <a href="#" class="hover:text-gray-300">Contact</a>\n    </div>\n  </div>\n</nav>',
      cursorOffset: 122
    },
    {
      name: 'Grid Layout',
      icon: '⊞',
      template: '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n  <div class="bg-gray-100 p-6 rounded-lg">Grid Item 1</div>\n  <div class="bg-gray-100 p-6 rounded-lg">Grid Item 2</div>\n  <div class="bg-gray-100 p-6 rounded-lg">Grid Item 3</div>\n</div>',
      cursorOffset: 110
    },
    {
      name: 'Footer',
      icon: '⬇️',
      template: '<footer class="bg-gray-800 text-white py-8 mt-auto">\n  <div class="container mx-auto text-center">\n    <p>&copy; 2025 Your Company. All rights reserved.</p>\n    <div class="mt-4 space-x-4">\n      <a href="#" class="hover:text-gray-300">Privacy</a>\n      <a href="#" class="hover:text-gray-300">Terms</a>\n      <a href="#" class="hover:text-gray-300">Contact</a>\n    </div>\n  </div>\n</footer>',
      cursorOffset: 103
    },
  ],
};

const TemplatePanel = ({ isOpen, onToggle, onInsertTemplate }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    'Full Pages': false,
    'Hero Sections': false,
    Components: true,
    Forms: false,
    'Content Blocks': false,
    'Navigation & Layout': true,
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
              <span className="text-left flex-1">{category}</span>
              <svg
                className={`w-3 h-3 transition-transform flex-shrink-0 ${expandedCategories[category] ? 'rotate-90' : ''}`}
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
