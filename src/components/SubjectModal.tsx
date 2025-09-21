import React, { useState } from 'react';
import { Modal } from './Modal';
import { Edit2, Trash2 } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({ isOpen, onClose }) => {
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState([
    'Product Management',
    'Client Management',
    'Employee Directory',
    'Invoice Tracker',
    'Leave Requests'
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleSave = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
    onClose();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(subjects[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      const updatedSubjects = [...subjects];
      updatedSubjects[index] = editValue.trim();
      setSubjects(updatedSubjects);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedSubjects = subjects.filter((_, i) => i !== deleteIndex);
      setSubjects(updatedSubjects);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 pb-6">
        <h2 className="text-xl font-semibold text-blue-600 text-center mb-6">
          New Subject
        </h2>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter the subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-4">
            List of subject already exists:
          </p>
          
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveEdit(index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="text-gray-600 text-sm">{subject}</span>
                )}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Save
          </button>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Delete this subject</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure? You can't undo this action afterwards.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};