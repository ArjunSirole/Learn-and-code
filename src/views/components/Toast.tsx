import React, { JSX } from "react";
import "../styles/Toast.css";

interface ToastProps {
  message: string;
  onClose: () => void;
}

function Toast({ message, onClose }: ToastProps): JSX.Element {
  return (
    <div className="toast-container">
      <div className="toast" role="alert">
        {message}
        <button onClick={onClose} aria-label="Close notification">&times;</button>
      </div>
    </div>
  );
}

export default Toast;
