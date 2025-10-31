import React, { useMemo } from 'react';

const Preview = ({ content, fontSize }) => {
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
  }, [content]);

  return (
    <div className="h-full overflow-hidden bg-light-bg dark:bg-dark-bg">
      <iframe
        srcDoc={htmlContent}
        className="w-full h-full border-0"
        title="HTML Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

export default Preview;
