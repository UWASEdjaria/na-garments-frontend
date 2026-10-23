'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEye, FiMail, FiMail as FiMailRead, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

import ContactMessageModal from '@/app/components/admin/messages/ContactMessageModal';
import { useToast } from '@/app/components/ToastProvider';
import { getApiErrorMessage } from '@/app/lib/api-error';
import { contactService } from '@/app/services/contact.service';
import type { ContactMessage } from '@/app/types/contact';

import ConfirmDeleteModal from '@/app/components/admin/ConfirmDeleteModal';

type MessageFilter = 'all' | 'unread' | 'read';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { showToast } = useToast();

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      setMessages(await contactService.getMessages());
    } catch (error) {
      const message = getApiErrorMessage(error instanceof Error ? error : new Error('Unable to load contact messages.'), 'Unable to load contact messages.');
      setErrorMessage(message);
      showToast({
        type: 'error',
        title: 'Messages failed to load',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchMessages(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchMessages]);

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const unreadCount = messages.filter((message) => !message.isRead).length;
  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return messages.filter((message) => {
      if (filter === 'unread' && message.isRead) return false;
      if (filter === 'read' && !message.isRead) return false;
      if (!normalizedSearch) return true;
      return [message.names, message.email, message.subject ?? '', message.message]
        .some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [filter, messages, search]);

  const updateReadStatus = async (message: ContactMessage) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const updated = await contactService.updateReadStatus(message.id, !message.isRead);
      setMessages((current) => current.map((item) => item.id === updated.id ? updated : item));
      const statusText = updated.isRead ? 'Message marked as read.' : 'Message marked as unread.';
      setSuccessMessage(statusText);
      showToast({
        type: 'success',
        title: 'Status updated',
        description: statusText,
      });
    } catch (error) {
      const message = getApiErrorMessage(error instanceof Error ? error : new Error('Unable to update message status.'), 'Unable to update message status.');
      setErrorMessage(message);
      showToast({
        type: 'error',
        title: 'Update failed',
        description: message,
      });
    }
  };
const deleteMessage = async () => {
  if (!messageToDelete || isDeleting) return;

  const message = messageToDelete;
  setIsDeleting(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    await contactService.deleteMessage(message.id);
    setMessages((current) => current.filter((item) => item.id !== message.id));

    const statusText = 'Message deleted.';
    setSuccessMessage(statusText);
    setMessageToDelete(null);

    showToast({
      type: 'success',
      title: 'Message deleted',
      description: statusText,
    });
  } catch (error) {
    const errorText = getApiErrorMessage(
      error instanceof Error ? error : new Error('Unable to delete this message.'),
      'Unable to delete this message.'
    );

    setErrorMessage(errorText);

    showToast({
      type: 'error',
      title: 'Delete failed',
      description: errorText,
    });
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
         
          <h1 className="text-2xl font-extrabold text-[#111111] sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">Contact enquiries from the nagarments website.</p>
        </div>
        <button type="button" onClick={() => void fetchMessages()} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2.5 text-sm font-semibold text-[#123B5D] hover:bg-[#EEF3F6] disabled:opacity-60"><FiRefreshCw aria-hidden="true" />Refresh</button>
      </header>

      {successMessage && <div role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{successMessage}</div>}
      {errorMessage && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

      <section aria-label="Contact message summary" className="mb-5 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-md border border-gray-200 border-l-4 border-l-[#123B5D] bg-white px-4 py-4"><p className="text-xs font-semibold text-gray-500">All messages</p><p className="mt-1 text-2xl font-extrabold text-[#111111]">{messages.length}</p></div>
        <div className="rounded-md border border-gray-200 border-l-4 border-l-[#F28C28] bg-white px-4 py-4"><p className="text-xs font-semibold text-gray-500">Unread</p><p className="mt-1 text-2xl font-extrabold text-[#111111]">{unreadCount}</p></div>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid gap-3 border-b border-gray-200 p-4 sm:grid-cols-[minmax(0,1fr)_180px]">
          <label className="sr-only" htmlFor="message-search">Search contact messages</label>
          <input id="message-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sender, subject, or message" className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#F28C28]" />
          <label className="sr-only" htmlFor="message-filter">Filter messages</label>
          <select id="message-filter" value={filter} onChange={(event) => setFilter(event.target.value as MessageFilter)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F28C28]"><option value="all">All messages</option><option value="unread">Unread</option><option value="read">Read</option></select>
        </div>

        {isLoading ? <div role="status" className="px-6 py-16 text-center text-sm text-gray-500">Loading messages...</div> : filteredMessages.length === 0 ? <div className="px-6 py-16 text-center text-sm text-gray-500">{messages.length ? 'No messages match these filters.' : 'No contact messages yet.'}</div> : (
          <ul className="divide-y divide-gray-100">
            {filteredMessages.map((message) => <li key={message.id} className={`p-4 sm:px-5 ${message.isRead ? 'bg-white' : 'bg-[#EEF3F6]/50'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words font-bold text-[#111111]">{message.names}</p>
                    {!message.isRead && <span className="rounded-full bg-[#F28C28]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#8a4b0d]">Unread</span>}
                  </div>
                  <p className="mt-0.5 break-all text-xs text-gray-500">{message.email}{message.phone ? ` · ${message.phone}` : ''}</p>
                  <p className="mt-2 break-words text-sm font-semibold text-[#123B5D]">{message.subject || 'No subject'}</p>
                  <p className="mt-1 line-clamp-2 break-words text-sm leading-5 text-gray-600">{message.message}</p>
                  <time className="mt-2 block text-xs text-gray-400" dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <button type="button" onClick={() => setSelectedMessageId(message.id)} className="inline-flex items-center gap-1.5 rounded-md bg-[#123B5D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#F28C28] hover:text-[#111111]"><FiEye aria-hidden="true" />View</button>
                  <button type="button" onClick={() => void updateReadStatus(message)} aria-label={message.isRead ? `Mark message from ${message.names} unread` : `Mark message from ${message.names} read`} className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-[#123B5D] hover:bg-[#EEF3F6]">{message.isRead ? <FiMail aria-hidden="true" /> : <FiMailRead aria-hidden="true" />}{message.isRead ? 'Mark unread' : 'Mark read'}</button>
                  <button type="button" onClick={() => setMessageToDelete(message)} aria-label={`Delete message from ${message.names}`} className="inline-flex items-center justify-center rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"><FiTrash2 aria-hidden="true" /></button>
                </div>
              </div>
            </li>)}
          </ul>
        )}
      </section>

      {selectedMessageId && (
  <ContactMessageModal
    messageId={selectedMessageId}
    onClose={() => setSelectedMessageId(null)}
  />
)}

{messageToDelete && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-2xl">
      <ConfirmDeleteModal
        itemName={`message from ${messageToDelete.names}`}
        isDeleting={isDeleting}
        onCancel={() => setMessageToDelete(null)}
        onConfirm={() => void deleteMessage()}
      />
    </div>
  </div>
)}
    </>
  );
}