# Episode 7 Plan - Inspect Mode Polish + Click-to-Lock

## Objective
Polish the Inspect Mode feature from Episode 6 by adding auto-scroll functionality, implementing click-to-lock selection, and cleaning up development console logs for a production-ready experience.

## Tasks

### ✅ Phase 1: Auto-Scroll Enhancement (5 minutes)
- [ ] Open `src/components/Editor.jsx`
- [ ] Navigate to `highlightLines` method (line ~90)
- [ ] Add auto-scroll after decoration creation:
  ```javascript
  editor.revealLineInCenterIfOutsideViewport(startLine);
  ```
- [ ] Test with long HTML file (Landing Page template)
- [ ] Verify editor scrolls when hovering on off-screen elements

### ✅ Phase 2: Console Cleanup (10 minutes)

**Remove debug logs from Preview.jsx:**
- [ ] Line 4: Remove "Preview - inspectModeEnabled"
- [ ] Line 7: Remove "Generating preview HTML"
- [ ] Line 112: Remove "Injected hover tracking script"
- [ ] Lines 47-54: Remove 3 console.logs from hover script
- [ ] Line 89: Remove "Sending message"

**Remove debug logs from App.jsx:**
- [ ] Line 463: Remove "Setting up message listener"
- [ ] Line 483: Remove "Message listener attached"
- [ ] Line 487: Remove "Message listener removed"

**Remove debug logs from Editor.jsx:**
- [ ] Lines 67-71: Remove highlight debugging logs
- [ ] Line 77: Remove "Clearing previous decorations"
- [ ] Line 81: Remove "Creating new decoration"
- [ ] Line 95: Remove "Decoration created"

### ✅ Phase 3: Fix Prop Warning (2 minutes)
- [ ] Open `src/components/Preview.jsx`
- [ ] Line 3: Remove `isDragging` from props destructuring
- [ ] Change to: `const Preview = ({ content, fontSize, inspectModeEnabled }) => {`
- [ ] Verify warning no longer appears in console

### ✅ Phase 4: Click-to-Lock Feature (10 minutes) - BONUS
- [ ] Modify the hover tracking script in `src/components/Preview.jsx`
- [ ] Add `lockedElement` variable to track locked selection
- [ ] Implement click handler:
  - [ ] Click on element locks it (keeps highlight)
  - [ ] Click same element again unlocks it
  - [ ] Click different element switches lock
- [ ] Update mouseover handler to respect lock
- [ ] Update mouseout handler to respect lock
- [ ] Use thicker outline (3px) for locked state vs hover (2px)
- [ ] Test the flow:
  - [ ] Hover to preview elements
  - [ ] Click to lock selection
  - [ ] Move mouse to editor without losing highlight
  - [ ] Click again to unlock or select new element

**Implementation details:**
```javascript
// Add to hover tracking script:
let lockedElement = null;

// Click handler for locking
document.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  if (lockedElement === e.target) {
    // Unlock if clicking same element
    lockedElement.style.outline = '';
    lockedElement = null;
  } else {
    // Clear previous lock and set new one
    if (lockedElement) {
      lockedElement.style.outline = '';
    }
    lockedElement = e.target;
    lockedElement.style.outline = '3px solid #3b82f6';
    // Send message to highlight code
  }
});

// Modify mouseover to check for lock
if (lockedElement) return; // Don't change if locked
```

### ✅ Phase 5: Testing (5 minutes)
- [ ] Load Landing Page template (long content)
- [ ] Enable Inspect Mode
- [ ] Test hovering on elements at different positions:
  - [ ] Navigation (top) - verify auto-scroll
  - [ ] Hero section (middle) - verify highlight
  - [ ] Footer (bottom) - verify auto-scroll
- [ ] Test click-to-lock:
  - [ ] Click element to lock selection
  - [ ] Move mouse around - highlight stays
  - [ ] Click same element - unlocks
  - [ ] Click different element - switches lock
- [ ] Verify:
  - [ ] Blue outline appears on hover (2px)
  - [ ] Thicker outline on lock (3px)
  - [ ] Code highlights in editor
  - [ ] Editor auto-scrolls to show highlighted code
  - [ ] Console is clean (no debug messages)

## Expected Outcome
- Inspect Mode automatically scrolls to show highlighted code when it's off-screen
- Click-to-lock prevents losing selection when moving to editor
- Development console is clean and professional
- No React prop warnings
- Feature is production-ready with improved UX

## Files Modified
- `src/components/Editor.jsx` - Add auto-scroll
- `src/components/Preview.jsx` - Remove debug logs, fix prop warning, add click-to-lock
- `src/App.jsx` - Remove message listener logs

## Time Estimate
Total: ~30 minutes
- Auto-scroll: 5 minutes
- Console cleanup: 10 minutes
- Prop fix: 2 minutes
- Click-to-lock: 10 minutes
- Testing: 5 minutes

## Notes for Recording
1. Start by demonstrating the problem - hover on footer elements while editor shows top of file
2. Show the "losing selection" problem when moving mouse to editor
3. Implement auto-scroll fix first (immediate visual improvement)
4. Add click-to-lock feature (solves the selection problem)
5. Clean up console logs methodically
6. Show before/after console comparison
7. End with polished demo showing both features working together

## Test Script
```javascript
// Quick test to verify all functionality
// 1. Load this in the editor:
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <header>Top Section</header>
  <!-- Add 50+ lines of content here -->
  <main>
    <section>Section 1</section>
    <section>Section 2</section>
    <section>Section 3</section>
  </main>
  <footer>Bottom Section</footer>
</body>
</html>

// 2. Enable Inspect Mode
// 3. Hover on footer - should auto-scroll
// 4. Click on element - should lock selection
// 5. Move mouse - selection stays locked
// 6. Check console - should be clean
```

## Future Enhancements (Not for Episode 7)
- Reverse Inspect: Click in editor → highlight in preview
- Search & Replace functionality (Ctrl+F)
- Template search/filter
- Settings panel for user preferences
- Visual indicator showing when selection is locked

## Success Criteria
- [ ] Auto-scroll works smoothly
- [ ] Click-to-lock prevents selection jumping
- [ ] Console has zero debug messages from our code
- [ ] No React warnings
- [ ] Both features work together seamlessly
- [ ] Feature demo looks professional and polished

## Bonus Points
- The click-to-lock feature solves a real UX issue discovered during testing
- Shows iterative improvement based on actual usage
- Demonstrates attention to user experience details