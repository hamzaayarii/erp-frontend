import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import TopicDetailModal from './TopicDetailModal';

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface TopicSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: Topic) => void;
}

const TopicSelectionModal: React.FC<TopicSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTopic 
}) => {
  const [activeTab, setActiveTab] = useState('Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!isOpen) return null;

  // Mock data for different tabs
  const mockTopics: Topic[] = [
    { id: 'TP-01', name: 'Project Green', description: 'Environmental sustainability project' },
    { id: 'TP-02', name: 'AI Development', description: 'Artificial intelligence research' },
    { id: 'TP-03', name: 'Mobile App', description: 'Cross-platform mobile application' },
    { id: 'TP-04', name: 'Web Platform', description: 'Modern web development platform' },
    { id: 'TP-05', name: 'Data Analytics', description: 'Big data analysis and visualization' },
    { id: 'TP-06', name: 'Cloud Migration', description: 'Infrastructure cloud migration' },
  ];

  const mockPrograms: Topic[] = [
    { id: 'PG-01', name: 'Program Green', description: 'Environmental program initiative' },
    { id: 'PG-02', name: 'Digital Transformation', description: 'Company-wide digital transformation' },
    { id: 'PG-03', name: 'Innovation Hub', description: 'Innovation and R&D program' },
  ];

  const mockProducts: Topic[] = [
    { id: 'DW09', name: 'Product Green', description: 'Sustainable product line' },
    { id: 'DW10', name: 'Smart Solutions', description: 'IoT and smart device products' },
    { id: 'DW11', name: 'Cloud Platform', description: 'Enterprise cloud solutions' },
  ];

  const mockProjects: Topic[] = [
    { id: 'PR-01', name: 'Project Green', description: 'Green energy project' },
    { id: 'PR-02', name: 'Mobile Initiative', description: 'Mobile app development project' },
    { id: 'PR-03', name: 'Data Migration', description: 'Legacy system migration project' },
  ];

  const tabs = [
    { key: 'Programs', label: 'Programs', data: mockPrograms },
    { key: 'Products', label: 'Products', data: mockProducts },
    { key: 'Projects', label: 'Projects', data: mockProjects },
    { key: 'Topics', label: 'Topics', data: mockTopics }
  ];

  const getCurrentData = () => {
    const currentTab = tabs.find(tab => tab.key === activeTab);
    return currentTab ? currentTab.data : [];
  };

  const filteredItems = getCurrentData().filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicSelect = (topic: Topic) => {
    onSelectTopic(topic);
    onClose();
  };

  const handleArrowClick = (e: React.MouseEvent, categoryType: string) => {
    e.stopPropagation();
    setSelectedCategory(categoryType);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalSave = (topic: Topic) => {
    onSelectTopic(topic);
    setIsDetailModalOpen(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-600">Chose the topic</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs - Stolen from PortfolioTabs */}
        <div className="px-6 pt-4">
          {/* Tab Labels */}
          <div className="flex mb-1">
            {tabs.map((tab) => (
              <div key={tab.key} className="w-1/4 text-center">
                <span className={`font-semibold ${
                  activeTab === tab.key ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {tab.label}
                </span>
              </div>
            ))}
          </div>

          {/* Clickable Bar with Separators */}
          <div className="flex w-full h-2 cursor-pointer">
            {tabs.map((tab, index) => (
              <div key={tab.key} className="flex w-1/4">
                <div
                  className={`flex-1 h-full transition-all duration-200 ${
                    activeTab === tab.key 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 hover:bg-gray-300 hover:scale-y-150'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                ></div>
                {/* Blue separator - show after first three tabs */}
                {index < tabs.length - 1 && (
                  <div 
                    className="w-2 h-full" 
                    style={{ backgroundColor: '#4A74E0' }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 flex justify-end">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTopicSelect(item)}
                className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200 bg-white"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTopicSelect(item);
                  }
                }}
              >
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {item.id} : {item.name}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
                <ArrowRight 
                  className="w-6 h-6" 
                  style={{ color: '#718096' }} 
                  onClick={(e) => handleArrowClick(e, activeTab)}
                />
              </div>
            ))}
            
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No {activeTab.toLowerCase()} found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Expand Button */}
        <div className="flex justify-center p-6 pt-4 border-t border-gray-200">
          <button className="bg-white text-black border-2 border-black px-6 py-2 rounded-full font-semibold hover:bg-gray-50 transition-colors">
            Expand
          </button>
        </div>
      </div>

      {/* Topic Detail Modal */}
      <TopicDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleDetailModalSave}
        categoryType={selectedCategory}
      />
    </div>
  );
};

export default TopicSelectionModal;
