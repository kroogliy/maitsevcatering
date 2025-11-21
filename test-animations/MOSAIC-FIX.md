# Mosaic Animation Fix for Language Change

## Problem Description
When changing languages on the website, the mosaic animation in `menu-section.js` was not working properly:
- Pin effect (`pin: true`) stopped working after language change
- Animations were not triggering
- ScrollTrigger was not refreshing correctly
- Elements were keeping inline styles from previous animations

## Root Causes
1. **Stale References**: Direct use of `mosaicRef.current` in ScrollTrigger configuration
2. **ScrollTrigger Conflicts**: Old ScrollTriggers were not being properly killed before creating new ones
3. **Inline Styles Persistence**: GSAP inline styles from previous animations were not cleared
4. **Context Not Refreshing**: GSAP context was not properly cleaning up animations

## Solution Implemented

### 1. Proper Cleanup Before Re-initialization
```javascript
// Kill all existing ScrollTriggers from this component first
ScrollTrigger.getAll().forEach((trigger) => {
  const triggerElement = trigger.trigger;
  if (
    triggerElement === section ||
    triggerElement === mosaic ||
    (triggerElement && section.contains(triggerElement)) ||
    trigger.vars?.id === "menu-mosaic"
  ) {
    trigger.kill();
  }
});

// Clear any existing GSAP animations on our elements
gsap.killTweensOf([section, mosaic, centerImage]);
gsap.killTweensOf(
  section.querySelectorAll(
    "[data-left-image], [data-right-image], [data-overlay-content]",
  ),
);

// Reset inline styles that might have been set by previous animations
gsap.set([mosaic, centerImage], { clearProps: "all" });
```

### 2. Store Refs in Variables
```javascript
// Store refs in variables to avoid stale closure warnings
const section = sectionRef.current;
const mosaic = mosaicRef.current;
const centerImage = centerImageRef.current;
```

### 3. Use Scoped Selectors
Instead of global selectors, use context-scoped selectors:
```javascript
const leftImages = section.querySelectorAll("[data-left-image]");
const rightImages = section.querySelectorAll("[data-right-image]");
const overlayContent = section.querySelector("[data-overlay-content]");
```

### 4. Add ScrollTrigger Configuration
```javascript
scrollTrigger: {
  trigger: mosaic,
  // ... other settings
  invalidateOnRefresh: true,
  refreshPriority: 1,
  id: "menu-mosaic", // Add ID for easier tracking
}
```

### 5. Force ScrollTrigger Refresh
Two-step refresh strategy:
```javascript
// In main useEffect
const refreshTimer = setTimeout(() => {
  ScrollTrigger.refresh(true);
  ScrollTrigger.update();
}, 100);

// Additional effect for locale change
useEffect(() => {
  let rafId;
  const refreshTimeout = setTimeout(() => {
    rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
      ScrollTrigger.update();
      
      // Force recalculation of all positions
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id === "menu-mosaic") {
          st.refresh();
        }
      });
    });
  }, 300);

  return () => {
    clearTimeout(refreshTimeout);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, [locale]);
```

### 6. Proper Cleanup in Return Function
```javascript
return () => {
  clearTimeout(refreshTimer);
  
  // Properly clean up all ScrollTriggers and animations
  ctx.revert();
  
  // Kill any remaining ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => {
    if (/* matching conditions */) {
      st.kill();
    }
  });
  
  // Clear all inline styles set by GSAP
  gsap.set([section, mosaic, centerImage], { clearProps: "all" });
};
```

## Key Improvements
1. **Complete Cleanup**: All GSAP animations and ScrollTriggers are properly killed before re-initialization
2. **Style Reset**: Inline styles are cleared to prevent conflicts
3. **Proper Timing**: Uses setTimeout and requestAnimationFrame for optimal refresh timing
4. **Scoped Selectors**: All queries are scoped to the component's section element
5. **ID Tracking**: ScrollTriggers have IDs for easier management
6. **Multiple Refresh Strategies**: Both immediate and delayed refresh for different scenarios

## Testing Instructions
1. Navigate to the homepage
2. Scroll down to the menu mosaic section
3. Observe the pin effect and animations working
4. Change language using the language switcher
5. Scroll back up and then down to the mosaic section
6. Verify that:
   - Pin effect still works
   - Side images animate out correctly
   - Center image expands properly
   - Overlay content fades in
   - No duplicate animations or broken states

## Browser Compatibility
- Tested on Chrome, Firefox, Safari
- Mobile and desktop viewports
- Different scroll speeds and behaviors

## Performance Considerations
- Cleanup prevents memory leaks from orphaned ScrollTriggers
- `clearProps: "all"` ensures clean state between language changes
- Delayed refresh with requestAnimationFrame ensures DOM is ready
- Proper use of GSAP context for efficient cleanup