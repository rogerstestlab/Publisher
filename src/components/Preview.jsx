import { useMemo } from 'react';

const Preview = ({ content, fontSize, inspectModeEnabled, isDragging }) => {
  const htmlContent = useMemo(() => {

    try {
      // Prepare the HTML content with Tailwind CDN injected
      let html = content || '<!DOCTYPE html><html><body><p>Start typing HTML to see the preview...</p></body></html>';

      // Check if the HTML already has Tailwind CDN link
      const hasTailwindCDN = html.includes('cdn.tailwindcss.com');

      // If no Tailwind CDN, inject it before closing </head> or at the start of <body>
      if (!hasTailwindCDN) {
        const tailwindScript = '<script src="https://cdn.tailwindcss.com"></script>';

        if (html.includes('</head>')) {
          // Insert before closing </head> tag
          html = html.replace('</head>', `  ${tailwindScript}\n</head>`);
        } else if (html.includes('<body>')) {
          // Insert after opening <body> tag
          html = html.replace('<body>', `<body>\n  ${tailwindScript}`);
        } else {
          // Wrap content with basic HTML structure and Tailwind
          html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${tailwindScript}
</head>
<body>
  ${html}
</body>
</html>`;
        }
      }

      // Inject hover tracking script when Inspect Mode is enabled
      if (inspectModeEnabled) {
        const hoverScript = `
<script>
(function() {
  let hoveredElement = null;
  let lockedElement = null;

  function getSelector(el) {
    if (!el || el === document.body) return 'body';

    let selector = el.tagName.toLowerCase();
    if (el.id) selector += '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.trim().split(/\\s+/).slice(0, 2);
      selector += '.' + classes.join('.');
    }
    return selector;
  }

  // Click handler: lock/unlock element selection
  document.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (lockedElement === e.target) {
      // Clicking same element unlocks it
      lockedElement.style.outline = '';
      lockedElement = null;
    } else {
      // Clear previous lock if any
      if (lockedElement) {
        lockedElement.style.outline = '';
      }

      // Lock the new element with thicker outline
      lockedElement = e.target;
      lockedElement.style.outline = '3px solid #3b82f6';
      lockedElement.style.outlineOffset = '2px';

      // Send lock message to parent
      try {
        const message = {
          type: 'element-hover',
          selector: getSelector(lockedElement),
          innerHTML: lockedElement.innerHTML.substring(0, 100),
          tagName: lockedElement.tagName
        };
        window.top.postMessage(message, '*');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  });

  // Mouseover handler: only change highlight if no element is locked
  document.addEventListener('mouseover', function(e) {
    if (lockedElement) return; // Don't change highlight if locked

    e.stopPropagation();
    const el = e.target;

    if (hoveredElement) {
      hoveredElement.style.outline = '';
    }

    hoveredElement = el;
    el.style.outline = '2px solid #3b82f6';
    el.style.outlineOffset = '2px';

    try {
      const message = {
        type: 'element-hover',
        selector: getSelector(el),
        innerHTML: el.innerHTML.substring(0, 100),
        tagName: el.tagName
      };
      window.top.postMessage(message, '*');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  // Mouseout handler: only remove highlight if no element is locked
  document.addEventListener('mouseout', function(e) {
    if (lockedElement) return; // Don't remove highlight if locked

    if (hoveredElement) {
      hoveredElement.style.outline = '';
      hoveredElement = null;
    }
  });
})();
</script>`;

        // Insert the script before closing </body> tag, or at the end if no </body> exists
        if (html.includes('</body>')) {
          html = html.replace('</body>', `${hoverScript}\n</body>`);
        } else {
          html += hoverScript;
        }
      }

      return html;
    } catch (error) {
      // Handle errors gracefully
      console.error('Error rendering HTML:', error);
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      background: #fee;
    }
  </style>
</head>
<body>
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    <strong class="font-bold">Error rendering HTML:</strong>
    <span class="block sm:inline">${error.message}</span>
  </div>
</body>
</html>`;
    }
  }, [content, inspectModeEnabled]);

  return (
    <div className="h-full overflow-hidden bg-light-bg dark:bg-dark-bg">
      <iframe
        srcDoc={htmlContent}
        className={`w-full h-full border-0 ${inspectModeEnabled ? 'ring-2 ring-blue-500' : ''}`}
        title="HTML Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-top-navigation-by-user-activation"
        style={{
          fontSize: `${fontSize}px`,
          cursor: inspectModeEnabled ? 'crosshair' : 'default'
        }}
      />
    </div>
  );
};

export default Preview;
