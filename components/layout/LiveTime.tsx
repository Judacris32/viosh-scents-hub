'use client';

import { useEffect, useState } from 'react';

export function LiveTime({ tz, className }: { tz: string; className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(t);
  }, []);
  const text = now
    ? new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(now)
    : '--:--';
  return (
    <time className={className} suppressHydrationWarning>
      {text}
    </time>
  );
}
