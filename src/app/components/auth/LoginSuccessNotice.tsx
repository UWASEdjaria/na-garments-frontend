'use client';

import { useEffect, useState } from 'react';

import LoginSuccessMessage from './LoginSuccessMessage';

export default function LoginSuccessNotice() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedMessage = sessionStorage.getItem('loginSuccess');

    if (storedMessage) {
      setMessage(storedMessage);
      sessionStorage.removeItem('loginSuccess');
    }
  }, []);

  if (!message) {
    return null;
  }

  return <LoginSuccessMessage message={message} />;
}