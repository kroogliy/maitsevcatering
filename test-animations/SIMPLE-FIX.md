# Simple Fix for Menu Section Animation

## Problem
1. Animation triggers too early on initial page load
2. Animation doesn't work after language change
3. Pin effect breaks after language change

## Solution

### Key Changes:

1. **Added locale dependency** to useEffect to recreate animations on language change
2. **Kill existing ScrollTriggers** before creating new ones using unique ID
3. **Added delay (300ms)** to let DOM settle before initializing animations
4. **Two-step refresh strategy**:
   - Refresh after animation setup (100ms)
   - Refresh after page load (500ms)

### Implementation:

```javascript
useEffect(() => {
  // 1. Kill existing ScrollTriggers with our ID
  const killScrollTriggers = () => {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars && trigger.vars.id === "menu-mosaic") {
        trigger.kill();
      }
    });
  };
  
  killScrollTriggers();
  
  // 2. Wait for DOM to settle
  const timer = setTimeout(() => {
    // Create animations here
    const ctx = gsap.context(() => {
      // Animation code...
    }, sectionRef.current);
    
    // 3. Refresh ScrollTrigger
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    
    return () => {
      ctx.revert();
      killScrollTriggers();
    };
  }, 300);
  
  return () => {
    clearTimeout(timer);
    killScrollTriggers();
  };
}, [locale]); // Recreate on language change
```

### Additional Page Load Handler:

```javascript
useEffect(() => {
  const handleLoad = () => {
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);
  };
  
  if (document.readyState === "complete") {
    handleLoad();
  } else {
    window.addEventListener("load", handleLoad);
  }
  
  return () => {
    window.removeEventListener("load", handleLoad);
  };
}, []);
```

## Why This Works:

1. **Unique ID** (`id: "menu-mosaic"`) allows us to target and kill specific ScrollTriggers
2. **300ms delay** gives DOM time to render properly before measuring positions
3. **ScrollTrigger.refresh()** recalculates all positions after animations are set up
4. **locale dependency** ensures animations are recreated with new text on language change
5. **Page load handler** fixes timing issues on initial page load

## Testing:
1. Load page - animation should trigger at correct scroll position
2. Refresh (F5) - animation should work correctly
3. Change language - animation should recreate and work properly