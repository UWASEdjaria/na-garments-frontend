'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => undefined,
});

const palette: Record<ToastType, { border: string; bg: string; icon: string }> = {
  success: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
  },
  error: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    icon: 'text-red-600',
  },
  info: {
    border: 'border-[#123B5D]/20',
    bg: 'bg-[#EEF3F6]',
    icon: 'text-[#123B5D]',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, ...toast }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-3">
        {toasts.map((toast) => {
          const styles = palette[toast.type];
          const Icon =
            toast.type === 'success'
              ? FiCheckCircle
              : toast.type === 'error'
                ? FiAlertCircle
                : FiInfo;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3 shadow-lg ${styles.border} ${styles.bg}`}
              role="status"
            >
              <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white ${styles.icon}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#111111]">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-xs leading-5 text-gray-600">{toast.description}</p>
                )}
              </div>

              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() =>
                  setToasts((current) => current.filter((item) => item.id !== toast.id))
                }
                className="mt-0.5 text-gray-500 transition hover:text-[#111111]"
              >
                <FiX className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
