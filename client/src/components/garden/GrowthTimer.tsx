/**
 * GrowthTimer component
 * Shows a visual timer for plant growth progress
 */
import { useContext, useEffect, useState } from "react";

// context
import { GlobalDispatchContext } from "@/context/GlobalContext";

// utils
import { calculateGrowthLevel } from "@/utils";

/**
 * Props for the GrowthTimer component
 */
interface GrowthTimerProps {
  currentLevel: number;
  dateDropped: Date;
  growthTime: number; // in seconds
}

export const GrowthTimer = ({ currentLevel, dateDropped, growthTime }: GrowthTimerProps) => {
  // Access global dispatch for error handling
  const dispatch = useContext(GlobalDispatchContext);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [nextLevelPercent, setNextLevelPercent] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const elapsedTime = (now.getTime() - dateDropped.getTime()) / 1000; // in seconds

      if (currentLevel >= 10) {
        setTimeLeft(0);
        setNextLevelPercent(100);
        return;
      }

      // Calculate time for next level
      const timePerLevel = growthTime / 10; // time per level in seconds
      const nextLevelTime = (currentLevel + 1) * timePerLevel;
      const timeLeftForNextLevel = Math.max(0, nextLevelTime - elapsedTime);

      setTimeLeft(Math.ceil(timeLeftForNextLevel));

      // Calculate percentage to next level
      const currentLevelTime = currentLevel * timePerLevel;
      const progressInCurrentLevel = elapsedTime - currentLevelTime;
      const percentComplete = Math.min(100, (progressInCurrentLevel / timePerLevel) * 100);

      setNextLevelPercent(percentComplete);
    };

    // Initial update
    updateTimer();

    // Set up interval
    const timerId = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [currentLevel, dateDropped, growthTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-2">
        <p className="p2">Next Growth Level</p>
        {currentLevel < 10 && <p className="p2 text-muted">{formatTime(timeLeft)}</p>}
      </div>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${nextLevelPercent}%` }} />
      </div>

      {currentLevel >= 10 && <p className="p2 text-center text-success mt-2">Fully grown! Ready to harvest.</p>}
    </div>
  );
};

export default GrowthTimer;
