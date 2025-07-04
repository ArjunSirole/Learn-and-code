import React from "react";
import "../styles/ConfirmationModal.css";

interface ConfirmationModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showTextarea?: boolean;
  textareaValue?: string;
  onTextareaChange?: (value: string) => void;
  showInput?: boolean;
  inputValue?: string;
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function ConfirmationModal({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  showTextarea = false,
  textareaValue,
  onTextareaChange,
  showInput = false,
  inputValue,
  inputPlaceholder = "",
  onInputChange,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p>{description}</p>

        {showTextarea && (
          <textarea
            placeholder="Enter reason..."
            value={textareaValue}
            onChange={(e) => onTextareaChange?.(e.target.value)}
            disabled={loading}
          />
        )}

        {showInput && (
          <div className="input-group">
            <label htmlFor="modal-input">Keywords (optional):</label>
            <input
              id="modal-input"
              type="text"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : confirmLabel}
          </button>
          <button onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
