# Chefs Mastery Animation Fix - First Render Issue

## Problem Description

Half of the elements in chefs-mastery.js were not animating on first render, but worked correctly after page refresh (F5). Specifically:
- Title elements (.mastery-number, .mastery-title-first, .mastery-title-second)
- Chef section elements (.section-title-overlay, .chef-main-image, .chef-content-side)
- Only parallax animations were working

This was caused by:

1. **Race Condition**: GSAP trying to animate elements before React rendered them
2. **Visibility Issue**: Elements were visible before animations could hide them
3. **ScrollTrigger Timing**: Animations triggering before initial states were set
4. **Lenis Conflicts**: Smooth scroll library interfering with GSAP initialization

## Solution Implementation

### 1. useLayoutEffect for Immediate Hiding

```javascript
// Use useLayoutEffect to hide elements before paint
useLayoutEffect(() => {
  const section = sectionRef.current;
  if (!section) return;

  const elements = section.querySelectorAll(
    '.mastery-number, .mastery-title-first, .mastery-title-second, ' +
    '.chef-main-image, .chef-name-large, .chef-role-large, ' +
    '.parallax-card, .section-title-overlay'
  );

  elements.forEach(el => {
    el.style.visibility = 'hidden';
    el.style.opacity = '0';
  });
}, []);
```

### 2. Direct Element References Instead of Class Selectors

```javascript
// Before (problematic):
gsap.fromTo(".mastery-number", {...})

// After (reliable):
const masteryNumber = section.querySelector(".mastery-number");
if (masteryNumber) {
  gsap.fromTo(masteryNumber, {...})
}
```

### 3. Element Existence Checks

```javascript
const setupAnimations = () => {
  const masteryNumber = section.querySelector(".mastery-number");
  const titleFirst = section.querySelector(".mastery-title-first");
  const titleSecond = section.querySelector(".mastery-title-second");

  // Check if elements exist before animating
  if (!masteryNumber || !titleFirst || !titleSecond) {
    console.warn('[ChefsMastery] Some elements not found, retrying...');
    setTimeout(setupAnimations, 100);
    return;
  }
  
  // Continue with animations...
};
```

### 4. Visibility Control in Animations

```javascript
// Use visibility property with onStart callbacks
titleTl.to(masteryNumber, {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
  clearProps: "transform",
  onStart: () => {
    masteryNumber.style.visibility = 'visible';
  }
});

// For ScrollTrigger-based animations
ScrollTrigger.create({
  trigger: block,
  start: "top 80%",
  once: true,
  onEnter: () => {
    const tl = gsap.timeline();
    
    if (image) {
      tl.to(image, {
        scale: 1.05,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        onStart: () => {
          image.style.visibility = 'visible';
        }
      }, 0);
    }
  }
});
```

### 5. Preventing Double Initialization

```javascript
// Prevent double initialization
if (section._gsapInitialized) {
  console.log('[ChefsMastery] Already initialized, skipping');
  return;
}
section._gsapInitialized = true;
```

### 6. Proper Cleanup of Existing Animations

```javascript
// Kill any existing ScrollTriggers for this section
ScrollTrigger.getAll().forEach(trigger => {
  if (trigger.trigger && section.contains(trigger.trigger)) {
    trigger.kill();
  }
});

// Clear any inline styles that might interfere
const allElements = section.querySelectorAll('*');
allElements.forEach(el => {
  if (el.style.transform || el.style.opacity) {
    gsap.set(el, { clearProps: "all" });
  }
});
```

### 7. Force Layout Recalculation

```javascript
// Force layout recalculation before animations
section.offsetHeight;
```

### 8. Lenis-Aware Initialization

```javascript
// Wait for next frame to ensure React has rendered
requestAnimationFrame(() => {
  const checkAndSetup = () => {
    if (window.lenis) {
      console.log('[ChefsMastery] Lenis detected, proceeding with setup');
      setupAnimations();
    } else {
      console.log('[ChefsMastery] Waiting for Lenis...');
      setTimeout(checkAndSetup, 50);
    }
  };
  checkAndSetup();
});
```

## Key Improvements

1. **Immediate Hiding**: useLayoutEffect hides elements before browser paint
2. **Visibility Control**: Using visibility:hidden prevents any flash of content
3. **Lenis Integration**: Waiting for smooth scroll library prevents conflicts
4. **ScrollTrigger Cleanup**: Killing existing triggers prevents duplicates
5. **Granular Control**: Each animation controls its element's visibility
6. **No FOUC**: Combination of visibility and opacity ensures smooth reveal

## Testing Checklist

1. ✅ Clear browser cache and hard reload
2. ✅ First page load - all elements animate
3. ✅ Page refresh (F5) - animations still work
4. ✅ Navigate away and back - animations reset properly
5. ✅ Check console for any warnings
6. ✅ Verify no inline styles remain after navigation

## Debug Mode

To enable detailed logging:

```javascript
console.log('[ChefsMastery] All elements found, setting up animations');
console.log('[ChefsMastery] Final ScrollTrigger refresh completed');
```

## Common Issues and Solutions

### Issue: Elements still not animating
**Solution**: Check if useLayoutEffect is running before useEffect

### Issue: Flash of content before hiding
**Solution**: Add CSS class with opacity:0 as fallback

### Issue: Animations not triggering on scroll
**Solution**: Ensure ScrollTrigger.refresh() is called after Lenis initializes

### Issue: Visibility remains hidden
**Solution**: Check all onStart callbacks are properly setting visibility

### Issue: Conflicts with other GSAP animations
**Solution**: Use unique trigger IDs and kill existing triggers before creating new ones

## Performance Considerations

- Use `force3D: true` for hardware acceleration
- Set `will-change` CSS property on animated elements
- Use `clearProps` to remove unnecessary inline styles after animation
- Batch similar animations together when possible

## Future Improvements

1. Consider using React refs instead of querySelector
2. Implement loading states while animations initialize
3. Add intersection observer for lazy initialization
4. Create reusable animation hooks for consistency