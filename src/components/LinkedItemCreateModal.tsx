import React, { useState, useCallback } from 'react';
import { Modal } from './Modal';
import { Edit2, Trash2 } from 'lucide-react';

interface LinkedItemCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'program' | 'product' | 'project';
}

export const LinkedItemCreateModal: React.FC<LinkedItemCreateModalProps> = ({ isOpen, onClose, type }) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  // Get current input value for this modal type
  const inputValue = inputValues[type] || '';
  
  // Set input value for current modal type
  const setInputValue = (value: string) => {
    setInputValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Initialize input value for this type if not set
  React.useEffect(() => {
    if (inputValues[type] === undefined) {
      setInputValues(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  }, [type, inputValues]);
  
  // Sample data for each type
  const getInitialItems = useCallback(() => {
    switch (type) {
      case 'program':
        return [
          'ERP System Development',
          'Mobile App Platform',
          'AI Research Initiative',
          'Cloud Migration Program',
          'Digital Transformation'
        ];
      case 'product':
        return [
          'Admin Dashboard',
          'Mobile Application',
          'API Gateway',
          'Analytics Platform',
          'User Management System'
        ];
      case 'project':
        return [
          'Frontend Development',
          'Backend API',
          'Database Design',
          'Testing Framework',
          'Deployment Pipeline'
        ];
      default:
        return [];
    }
  }, [type]);

  const [itemsState, setItemsState] = useState<Record<string, string[]>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Get current items for this modal type
  const items = itemsState[type] || [];
  
  // Set items for current modal type
  const setItems = (newItems: string[]) => {
    setItemsState(prev => ({
      ...prev,
      [type]: newItems
    }));
  };

  // Initialize items for this type if not already set
  React.useEffect(() => {
    if (!itemsState[type]) {
      const initialItems = getInitialItems();
      setItemsState(prev => ({
        ...prev,
        [type]: initialItems
      }));
    }
  }, [type, itemsState, getInitialItems]);


  // Filter items based on input value
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSave = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
    onClose();
  };

  const handleEdit = (index: number) => {
    const originalIndex = items.indexOf(filteredItems[index]);
    setEditingIndex(originalIndex);
    setEditValue(items[originalIndex]);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      const updatedItems = [...items];
      updatedItems[index] = editValue.trim();
      setItems(updatedItems);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDelete = (index: number) => {
    const originalIndex = items.indexOf(filteredItems[index]);
    setDeleteIndex(originalIndex);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedItems = items.filter((_, i) => i !== deleteIndex);
      setItems(updatedItems);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
  };

  const getTitle = () => {
    switch (type) {
      case 'program':
        return 'New Program';
      case 'product':
        return 'New Product';
      case 'project':
        return 'New Project';
      default:
        return 'New Item';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'program':
        return 'Enter the program name';
      case 'product':
        return 'Enter the product name';
      case 'project':
        return 'Enter the project name';
      default:
        return 'Enter the item name';
    }
  };

  const getListTitle = () => {
    switch (type) {
      case 'program':
        return 'List of programs already exists:';
      case 'product':
        return 'List of products already exists:';
      case 'project':
        return 'List of projects already exists:';
      default:
        return 'List of items already exists:';
    }
  };

  const getDeleteTitle = () => {
    switch (type) {
      case 'program':
        return 'Delete this program';
      case 'product':
        return 'Delete this product';
      case 'project':
        return 'Delete this project';
      default:
        return 'Delete this item';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 pb-6">
        <h2 className="text-xl font-semibold text-blue-600 text-center mb-6">
          {getTitle()}
        </h2>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-4">
            {getListTitle()}
          </p>
          
          <div className="space-y-3">
            {filteredItems.map((item, index) => {
              const originalIndex = items.indexOf(item);
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
                    <span className="text-gray-600 text-sm">{item}</span>
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
              <h3 className="text-lg font-semibold text-gray-800">{getDeleteTitle()}</h3>
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
