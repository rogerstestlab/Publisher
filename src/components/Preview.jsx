import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const Preview = ({ content, fontSize }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    // Configure marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error(err);
          }
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true
    });
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      // Highlight code blocks after content is rendered
      previewRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [content]);

  const html = marked(content || '# Welcome to Markdown Previewer\n\nStart typing to see the preview!');

  return (
    <div className="h-full overflow-auto bg-light-bg dark:bg-dark-bg">
      <div
        ref={previewRef}
        className="markdown-preview p-8 text-light-text dark:text-dark-text max-w-4xl mx-auto"
        style={{ fontSize: `${fontSize}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default Preview;
