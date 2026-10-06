import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastNotification({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'error') Icon = AlertTriangle;

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <Icon size={18} />
            <span>{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => onRemove(toast.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
