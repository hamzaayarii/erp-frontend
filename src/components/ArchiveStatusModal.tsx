import React, { useState, useEffect, useRef } from 'react';
import { X, Archive, ArchiveRestore } from 'lucide-react';

interface ArchiveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  currentStatus: string;
  itemName: string;
  isArchiving: boolean; // true for archive, false for unarchive
}

const ArchiveStatusModal: React.FC<ArchiveStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  itemName,
  isArchiving
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset selected status when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isArchiving) {
        // For archiving: if "Not Started", auto-select "Cancelled", otherwise let user choose
        if (currentStatus === 'Not Started') {
          setSelectedStatus('Cancelled');
        } else {
          setSelectedStatus('');
        }
      } else {
        // For unarchiving: default to "In Progress"
        setSelectedStatus('In Progress');
      }
    }
  }, [isOpen, isArchiving, currentStatus]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const archiveStatuses = ['Cancelled', 'Finished'];
  const unarchiveStatuses = ['Not Started', 'In Progress', 'Suspended', 'Reopened'];

  const availableStatuses = isArchiving ? archiveStatuses : unarchiveStatuses;
  const isNotStartedToCancel = isArchiving && currentStatus === 'Not Started';

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus);
      onClose();
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'finished':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'suspended':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'not started':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'reopened':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {isArchiving ? (
              <Archive className="w-6 h-6 text-orange-600" />
            ) : (
              <ArchiveRestore className="w-6 h-6 text-green-600" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {isArchiving ? 'Archive Project' : 'Unarchive Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {isArchiving ? 'Archive' : 'Unarchive'} project: <span className="font-semibold text-gray-900">"{itemName}"</span>
            </p>
            <p className="text-sm text-gray-500">
              Current status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentStatus)}`}>
                {currentStatus}
              </span>
            </p>
          </div>

          {isNotStartedToCancel ? (
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-3">
                Projects with "Not Started" status will be automatically set to "Cancelled" when archived.
              </p>
              <div className={`p-3 rounded-lg border ${getStatusColor('Cancelled')}`}>
                <div className="flex items-center justify-center">
                  <span className="font-medium">Cancelled</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {isArchiving ? 'Choose archive status:' : 'Choose new status:'}
              </label>
              <div className="space-y-2">
                {availableStatuses.map((status) => (
                  <label
                    key={status}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStatus === status
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`flex-1 flex items-center justify-between`}>
                      <span className={`font-medium ${selectedStatus === status ? 'text-blue-900' : 'text-gray-700'}`}>
                        {status}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedStatus === status
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedStatus === status && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedStatus}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedStatus
                ? isArchiving
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isArchiving ? 'Archive Project' : 'Unarchive Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveStatusModal;
