import { useEffect, useState } from "react";

type CampaignStatus = 'loading' | 'upcoming' | 'active' | 'ended';

export const useCountdown = (startTime: number | null, endTime: number | null) => {
  const [countdown, setCountdown] = useState<string>('');
  const [status, setStatus] = useState<CampaignStatus>('loading');

  useEffect(() => {
    if (startTime === null || endTime === null || isNaN(startTime) || isNaN(endTime)) {
      setCountdown('Invalid campaign times');
      setStatus('ended');
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      let targetTime: number, newStatus: CampaignStatus;

      if (now < startTime) {
        targetTime = startTime;
        newStatus = 'upcoming';
      } else if (now >= startTime && now <= endTime) {
        targetTime = endTime;
        newStatus = 'active';
      } else {
        setCountdown("0");
        setStatus('ended');
        return;
      }

      if (status !== newStatus) {
        setStatus(newStatus);
      }

      const timeLeft = targetTime - now;
      if (timeLeft <= 0) {
        const message = newStatus === 'upcoming' ? 'Campaign is starting!' : 'Campaign has ended';
        setCountdown(message);
        setStatus(newStatus === 'upcoming' ? 'active' : 'ended');
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      const newCountdown = `${days}d ${hours}h ${minutes}m ${seconds}s ${
        newStatus === 'upcoming' ? 'until start' : 'remaining'
      }`;

      setCountdown((prev) => (prev !== newCountdown ? newCountdown : prev));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime, status]);

  return { countdown, status };
};