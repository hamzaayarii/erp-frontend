import React, { useState } from 'react';
import { X } from 'lucide-react';
import { IconUsersGroup, IconClock } from '@tabler/icons-react';
import ProjectsTable from './tables/ProjectsTable';
import ProgramsTable from './tables/ProgramsTable';
import ProductsTable from './tables/ProductsTable';

interface LinkedItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    type: 'program' | 'product' | 'project';
    status: string;
    description: string;
    domains: string[];
    technologies: string[];
    industries: string[];
    topicsCount?: number;
    teamSize?: number;
    effectiveDuration?: string;
    remainingDuration?: string;
    estimatedStartDate?: string;
    startDate?: string;
    estimatedEndDate?: string;
    endDate?: string;
    estimatedDuration?: string;
    estimatedBudget?: string;
    budget?: string;
  };
}

const LinkedItemModal: React.FC<LinkedItemModalProps> = ({ isOpen, onClose, item }) => {
  const [showRelatedTable, setShowRelatedTable] = useState(false);
  
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'not started':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const renderTag = (tag: string, index: number) => (
    <span
      key={index}
      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
    >
      {tag}
    </span>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
            <span className={`px-3 py-1 text-white text-sm rounded-lg ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {/* Stats Row */}
          <div className="flex items-center gap-8 mb-6">
          {/* Topics Count */}
          {item.topicsCount && (
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 512 512" className="text-[#718096] flex-shrink-0">
                <path fill="currentColor" d="M136 24H16v120h120Zm-32 88H48V56h56Zm32 88H16v120h120Zm-32 88H48v-56h56Zm32 88H16v120h120Zm-32 88H48v-56h56Zm32 88H16v120h120Zm-32 88H48v-56h56Zm72-440.002h320v32H176zm0 88h256v32H176zm0 88h320v32H176zm0 88h256v32H176zm0 176h256v32H176zm0-88h320v32H176z"></path>
              </svg>
              <div className="text-sm">
                <div className="text-2xl font-bold text-gray-900">{item.topicsCount}</div>
                <div className="text-sm text-gray-600 whitespace-nowrap">Topics</div>
              </div>
            </div>
          )}

          {/* Team Size */}
          {item.teamSize && (
            <div className="flex items-center gap-3">
              <IconUsersGroup stroke={2} size={40} className="text-[#718096] flex-shrink-0" />
              <div className="text-sm">
                <div className="text-2xl font-bold text-gray-900">{item.teamSize}</div>
                <div className="text-sm text-gray-600 whitespace-nowrap">Total Team Size</div>
              </div>
            </div>
          )}

          {/* Duration */}
          {(item.effectiveDuration || item.remainingDuration) && (
            <div className="flex items-center gap-3">
              <IconClock stroke={2} size={40} className="text-[#718096] flex-shrink-0" />
              <div className="min-w-max">
                {item.effectiveDuration && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">Effective Duration : </span>
                    <span className="text-gray-700">{item.effectiveDuration}</span>
                  </div>
                )}
                {item.remainingDuration && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">Remaining Duration : </span>
                    <span className="text-gray-700">{item.remainingDuration}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            About {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </h3>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line">
            {item.description}
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-4 mb-6">
          {/* Domains and Industries in same row */}
          <div className="flex flex-wrap gap-8">
            {/* Domains */}
            {item.domains.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Domains</h4>
                <div className="flex flex-wrap gap-2">
                  {item.domains.map((domain, index) => renderTag(domain, index))}
                </div>
              </div>
            )}

            {/* Industries */}
            {item.industries.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {item.industries.map((industry, index) => renderTag(industry, index))}
                </div>
              </div>
            )}
          </div>

          {/* Technologies */}
          {item.technologies.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech, index) => renderTag(tech, index))}
              </div>
            </div>
          )}
        </div>

        {/* Dates and Budget Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {item.estimatedStartDate && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Estimated start date</div>
              <div className="font-semibold text-gray-900">{item.estimatedStartDate}</div>
            </div>
          )}

          {item.startDate && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Start date</div>
              <div className="font-semibold text-gray-900">{item.startDate}</div>
            </div>
          )}

          {item.estimatedEndDate && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Estimated end date</div>
              <div className="font-semibold text-gray-900">{item.estimatedEndDate}</div>
            </div>
          )}

          {item.endDate && (
            <div>
              <div className="text-sm text-gray-500 mb-1">End date</div>
              <div className="font-semibold text-gray-900">{item.endDate || '—'}</div>
            </div>
          )}

          {item.estimatedDuration && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Estimated duration</div>
              <div className="font-semibold text-gray-900">{item.estimatedDuration}</div>
            </div>
          )}

          {item.estimatedBudget && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Estimated budget</div>
              <div className="font-semibold text-gray-900">{item.estimatedBudget}</div>
            </div>
          )}

          {item.budget && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Budget</div>
              <div className="font-semibold text-gray-900">{item.budget}</div>
            </div>
          )}
        </div>

        {/* Show Related Structures Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => setShowRelatedTable(!showRelatedTable)}
            className="bg-white text-black border-2 border-black px-6 py-2 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            {showRelatedTable ? 'Hide Related Structures' : 'Show Related Structures'}
          </button>
        </div>

        </div>
      </div>

      {/* Related Tables Popup Overlay */}
      {showRelatedTable && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          onClick={() => setShowRelatedTable(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Related {item.type === 'project' ? 'Projects' : item.type === 'program' ? 'Programs' : 'Products'}
              </h2>
              <button
                onClick={() => setShowRelatedTable(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              {item.type === 'project' && (
                <ProjectsTable 
                  showHeader={false}
                  showCreateButton={false}
                  showTabs={true}
                  className="border-0 shadow-none h-full"
                />
              )}
              {item.type === 'program' && (
                <ProgramsTable 
                  showHeader={false}
                  showCreateButton={false}
                  showTabs={true}
                  className="border-0 shadow-none h-full"
                />
              )}
              {item.type === 'product' && (
                <ProductsTable 
                  showHeader={false}
                  showCreateButton={false}
                  showTabs={true}
                  className="border-0 shadow-none h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedItemModal;
