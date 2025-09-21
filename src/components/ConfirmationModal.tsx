import React from 'react';
import { Button } from './ui/button';
import { IconX } from '@tabler/icons-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonClass = "bg-red-500 hover:bg-red-600"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="mb-4">
          <label htmlFor="reason-textarea" className="block text-sm font-medium text-gray-700 mb-2">
            Reason:
          </label>
          <textarea
            id="reason-textarea"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter reason..."
          />
        </div>
        
        <div className="flex gap-3 justify-center">
  <Button
    onClick={onClose}
    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
  >
    {cancelText}
  </Button>
  <Button
    onClick={onConfirm}
    className={`px-6 py-2 text-white rounded-lg ${confirmButtonClass}`}
  >
    {confirmText}
  </Button>
</div>

      </div>
    </div>
  );
};

export default ConfirmationModal;
