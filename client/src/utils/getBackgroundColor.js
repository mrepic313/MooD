// src/utils/getBackgroundColor.js

export const getBackgroundColor = (intensity) => {
    if (intensity <= 2) {
      // Calm/Low mood intensity: Light blue
      return '#F2E2C4';
    } else if (intensity <= 5) {
      // Neutral mood intensity: Light green
      return '#BDBFAE';
    } else if (intensity <= 7) {
      // Slightly elevated mood: Yellow
      return '#486773';
    } else if (intensity <= 9) {
      // High mood intensity: Light orange
      return '#0E3659';
    } else {
      // Very high mood intensity: Light red
      return '#010B40';
    }
  };