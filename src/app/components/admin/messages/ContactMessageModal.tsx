'use client';

import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

import { getApiErrorMessage } from '@/app/lib/api-error';
import { contactService } from '@/app/services/contact.service';
import type { ContactMessage } from '@/app/types/contact';

interface ContactMessageModalProps {
  messageId: string;
  onClose: () => void;
}

export default function ContactMessageModal({ messageId, onClose }: ContactMessageModalProps) {
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrentRequest = true;
    contactService.getMessageById(messageId)
      .then((result) => {
        if (isCurrentRequest) setMessage(result);
      })
      .catch((error: Error) => {
        if (isCurrentRequest) setErrorMessage(getApiErrorMessage(error, 'Unable to load this message.'));
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [messageId]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-0 backdrop-blur-xl sm:items-center sm:p-4">
      <button type="button" aria-label="Close message details" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="contact-message-title" className="relative z-10 max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-white shadow-2xl sm:rounded-xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F28C28]">Contact inbox</p>
            <h2 id="contact-message-title" className="mt-1 text-xl font-extrabold text-[#123B5D]">Message details</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close message details" className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#123B5D]"><FiX className="h-5 w-5" /></button>
        </header>
        <div className="space-y-5 p-5 sm:p-7">
          {isLoading && <p role="status" className="py-12 text-center text-sm text-gray-500">Loading message...</p>}
          {errorMessage && <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
          {message && <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><p className="text-xs font-semibold text-gray-500">From</p><p className="mt-1 break-words text-sm font-bold text-[#111111]">{message.names}</p></div>
              <div><p className="text-xs font-semibold text-gray-500">Received</p><p className="mt-1 text-sm text-[#111111]">{new Date(message.createdAt).toLocaleString()}</p></div>
              <div><p className="text-xs font-semibold text-gray-500">Email</p><a className="mt-1 block break-all text-sm text-[#123B5D] underline" href={`mailto:${message.email}`}>{message.email}</a></div>
              <div><p className="text-xs font-semibold text-gray-500">Phone</p>{message.phone ? <a className="mt-1 block text-sm text-[#123B5D] underline" href={`tel:${message.phone}`}>{message.phone}</a> : <p className="mt-1 text-sm text-gray-500">Not provided</p>}</div>
              {message.subject && <div className="sm:col-span-2"><p className="text-xs font-semibold text-gray-500">Subject</p><p className="mt-1 break-words text-sm font-semibold text-[#111111]">{message.subject}</p></div>}
            </div>
            <section className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-[#123B5D]">Message</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{message.message}</p>
            </section>
          </>}
          <div className="border-t border-gray-100 pt-4 text-right">
            <button type="button" onClick={onClose} className="rounded-md bg-[#123B5D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F28C28] hover:text-[#111111]">Close</button>
          </div>
        </div>
      </section>
    </div>
  );
}