import React from "react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const btnConfirmClass =
    type === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white border-0"
      : type === "warning"
        ? "bg-amber-500 hover:bg-amber-600 text-white border-0"
        : "bg-blue-600 hover:bg-blue-700 text-white border-0";

  return (
    <div className="modal modal-open flex items-center justify-center fixed inset-0 z-50">
      <div className="modal-box border border-slate-200 shadow-2xl bg-white text-slate-900 z-50 max-w-sm">
        <h3 className="font-bold text-lg">{title || "Are you sure?"}</h3>
        <p className="py-4 text-sm text-slate-600">{message}</p>
        <div className="modal-action flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border-0"
          >
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`btn btn-sm ${btnConfirmClass}`}>
            {confirmText}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop fixed inset-0 bg-black/35 backdrop-blur-sm z-40"
        onClick={onCancel}
      />
    </div>
  );
};

export default ConfirmModal;
