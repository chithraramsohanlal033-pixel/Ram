import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { ThemeConfig } from '../types';

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  toast,
  onClose,
  themeConfig,
  isDarkMode,
}) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      id="app-toast-container"
      className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-bounce-short max-w-[90vw] md:max-w-md"
      style={{
        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(191, 219, 254, 0.8)',
      }}
    >
      <div className="flex-shrink-0">
        {toast.type === 'warning' ? (
          <AlertCircle className="w-5 h-5 text-amber-500" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-blue-500" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
        )}
      </div>

      <span
        className={`text-xs md:text-sm font-semibold truncate ${
          isDarkMode ? 'text-slate-100' : 'text-slate-800'
        }`}
      >
        {toast.message}
      </span>

      <button
        onClick={onClose}
        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
