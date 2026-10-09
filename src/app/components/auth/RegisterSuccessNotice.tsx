'use client';

import { useEffect, useState } from 'react';

export default function RegisterSuccessNotice() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedMessage = sessionStorage.getItem('registerSuccess');

    if (!storedMessage) {
      return;
    }

    setMessage(storedMessage);
    sessionStorage.removeItem('registerSuccess');

    const timer = window.setTimeout(() => {
      setMessage('');
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
      ✓ {message}
    </div>
  );
}