import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notification-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-[#B45309] flex-shrink-0" />;
            case 'error':
              return <XCircle className="w-4 h-4 text-[#BE123C] flex-shrink-0" />;
            case 'info':
            default:
              return <Info className="w-4 h-4 text-[#0F5B5C] flex-shrink-0" />;
          }
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="pointer-events-auto bg-white border border-[#E0E2DC] shadow-lg rounded-lg p-3.5 flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200"
          >
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1C1D1F]">{toast.title}</p>
              <p className="text-[11px] text-[#60635C] mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#888B84] hover:text-[#1C1D1F] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
