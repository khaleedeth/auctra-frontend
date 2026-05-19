import { useState, useEffect } from "react";

export default function useCountdown(endTime) {
  const calculateTimeLeft = () => {
    const diff = new Date(endTime) - new Date();

    if (diff <= 0) return null; // auction ended

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (!remaining) clearInterval(timer); // stop when done
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  }, [endTime]);

  return timeLeft;
}