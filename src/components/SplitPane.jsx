import React, { useState, useRef, useEffect } from 'react';

const SplitPane = ({ left, right }) => {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const splitPaneRef = useRef(null);
  const leftPaneRef = useRef(null);
  const rightPaneRef = useRef(null);
  const currentWidthRef = useRef(50);

  // Sync ref with state
  useEffect(() => {
    currentWidthRef.current = leftWidth;
  }, [leftWidth]);

  // Recursively inject isDragging prop into all React elements
  const injectIsDragging = (children) => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      // Clone the element and inject isDragging
      const clonedElement = React.cloneElement(child, { isDragging });

      // If the element has children, recursively inject into them too
      if (child.props && child.props.children) {
        return React.cloneElement(clonedElement, {
          children: injectIsDragging(child.props.children)
        });
      }

      return clonedElement;
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !splitPaneRef.current || !leftPaneRef.current || !rightPaneRef.current) return;

      // Prevent default to avoid text selection
      e.preventDefault();

      const container = splitPaneRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 80%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);

      // Store in ref
      currentWidthRef.current = constrainedWidth;

      // Directly manipulate DOM for instant feedback (no React re-render during drag)
      leftPaneRef.current.style.width = `${constrainedWidth}%`;
      rightPaneRef.current.style.width = `${100 - constrainedWidth}%`;
    };

    const handleMouseUp = () => {
      const finalWidth = currentWidthRef.current;

      console.log(`[SplitPane] Drag ended at width: ${finalWidth.toFixed(2)}%`);

      // Update React state with final width (single re-render at end)
      setLeftWidth(finalWidth);
      setIsDragging(false);

      // Restore cursor and user-select
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isDragging) {
      console.log(`[SplitPane] Drag started at width: ${currentWidthRef.current.toFixed(2)}%`);

      // Lock cursor and prevent text selection during drag
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // Only depend on isDragging - use ref for width updates

  // Inject isDragging into children to prevent iframe/editor from blocking mouse events
  const leftWithDragging = injectIsDragging(left);
  const rightWithDragging = injectIsDragging(right);

  return (
    <div ref={splitPaneRef} className="flex h-full w-full overflow-hidden">
      <div
        ref={leftPaneRef}
        style={{ width: `${leftWidth}%` }}
        className="h-full overflow-hidden"
      >
        {leftWithDragging}
      </div>

      <div
        className="w-1 bg-dark-border dark:bg-dark-border hover:bg-accent cursor-col-resize relative group"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      <div
        ref={rightPaneRef}
        style={{ width: `${100 - leftWidth}%` }}
        className="h-full overflow-hidden"
      >
        {rightWithDragging}
      </div>
    </div>
  );
};

export default SplitPane;
