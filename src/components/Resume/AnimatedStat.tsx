// src/components/AnimatedStat.tsx
import { useState, useEffect } from "react";

type StatBarProps  = {
  value: number;
  max?: number; 
  barClass?: string; 
};

export const AnimatedStat = ({ value, max = 100, barClass = "bg-blue-600" }: StatBarProps ) => {
  const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
      let startTime: number | null = null;
      const duration = 1000;

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        setAnimatedValue(Math.floor(progress * value));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, [value]);

    const widthPercent = (animatedValue / max) * 100;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
        {/* Left: Bar */}
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className={`h-4 rounded-full transition-all duration-2000 ease-out ${barClass}`}
            style={{ width: `${widthPercent}%`}}
          />
        </div>

        {/* Right: Animated Value */}
        <div className="w-18 text-right text-blue-700 text-sm font-semibold">
          {animatedValue} {max === 100 ? "/ 100%" : ""}
        </div>
      </div>
    );
};
