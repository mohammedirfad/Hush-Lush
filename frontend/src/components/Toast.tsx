import { X } from "lucide-react";

export type ToastMessage = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type ToastProps = {
  toasts: ToastMessage[];
  onClose: (id: number) => void;
};

export function ToastStack({ toasts, onClose }: ToastProps) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div className={`toast toast--${toast.type}`} key={toast.id}>
          <span>{toast.message}</span>
          <button aria-label="Close message" onClick={() => onClose(toast.id)} type="button">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
