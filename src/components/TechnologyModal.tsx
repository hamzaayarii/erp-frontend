import React, { useState } from 'react';
import { Modal } from './Modal';
import { Edit2, Trash2 } from 'lucide-react';

interface TechnologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnologyModal: React.FC<TechnologyModalProps> = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [technologies, setTechnologies] = useState([
    'ReactJs',
    'NodeJs',
    'Express',
    'Angular',
    'Mongodb'
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Filter technologies based on input value
  const filteredTechnologies = technologies.filter(technology =>
    technology.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSave = () => {
    if (inputValue.trim() && !technologies.includes(inputValue.trim())) {
      setTechnologies([...technologies, inputValue.trim()]);
      setInputValue('');
    }
    onClose();
  };

  const handleEdit = (index: number) => {
    const originalIndex = technologies.indexOf(filteredTechnologies[index]);
    setEditingIndex(originalIndex);
    setEditValue(technologies[originalIndex]);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      const updatedTechnologies = [...technologies];
      updatedTechnologies[index] = editValue.trim();
      setTechnologies(updatedTechnologies);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDelete = (index: number) => {
    const originalIndex = technologies.indexOf(filteredTechnologies[index]);
    setDeleteIndex(originalIndex);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedTechnologies = technologies.filter((_, i) => i !== deleteIndex);
      setTechnologies(updatedTechnologies);
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
          New Technology
        </h2>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter the technology"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-4">
            List of technology already exists:
          </p>
          
          <div className="space-y-3">
            {filteredTechnologies.map((technology, index) => {
              const originalIndex = technologies.indexOf(technology);
              return (
                <div key={originalIndex} className="flex items-center justify-between py-2">
                  {editingIndex === originalIndex ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSaveEdit(originalIndex)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(originalIndex)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">{technology}</span>
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
              );
            })}
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
              <h3 className="text-lg font-semibold text-gray-800">Delete this technology</h3>
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