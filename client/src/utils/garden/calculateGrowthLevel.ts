/**
 * Calculate growth level based on elapsed time
 */
export const calculateGrowthLevel = (dateDropped: Date, currentTime: Date, growthTimeSeconds: number): number => {
  // Calculate total elapsed time in seconds
  const elapsedTimeMs = currentTime.getTime() - dateDropped.getTime();
  const elapsedTimeSeconds = elapsedTimeMs / 1000;

  // Calculate growth level (0-10)
  // Divide total growth time into 10 levels
  const timePerLevel = growthTimeSeconds / 10;
  const growthLevel = Math.min(10, Math.floor(elapsedTimeSeconds / timePerLevel));

  return growthLevel;
};
