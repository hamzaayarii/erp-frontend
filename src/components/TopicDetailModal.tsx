import React, { useState, useRef, useEffect } from 'react';
import { X, Search, ChevronDown, Calendar } from 'lucide-react';
import { IconFilter2 } from '@tabler/icons-react';
import CompactCalendar from './CompactCalendar';

// CSS for custom slider styling
const sliderStyles = `
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .slider-thumb::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

interface Topic {
  id: string;
  name: string;
  description?: string;
  technologies?: string[];
  date?: string;
}

interface TopicDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topic: Topic) => void;
  categoryType: string; // 'Programs', 'Products', 'Projects', 'Topics'
}

// Filter interface
interface TopicFilters {
  nbInterns: string;
  domain: string;
  startingDate: string;
  finishingDate: string;
  technologies: string;
  duration: number;
}

// Filter Components
const Dropdown: React.FC<{
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-2xl hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <span className="text-gray-700">{selected || placeholder}</span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DatePicker: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  onClear: () => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-3 h-3 text-gray-600" />
        <span className="text-sm text-gray-700 flex-1 text-center">
          {value || '—/—/——'}
        </span>
      </div>
      {isOpen && (
        <div className="fixed z-[100] mt-1" style={{
          left: dropdownRef.current?.getBoundingClientRect().left || 0,
          top: (dropdownRef.current?.getBoundingClientRect().bottom || 0) + 4
        }}>
          <CompactCalendar
            value={value}
            onChange={handleDateSelect}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

const DurationSlider: React.FC<{ 
  value: number; 
  onChange: (value: number) => void; 
  min?: number; 
  max?: number;
}> = ({ value, onChange, min = 0, max = 12 }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="relative pt-6">
      <div 
        className="absolute bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium"
        style={{
          left: `calc(${percentage}% - 8px)`,
          top: '-6px'
        }}
      >
        {value}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-l-transparent border-r-transparent border-t-blue-500"></div>
      </div>
      <div className="relative">
        <div className="w-full h-1.5 bg-gray-200 rounded-full">
          <div 
            className="h-1.5 bg-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-0 left-0 w-full h-1.5 opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-3 h-3 bg-white border-2 border-gray-300 rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const TopicFilterPanel: React.FC<{
  filters: TopicFilters;
  setFilters: (filters: TopicFilters) => void;
  onClose: () => void;
}> = ({ filters, setFilters, onClose }) => {
  const domainOptions = ['Web', 'Mobile', 'AI/ML', 'DevOps', 'Design', 'Data Science'];
  const technologyOptions = ['React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 'C#', '.NET'];

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
      <div className="p-4 space-y-4">
        {/* Row 1: NB Interns and Domain */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-2">NB Interns</label>
            <input
              type="text"
              value={filters.nbInterns}
              onChange={(e) => setFilters({ ...filters, nbInterns: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-2">Domain</label>
            <Dropdown
              options={domainOptions}
              selected={filters.domain}
              onChange={(domain) => setFilters({ ...filters, domain })}
              placeholder="Web"
            />
          </div>
        </div>

        {/* Row 2: Starting Date and Finishing Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-2">Starting Date</label>
            <DatePicker
              label="Starting Date"
              value={filters.startingDate}
              onChange={(date) => setFilters({ ...filters, startingDate: date })}
              onClear={() => setFilters({ ...filters, startingDate: '' })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-2">Finishing Date</label>
            <DatePicker
              label="Finishing Date"
              value={filters.finishingDate}
              onChange={(date) => setFilters({ ...filters, finishingDate: date })}
              onClear={() => setFilters({ ...filters, finishingDate: '' })}
            />
          </div>
        </div>

        {/* Row 3: Technologies (full width) */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-2">Technologies</label>
          <Dropdown
            options={technologyOptions}
            selected={filters.technologies}
            onChange={(tech) => setFilters({ ...filters, technologies: tech })}
            placeholder="Web"
          />
        </div>

        {/* Row 4: Duration */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-4">Duration</label>
          <DurationSlider
            value={filters.duration}
            onChange={(duration) => setFilters({ ...filters, duration })}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  categoryType 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<TopicFilters>({
    nbInterns: '',
    domain: '',
    startingDate: '',
    finishingDate: '',
    technologies: '',
    duration: 5,
  });

  // Click outside to close filter panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inject slider styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = sliderStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!isOpen) return null;

  // Mock detailed topics data based on category
  const getDetailedTopics = (): Topic[] => {
    switch (categoryType) {
      case 'Programs':
        return [
          { 
            id: 'PG-01', 
            name: 'Topic Title 1', 
            technologies: ['Tech1', 'Tech2'],
            date: '17/12/2024'
          },
          { 
            id: 'PG-02', 
            name: 'Topic Title 2', 
            technologies: ['Tech1', 'Tech2', 'Tech3'],
            date: '17/12/2024'
          },
          { 
            id: 'PG-03', 
            name: 'Topic Title 3', 
            technologies: ['Tech1', 'Tech2', 'Tech3'],
            date: '17/12/2024'
          },
          { 
            id: 'PG-04', 
            name: 'Topic Title 4', 
            technologies: ['Tech1', 'Tech2', 'Tech3'],
            date: '17/12/2024'
          },
        ];
      case 'Products':
        return [
          { 
            id: 'PR-01', 
            name: 'Product Topic 1', 
            technologies: ['React', 'Node.js'],
            date: '17/12/2024'
          },
          { 
            id: 'PR-02', 
            name: 'Product Topic 2', 
            technologies: ['Vue', 'Python', 'Docker'],
            date: '17/12/2024'
          },
          { 
            id: 'PR-03', 
            name: 'Product Topic 3', 
            technologies: ['Angular', 'Java'],
            date: '17/12/2024'
          },
          { 
            id: 'PR-04', 
            name: 'Product Topic 4', 
            technologies: ['Flutter', 'Firebase'],
            date: '17/12/2024'
          },
        ];
      case 'Projects':
        return [
          { 
            id: 'PJ-01', 
            name: 'Project Topic 1', 
            technologies: ['AWS', 'Kubernetes'],
            date: '17/12/2024'
          },
          { 
            id: 'PJ-02', 
            name: 'Project Topic 2', 
            technologies: ['Azure', 'MongoDB', 'Express'],
            date: '17/12/2024'
          },
          { 
            id: 'PJ-03', 
            name: 'Project Topic 3', 
            technologies: ['GCP', 'PostgreSQL'],
            date: '17/12/2024'
          },
          { 
            id: 'PJ-04', 
            name: 'Project Topic 4', 
            technologies: ['DevOps', 'CI/CD'],
            date: '17/12/2024'
          },
        ];
      default: // Topics
        return [
          { 
            id: 'TP-01', 
            name: 'Topic Title 1', 
            technologies: ['Tech1', 'Tech2'],
            date: '17/12/2024'
          },
          { 
            id: 'TP-02', 
            name: 'Topic Title 2', 
            technologies: ['Tech1', 'Tech2', 'Tech3'],
            date: '17/12/2024'
          },
          { 
            id: 'TP-03', 
            name: 'Topic Title 3', 
            technologies: ['Tech1', 'Tech2', 'Tech3'],
            date: '17/12/2024'
          },
          { 
            id: 'TP-04', 
            name: 'Topic Title 4', 
            technologies: ['Tech1', 'Tech2', 'Tech3'],
            date: '17/12/2024'
          },
        ];
    }
  };

  const detailedTopics = getDetailedTopics();

  const filteredTopics = detailedTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleSave = () => {
    if (selectedTopic) {
      onSave(selectedTopic);
      onClose();
    }
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
        className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
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

        {/* Search and Filters */}
        <div className="px-6 pt-4 flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Filters */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50"
            >
              <IconFilter2 stroke={2} />
            </button>
            
            {isFiltersOpen && (
              <TopicFilterPanel
                filters={filters}
                setFilters={setFilters}
                onClose={() => setIsFiltersOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Content - 2x2 Grid */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTopic?.id === topic.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTopicSelect(topic);
                  }
                }}
              >
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg mb-3">
                    {topic.name}
                  </div>
                  
                  {topic.technologies && (
                    <div className="text-sm text-gray-500 mb-3">
                      {topic.technologies.join(' / ')}
                    </div>
                  )}
                  
                  {topic.date && (
                    <div className="text-sm text-gray-500">
                      {topic.date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No topics found matching your search.
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 p-6 pt-4 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition-colors"
          >
            Return
          </button>
          <button 
            onClick={handleSave}
            disabled={!selectedTopic}
            className={`px-8 py-2 rounded-full font-semibold transition-colors ${
              selectedTopic
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailModal;
