// HAPTICS UTILITIES

export const triggerHaptic = (type: 'success' | 'error' | 'selection' | 'impact') => {
  // 1. Safety Check: Ensure we are in the browser and hardware supports it
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'selection':
        // A very light tick (great for selecting a candidate)
        navigator.vibrate(10); 
        break;
        
      case 'success':
        // A distinct "double-tap" confirmation (Vote Cast)
        navigator.vibrate([50, 50, 50]); 
        break;
        
      case 'error':
        // A long warning buzz (Already Voted / Error)
        navigator.vibrate([50, 100, 50, 100, 50]); 
        break;
        
      case 'impact':
        // A single heavy thud (Submit Button press)
        navigator.vibrate(75); 
        break;
    }
  } catch (e) {
    // Ignore errors on unsupported devices
    console.log("Haptics not supported");
  }
};