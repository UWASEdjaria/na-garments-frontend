 'use client';

import { useEffect, useState } from 'react';

interface LoginSuccessMessageProps {
  message: string;
}

export default function LoginSuccessMessage({
  message,
}: LoginSuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsVisible(false), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  if (!isVisible) return null;

  return (
    <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
      ✓ {message}
    </div>
  );
}