import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from 'react';
import { ArrowLeft, ChevronDown, Search, X, Edit3, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { IconFilter2, IconUsers, IconClock, IconEye, IconTrash, IconCheck } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../components/views/candidates/dataTable';
import CompactCalendar from '../components/CompactCalendar';

// CSS styles for range sliders
const rangeSliderStyles = `
  .slider-thumb {
    background: transparent;
    pointer-events: none;
  }
  
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: all;
    position: relative;
    z-index: 1;
  }
  
  .slider-thumb::-moz-range-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: all;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = rangeSliderStyles;
  document.head.appendChild(styleElement);
}

interface Member {
  initials: string;
  gender: 'male' | 'female';
}

interface Topic {
  id: string;
  topic: string;
  project: string;
  members: Member[];
  status: string;
  progress: number;
  estimatedStartDate: string;
  startDate: string;
  endDate: string;
  estimatedEndDate: string;
  estimatedDuration: string;
  actualDuration: string;
  estimatedBudget: string;
  budget: string;
  domain: string[];
  industries: string[];
  critical: boolean;
}

// Filter interface for topics
interface TopicFilters {
  ids: string[];
  topics: string[];
  projects: string[];
  memberNames: string[];
  statuses: string[];
  minProgress: number;
  maxProgress: number;
  estimatedStartDate: string;
  estimatedEndDate: string;
  estimatedDuration: string;
  actualDuration: string;
  critical: string[];
  minEstimatedBudget: number;
  maxEstimatedBudget: number;
  minBudget: number;
  maxBudget: number;
  domains: string[];
}

const getAvatarColor = (gender: 'male' | 'female'): string => {
  return gender === 'female' ? 'bg-pink-500' : 'bg-blue-500';
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'In Progress':
      return 'bg-yellow-500 text-white whitespace-nowrap';
    case 'Not Started':
      return 'bg-gray-400 text-white whitespace-nowrap';
    default:
      return 'bg-blue-500 text-white whitespace-nowrap';
  }
};

// Dropdown Component
interface DropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  multiple?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onChange, placeholder, multiple = true }) => {
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

  const handleSelect = (option: string) => {
    if (multiple) {
      const newSelected = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      onChange(newSelected);
    } else {
      onChange([option]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-100 flex items-center justify-between"
      >
        <span>{selected.length > 0 ? `${selected.length} selected` : placeholder}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => {}}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Status Filter Component
const StatusFilter: React.FC<{ selected: string[], onChange: (selected: string[]) => void }> = ({ selected, onChange }) => {
  const statuses = [
    { id: 'Not Started', label: 'Not Started' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' }
  ];

  const handleStatusToggle = (statusId: string) => {
    const newSelected = selected.includes(statusId)
      ? selected.filter(s => s !== statusId)
      : [...selected, statusId];
    onChange(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status.id}
          onClick={() => handleStatusToggle(status.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors relative ${
            selected.includes(status.id)
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {status.label}
          {selected.includes(status.id) && (
            <IconCheck stroke={2} className="w-3 h-3 absolute -top-1 -right-1 bg-green-600 rounded-full p-0.5" />
          )}
        </button>
      ))}
    </div>
  );
};

// Active Filters Component
const ActiveFilters: React.FC<{ filters: TopicFilters, onRemoveFilter: (type: string, value: string | number) => void, onClearAll: () => void }> = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFiltersCount = 
    filters.ids.length + 
    filters.topics.length + 
    filters.projects.length + 
    filters.memberNames.length + 
    filters.statuses.length + 
    filters.domains.length +
    filters.critical.length +
    (filters.estimatedStartDate ? 1 : 0) +
    (filters.estimatedEndDate ? 1 : 0) +
    (filters.estimatedDuration ? 1 : 0) +
    (filters.actualDuration ? 1 : 0);

  if (activeFiltersCount === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center text-gray-500 text-sm">
        No active filters
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Active Filters</span>
        <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs">{activeFiltersCount}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.ids.map(id => (
          <div key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            ID: {id}
            <button onClick={() => onRemoveFilter('ids', id)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.topics.map(topic => (
          <div key={topic} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Topic: {topic}
            <button onClick={() => onRemoveFilter('topics', topic)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.projects.map(project => (
          <div key={project} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Project: {project}
            <button onClick={() => onRemoveFilter('projects', project)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.memberNames.map(name => (
          <div key={name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Member: {name}
            <button onClick={() => onRemoveFilter('memberNames', name)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.statuses.map(status => (
          <div key={status} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Status: {status}
            <button onClick={() => onRemoveFilter('statuses', status)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.domains.map(domain => (
          <div key={domain} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Domain: {domain}
            <button onClick={() => onRemoveFilter('domains', domain)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.critical.map(crit => (
          <div key={crit} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Critical: {crit}
            <button onClick={() => onRemoveFilter('critical', crit)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={onClearAll}
          className="text-blue-600 hover:text-blue-800 text-xs underline"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

// Date Picker Component
const DatePicker: React.FC<{ label: string, value: string, onChange: (value: string) => void, onClear: () => void }> = ({ label, value, onChange, onClear }) => {
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

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">{label}</span>
        {value && (
          <span className="ml-auto text-sm text-gray-900">{value}</span>
        )}
        {value && (
          <button onClick={handleClearDate} className="ml-2 text-red-500 hover:text-red-700">
            <IconTrash className="w-3 h-3" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 left-0">
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

// Progress Range Component
const ProgressRange: React.FC<{ min: number; max: number; onChange: (min: number, max: number) => void }> = ({ min, max, onChange }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{ left: `${min}%`, width: `${Math.max(0, max - min)}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={min}
          onChange={(e) => {
            const newMin = Math.min(parseInt(e.target.value), max);
            onChange(newMin, max);
          }}
          className="absolute w-full h-2 appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={max}
          onChange={(e) => {
            const newMax = Math.max(parseInt(e.target.value), min);
            onChange(min, newMax);
          }}
          className="absolute w-full h-2 appearance-none cursor-pointer slider-thumb"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Min: {min}%</span>
        <span>Mid</span>
        <span>Max: {max}%</span>
      </div>
    </div>
  );
};

// Budget Range Component
const BudgetRange: React.FC<{ min: number; max: number; onChange: (min: number, max: number) => void; label: string }> = ({ min, max, onChange, label }) => {
  const maxBudget = 100000;
  const formatCurrency = (value: number) => `$${(value).toLocaleString()}`;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{formatCurrency(0)}</span>
        <span>{formatCurrency(maxBudget / 2)}</span>
        <span>{formatCurrency(maxBudget)}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{ 
            left: `${(min / maxBudget) * 100}%`, 
            width: `${((max - min) / maxBudget) * 100}%` 
          }}
        />
        <input
          type="range"
          min="0"
          max={maxBudget}
          step="1000"
          value={min}
          onChange={(e) => {
            const newMin = Math.min(parseInt(e.target.value), max);
            onChange(newMin, max);
          }}
          className="absolute w-full h-2 appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min="0"
          max={maxBudget}
          step="1000"
          value={max}
          onChange={(e) => {
            const newMax = Math.max(parseInt(e.target.value), min);
            onChange(min, newMax);
          }}
          className="absolute w-full h-2 appearance-none cursor-pointer slider-thumb"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Min</span>
        <span>Mid</span>
        <span>Max</span>
      </div>
    </div>
  );
};

// Multi-select dropdown component for team filters
interface MultiSelectDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
}

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder, searchPlaceholder }: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
      >
        <span className="text-gray-500 text-sm">
          {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleToggleOption(option)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Active filters component for team filters
interface ActiveTeamFiltersProps {
  filters: TeamMemberFilters;
  onRemoveFilter: (type: string, value: string) => void;
  onClearAll: () => void;
}

const ActiveTeamFilters = ({ filters, onRemoveFilter, onClearAll }: ActiveTeamFiltersProps) => {
  const getAllActiveFilters = () => {
    const activeFilters: Array<{ type: string; value: string; label: string }> = [];
    
    filters.names.forEach(name => activeFilters.push({ type: 'names', value: name, label: name }));
    filters.emails.forEach(email => activeFilters.push({ type: 'emails', value: email, label: email }));
    filters.domains.forEach(domain => activeFilters.push({ type: 'domains', value: domain, label: domain }));
    
    return activeFilters;
  };

  const activeFilters = getAllActiveFilters();

  if (activeFilters.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Active Filters</span>
          <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">0</span>
        </div>
        <div className="text-center text-gray-500 text-sm py-4">
          No active filters
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Active Filters</span>
        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{activeFilters.length}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {activeFilters.map((filter, index) => (
          <span
            key={`${filter.type}-${filter.value}-${index}`}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            {filter.label}
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
      >
        Clear all filters
      </button>
    </div>
  );
};

// Team Filter Panel Component
interface TeamFilterPanelProps {
  filters: TeamMemberFilters;
  setFilters: (filters: TeamMemberFilters) => void;
  allMembers: TeamMember[];
  onClose: () => void;
}

const TeamFilterPanel = forwardRef<HTMLDivElement, TeamFilterPanelProps>(({ filters, setFilters, allMembers, onClose }, ref) => {
  // Extract unique values from team members for dropdown options
  const memberNames = [...new Set(allMembers.map((m: TeamMember) => m.name))];
  const memberEmails = [...new Set(allMembers.map((m: TeamMember) => m.email))];
  const memberDomains = [...new Set(allMembers.map((m: TeamMember) => m.role))]; // Using role as domain

  const onRemoveFilter = (type: string, value: string) => {
    const newFilters = { ...filters };
    switch (type) {
      case 'names':
        newFilters.names = newFilters.names.filter((v: string) => v !== value);
        break;
      case 'emails':
        newFilters.emails = newFilters.emails.filter((v: string) => v !== value);
        break;
      case 'domains':
        newFilters.domains = newFilters.domains.filter((v: string) => v !== value);
        break;
    }
    setFilters(newFilters);
  };

  const onClearAll = () => {
    setFilters({
      names: [],
      emails: [],
      domains: []
    });
  };

  return (
    <div ref={ref} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-4 z-50 max-h-96 overflow-y-auto">
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        
        <ActiveTeamFilters
          filters={filters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAll}
        />
      </div>

      <div className="px-4 space-y-4">
        {/* Name Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <MultiSelectDropdown
            options={memberNames}
            selectedValues={filters.names}
            onChange={(values: string[]) => setFilters({ ...filters, names: values })}
            placeholder="Select and search names..."
            searchPlaceholder="Search names..."
          />
        </div>

        {/* Email Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <MultiSelectDropdown
            options={memberEmails}
            selectedValues={filters.emails}
            onChange={(values: string[]) => setFilters({ ...filters, emails: values })}
            placeholder="Select and search emails..."
            searchPlaceholder="Search emails..."
          />
        </div>

        {/* Domain Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
          <MultiSelectDropdown
            options={memberDomains}
            selectedValues={filters.domains}
            onChange={(values: string[]) => setFilters({ ...filters, domains: values })}
            placeholder="Select and search domains..."
            searchPlaceholder="Search domains..."
          />
        </div>

        {/* Apply Filters Button */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
});

// Team Member Filter Interface
interface TeamMemberFilters {
  names: string[];
  emails: string[];
  domains: string[];
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
  gender: 'male' | 'female';
}

// Topic Filter Panel Component
interface TopicFilterPanelProps {
  filters: TopicFilters;
  setFilters: (filters: TopicFilters) => void;
  onRemoveFilter: (type: string, value: string | number) => void;
  onClearAll: () => void;
  allTopics: Topic[];
}

const TopicFilterPanel = forwardRef<HTMLDivElement, TopicFilterPanelProps>(({ filters, setFilters, onRemoveFilter, onClearAll, allTopics }, ref) => {
  // Extract unique values from topics for dropdown options
  const ids = [...new Set(allTopics.map(t => t.id))];
  const topicNames = [...new Set(allTopics.map(t => t.topic || t.project))];
  const projectNames = [...new Set(allTopics.map(t => t.project))];
  const memberNames = [...new Set(allTopics.flatMap(t => t.members.map(m => m.initials)))];
  const domains = [...new Set(allTopics.flatMap(t => t.domain))];
  const criticalOptions = ['Yes', 'No'];

  return (
    <div ref={ref} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-4 z-50 max-h-96 overflow-y-auto">
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        
        <ActiveFilters
          filters={filters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAll}
        />
      </div>

      <div className="px-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
          <Dropdown
            options={ids}
            selected={filters.ids}
            onChange={(ids) => setFilters({ ...filters, ids })}
            placeholder="Select and search IDs..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
          <Dropdown
            options={topicNames}
            selected={filters.topics}
            onChange={(topics) => setFilters({ ...filters, topics })}
            placeholder="Select and search topics..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
          <Dropdown
            options={projectNames}
            selected={filters.projects}
            onChange={(projects) => setFilters({ ...filters, projects })}
            placeholder="Select and search projects..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Members</label>
          <Dropdown
            options={memberNames}
            selected={filters.memberNames}
            onChange={(memberNames) => setFilters({ ...filters, memberNames })}
            placeholder="Select and search members..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <StatusFilter
            selected={filters.statuses}
            onChange={(statuses) => setFilters({ ...filters, statuses })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
          <ProgressRange
            min={filters.minProgress}
            max={filters.maxProgress}
            onChange={(minProgress, maxProgress) => setFilters({ ...filters, minProgress, maxProgress })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E.Budget</label>
          <BudgetRange
            min={filters.minEstimatedBudget}
            max={filters.maxEstimatedBudget}
            onChange={(minEstimatedBudget, maxEstimatedBudget) => setFilters({ ...filters, minEstimatedBudget, maxEstimatedBudget })}
            label="Estimated Budget"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
          <BudgetRange
            min={filters.minBudget}
            max={filters.maxBudget}
            onChange={(minBudget, maxBudget) => setFilters({ ...filters, minBudget, maxBudget })}
            label="Actual Budget"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Critical</label>
          <Dropdown
            options={criticalOptions}
            selected={filters.critical}
            onChange={(critical) => setFilters({ ...filters, critical })}
            placeholder="Select critical status..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
          <Dropdown
            options={domains}
            selected={filters.domains}
            onChange={(domains) => setFilters({ ...filters, domains })}
            placeholder="Select and search domains..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Ranges</label>
          <div className="space-y-2">
            <DatePicker
              label="E.Start Date"
              value={filters.estimatedStartDate}
              onChange={(date) => setFilters({ ...filters, estimatedStartDate: date })}
              onClear={() => setFilters({ ...filters, estimatedStartDate: '' })}
            />
            <DatePicker
              label="E.End Date"
              value={filters.estimatedEndDate}
              onChange={(date) => setFilters({ ...filters, estimatedEndDate: date })}
              onClear={() => setFilters({ ...filters, estimatedEndDate: '' })}
            />
            <DatePicker
              label="E.Duration"
              value={filters.estimatedDuration}
              onChange={(date) => setFilters({ ...filters, estimatedDuration: date })}
              onClear={() => setFilters({ ...filters, estimatedDuration: '' })}
            />
            <DatePicker
              label="A.Duration"
              value={filters.actualDuration}
              onChange={(date) => setFilters({ ...filters, actualDuration: date })}
              onClear={() => setFilters({ ...filters, actualDuration: '' })}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onClearAll}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
});

const TopicsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'archive'>('active');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [teamFilters, setTeamFilters] = useState<TeamMemberFilters>({
    names: [],
    emails: [],
    domains: []
  });
  const [filteredTeamMembers, setFilteredTeamMembers] = useState<TeamMember[]>([]);
  const [isTeamFilterOpen, setIsTeamFilterOpen] = useState(false);
  const teamFilterRef = useRef<HTMLDivElement>(null);
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<TopicFilters>({
    ids: [],
    topics: [],
    projects: [],
    memberNames: [],
    statuses: [],
    minProgress: 0,
    maxProgress: 100,
    estimatedStartDate: '',
    estimatedEndDate: '',
    estimatedDuration: '',
    actualDuration: '',
    critical: [],
    minEstimatedBudget: 0,
    maxEstimatedBudget: 100000,
    minBudget: 0,
    maxBudget: 100000,
    domains: []
  });
  
  // Apply filters function
  const applyFilters = useCallback((topicsList: Topic[], currentFilters: TopicFilters) => {
    return topicsList.filter((topicItem: Topic) => {
      // ID filter
      if (currentFilters.ids.length > 0 && !currentFilters.ids.includes(topicItem.id)) {
        return false;
      }
      
      // Topic filter
      if (currentFilters.topics.length > 0 && !currentFilters.topics.includes(topicItem.topic || topicItem.project)) {
        return false;
      }
      
      // Project filter
      if (currentFilters.projects.length > 0 && !currentFilters.projects.includes(topicItem.project)) {
        return false;
      }
      
      // Member filter
      if (currentFilters.memberNames.length > 0) {
        const hasMatchingMember = topicItem.members.some(member => 
          currentFilters.memberNames.includes(member.initials)
        );
        if (!hasMatchingMember) return false;
      }
      
      // Status filter
      if (currentFilters.statuses.length > 0 && !currentFilters.statuses.includes(topicItem.status)) {
        return false;
      }
      
      // Progress filter
      if (topicItem.progress < currentFilters.minProgress || topicItem.progress > currentFilters.maxProgress) {
        return false;
      }
      
      // Critical filter
      if (currentFilters.critical.length > 0) {
        const isCritical = topicItem.critical ? 'Yes' : 'No';
        if (!currentFilters.critical.includes(isCritical)) return false;
      }
      
      // Domain filter
      if (currentFilters.domains.length > 0) {
        const hasMatchingDomain = topicItem.domain.some(domain => 
          currentFilters.domains.includes(domain)
        );
        if (!hasMatchingDomain) return false;
      }
      
      // Budget filters
      const estimatedBudget = parseFloat(topicItem.estimatedBudget.replace(/[$,]/g, '')) || 0;
      const actualBudget = parseFloat(topicItem.budget.replace(/[$,]/g, '')) || 0;
      
      if (estimatedBudget < currentFilters.minEstimatedBudget || estimatedBudget > currentFilters.maxEstimatedBudget) {
        return false;
      }
      
      if (actualBudget < currentFilters.minBudget || actualBudget > currentFilters.maxBudget) {
        return false;
      }
      
      // Date filters
      if (currentFilters.estimatedStartDate && topicItem.estimatedStartDate !== currentFilters.estimatedStartDate) {
        return false;
      }
      
      if (currentFilters.estimatedEndDate && topicItem.estimatedEndDate !== currentFilters.estimatedEndDate) {
        return false;
      }
      
      if (currentFilters.estimatedDuration && topicItem.estimatedDuration !== currentFilters.estimatedDuration) {
        return false;
      }
      
      if (currentFilters.actualDuration && topicItem.actualDuration !== currentFilters.actualDuration) {
        return false;
      }
      
      return true;
    });
  }, []);
  
  // Filtered topics for the table
  const filteredTopics = useMemo(() => {
    if (!Array.isArray(topics)) return [];
    
    // First apply tab filtering
    const tabFiltered = topics.filter((topicItem: Topic) => {
      const isArchived = topicItem.status === 'Completed' || topicItem.status === 'Cancelled';
      return tab === 'active' ? !isArchived : isArchived;
    });
    
    // Then apply custom filters
    return applyFilters(tabFiltered, filters);
  }, [topics, tab, filters, applyFilters]);

  // Filter handlers
  const handleRemoveFilter = useCallback((type: string, value: string | number) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (type === 'ids') {
        newFilters.ids = newFilters.ids.filter(item => item !== value);
      } else if (type === 'topics') {
        newFilters.topics = newFilters.topics.filter(item => item !== value);
      } else if (type === 'projects') {
        newFilters.projects = newFilters.projects.filter(item => item !== value);
      } else if (type === 'memberNames') {
        newFilters.memberNames = newFilters.memberNames.filter(item => item !== value);
      } else if (type === 'statuses') {
        newFilters.statuses = newFilters.statuses.filter(item => item !== value);
      } else if (type === 'domains') {
        newFilters.domains = newFilters.domains.filter(item => item !== value);
      } else if (type === 'critical') {
        newFilters.critical = newFilters.critical.filter(item => item !== value);
      }
      return newFilters;
    });
  }, []);
  
  const handleClearAllFilters = useCallback(() => {
    setFilters({
      ids: [],
      topics: [],
      projects: [],
      memberNames: [],
      statuses: [],
      minProgress: 0,
      maxProgress: 100,
      estimatedStartDate: '',
      estimatedEndDate: '',
      estimatedDuration: '',
      actualDuration: '',
      critical: [],
      minEstimatedBudget: 0,
      maxEstimatedBudget: 100000,
      minBudget: 0,
      maxBudget: 100000,
      domains: []
    });
    setIsFilterOpen(false);
  }, []);
  
  // Click outside handler for filter panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleViewDetails = () => {
    navigate(`/dashboard/topics/${id}`);
  };

  const handleCreateTopic = () => {
    // Handle create topic action
  };

  const handleCreateProject = () => {
    // Handle create project action
  };

  const handleArchiveToggle = (_topicId: string, _isActive: boolean) => {
    // Handle archive toggle logic
    const newTopics = topics.map(topic => {
      if (topic.id.toString() === _topicId) {
        return { ...topic, status: _isActive ? 'Archived' : 'Active' };
      }
      return topic;
    });
    setTopics(newTopics);
  };

  const handleDelete = (_topicId: string) => {
    setTopic(null);
  };

  // Define topic table columns
  const topicColumns: ColumnDef<Topic>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">ID</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-900 px-2">{row.getValue("id")}</div>
      ),
      enableResizing: true,
      size: 80,
    },
    {
      accessorKey: "topic",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Topic</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-900 px-2">{row.getValue("topic")}</div>
      ),
      enableResizing: true,
      size: 180,
    },
    {
      accessorKey: "project",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Project</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-900 px-2">{row.getValue("project")}</div>
      ),
      enableResizing: true,
      size: 180,
    },
    {
      accessorKey: "members",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Members</div>
      ),
      cell: ({ row }) => {
        const members = row.getValue("members") as Array<{ initials: string; gender: 'male' | 'female' }>;
        return (
          <div className="flex -space-x-1 px-2">
            {members.map((member, index) => (
              <div
                key={index}
                className={`w-7 h-7 rounded-full ${getAvatarColor(member.gender)} flex items-center justify-center text-white text-xs font-bold border-2 border-white`}
              >
                {member.initials}
              </div>
            ))}
          </div>
        );
      },
      enableResizing: true,
      size: 140,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Status</div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="px-2">
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap shadow-sm ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        );
      },
      enableResizing: true,
      size: 130,
    },
    {
      accessorKey: "progress",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Progress</div>
      ),
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number;
        return (
          <div className="flex flex-col items-start gap-1 px-2">
            <span className="text-sm font-bold text-gray-900">{progress}%</span>
            <div className="w-20 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      },
      enableResizing: true,
      size: 100,
    },
    {
      accessorKey: "estimatedStartDate",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">E.Start Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("estimatedStartDate")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "estimatedEndDate",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">E.End Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("estimatedEndDate")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "estimatedDuration",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">E.Duration</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("estimatedDuration")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "actualDuration",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">A.Duration</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("actualDuration")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "CRITICAL",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">CRITICAL.</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-900">{row.getValue("CRITICAL")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "estimatedBudget",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">E.Budget</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("estimatedBudget")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "budget",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Budget</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("budget")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "domain",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Domain</div>
      ),
      cell: ({ row }) => {
        const domains: string[] = row.getValue("domain");
        return (
          <div className="text-sm font-bold text-gray-900">
            {domains.join(" / ")}
          </div>
        );
      },
      enableResizing: true,
      size: 150,
    },
    {
      accessorKey: "actions",
      id: "actions",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Actions</div>
      ),
      enableResizing: true,
      size: 120,
      cell: ({ row }) => {
        const topicItem = row.original;
        
        const handleViewDetails = () => {
          navigate(`/dashboard/topics/detail/${topicItem.id}`);
        };
        
        const handleDeleteTopic = () => {
          setTopics((prev) => prev.filter((t) => t.id !== topicItem.id));
        };

        const handleArchiveToggle = () => {
          const isCurrentlyActive = ["In Progress", "Suspended", "Not Started"].includes(topicItem.status);
          const newStatus = isCurrentlyActive ? "Cancelled" : "In Progress";
          
          setTopics((prev) =>
            prev.map((t) =>
              t.id === topicItem.id ? { ...t, status: newStatus } : t
            )
          );
        };

        const isActive = ["In Progress", "Suspended", "Not Started"].includes(topicItem.status);

        return (
          <div className="flex items-center justify-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={handleViewDetails} title="View Details" aria-label="View Details" className="h-8 w-8">
              <IconEye stroke={2} className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleArchiveToggle}
              title={isActive ? "Archive Topic" : "Unarchive Topic"}
              aria-label={isActive ? "Archive Topic" : "Unarchive Topic"}
              className="h-8 w-8"
            >
              {isActive ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 18l4-4l-1.4-1.4l-1.6 1.6V10h-2v4.2l-1.6-1.6L8 14zm-7 3q-.825 0-1.412-.587T3 19V6.525q0-.35.113-.675t.337-.6L4.7 3.725q.275-.35.687-.538T6.25 3h11.5q.45 0 .863.188t.687.537l1.25 1.525q.225.275.338.6t.112.675V19q0 .825-.587 1.413T19 21zm.4-15h13.2l-.85-1H6.25z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
	<path fill="currentColor" d="m21.706 5.292l-2.999-2.999A1 1 0 0 0 18 2H6a1 1 0 0 0-.707.293L2.294 5.292A1 1 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a1 1 0 0 0-.294-.708M6.414 4h11.172l1 1H5.414zM14 14v3h-4v-3H7l5-5l5 5z"></path>
</svg>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDeleteTopic} title="Delete Topic" aria-label="Delete Topic" className="h-8 w-8">
              <IconTrash stroke={2} className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        );
      },
    }
  ];

  // Column definitions removed - using simple list view instead

  useEffect(() => {
    if (!id) {
      navigate('/dashboard/topics');
      return;
    }

    const fetchTopicData = async () => {
      try {
        const response = await fetch('/data/TopicData.json');
        const data = await response.json();
        const allTopics = Array.isArray(data) ? data : data.topics || [];
        setTopics(allTopics);
        const currentTopic = allTopics.find((t: Topic) => t.id.toString() === id);
        if (currentTopic) {
          setTopic(currentTopic);
        } else {
          navigate('/dashboard/topics');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching topic data:', error);
        setLoading(false);
      }
    };

    // Mock single topic data - in real app, this would come from API
    const mockTopics: Topic[] = [
      {
        id: 'T001',
        topic: 'AI Research Platform Development',
        project: 'AI Research Platform',
        members: [
          { initials: 'JD', gender: 'male' },
          { initials: 'SM', gender: 'female' },
          { initials: 'RJ', gender: 'male' }
        ],
        status: 'In Progress',
        progress: 75,
        estimatedStartDate: '2024-01-15',
        startDate: '2024-01-20',
        endDate: '2024-06-30',
        estimatedEndDate: '2024-06-15',
        estimatedDuration: '5 months',
        actualDuration: '4.5 months',
        estimatedBudget: '$50,000',
        budget: '$48,500',
        domain: ['AI', 'Machine Learning'],
        industries: ['Technology', 'Research'],
        critical: true
      },
    ];
    setTopic(mockTopics[0]);
    fetchTopicData();
  }, [id, navigate]);

  const teamMembers: TeamMember[] = useMemo(() => [
    { name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Frontend', gender: 'female' as const },
    { name: 'Bob Smith', email: 'bob.s@example.com', role: 'Backend', gender: 'male' as const },
    { name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Design', gender: 'male' as const },
    { name: 'Dana White', email: 'dana.w@example.com', role: 'Testing', gender: 'female' as const },
    { name: 'Eve Davis', email: 'eve.d@example.com', role: 'Marketing', gender: 'female' as const },
    { name: 'Frank Miller', email: 'frank.m@example.com', role: 'Frontend', gender: 'male' as const },
    { name: 'Grace Lee', email: 'grace.l@example.com', role: 'Backend', gender: 'female' as const },
    { name: 'Hank Green', email: 'hank.g@example.com', role: 'Design', gender: 'male' as const },
    { name: 'Ivy Black', email: 'ivy.b@example.com', role: 'Testing', gender: 'female' as const },
    { name: 'Jack Blue', email: 'jack.b@example.com', role: 'Marketing', gender: 'male' as const },
  ], []);

  // Apply filters to team members
  const applyTeamFilters = useCallback((members: TeamMember[]): TeamMember[] => {
    return members.filter((member) => {
      // Name filter
      if (teamFilters.names.length > 0 && !teamFilters.names.includes(member.name)) {
        return false;
      }

      // Email filter
      if (teamFilters.emails.length > 0 && !teamFilters.emails.includes(member.email)) {
        return false;
      }

      // Domain (role) filter
      if (teamFilters.domains.length > 0 && !teamFilters.domains.includes(member.role)) {
        return false;
      }

      return true;
    });
  }, [teamFilters.names, teamFilters.emails, teamFilters.domains]);

  // Update filtered team members when filters change
  useEffect(() => {
    const filtered = applyTeamFilters(teamMembers);
    setFilteredTeamMembers(filtered);
  }, [teamMembers, applyTeamFilters]);

  // Handle click outside team filter panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teamFilterRef.current && !teamFilterRef.current.contains(event.target as Node)) {
        setIsTeamFilterOpen(false);
      }
    };

    if (isTeamFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTeamFilterOpen]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!topic) {
    return <div className="flex items-center justify-center min-h-screen">Topic not found</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className=" px-6 py-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <ArrowLeft className="w-5 h-5 font-bold text-[#2D3748]" />
          <h1 className="text-xl font-bold text-[#2D3748]">Topic Details</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="overflow-x-auto project-detail-scroll">
              <div className="flex items-center justify-between pb-2">
                {/* Topic Overview */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#2D3748]">Topic Overview :</h2>
                </div>
                
                {/* Total Team Size */}
                <div className="flex items-center space-x-3 flex-1 justify-center">
                  <IconUsers stroke={2} size={40} className="text-[#718096] flex-shrink-0" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Total Team Size</div>
                  </div>
                </div>

                {/* Effective Duration */}
                <div className="flex items-center space-x-3 flex-1 justify-center">
                  <IconClock stroke={2} size={40} className="text-[#718096] flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Effective Duration : 1 months</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Remaining Duration : 5 months</div>
                  </div>
                </div>

                {/* Status Button */}
                <div className="flex-1 flex justify-end">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    In Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* About Topic */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">About Topic</h2>
                <Edit3 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              <div className="text-gray-600 text-sm leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Leo in vitae turpis massa. Arcu risus quis varius quam quisque id diam vel quam.
                <br /><br />
                Morbi non arcu risus quis. Blandit volutpat maecenas volutpat blandit. Sagittis id consectetur purus 
                ut faucibus pulvinar elementum integer enim. Pretium nibh ipsum consequat nisl vel pretium.
                Leo urna molestie at elementum eu facilisis. Et malesuada fames ac turpis egestas sed.Ac turpis eges
              </div>

              {/* Domains and Industries */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Domains</h3>
                  <div className="flex flex-wrap gap-2">
                    {(topic?.domain || ['Web', 'Security']).map((domain, index) => (
                      <span key={index} className="px-3 py-1 bg-[#4A74E0] text-white text-sm font-medium rounded-full">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#4A74E0] text-white text-sm font-medium rounded-full">
                      Web
                    </span>
                    <span className="px-3 py-1 bg-[#4A74E0] text-white text-sm font-medium rounded-full">
                      Security
                    </span>
                  </div>
                </div>
              </div>

              {/* Technology */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-800 mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#4A74E0] text-white text-sm rounded-full">
                    React
                  </span>
                  <span className="px-3 py-1 bg-[#4A74E0] text-white text-sm rounded-full">
                    NodeJs
                  </span>
                  <span className="px-3 py-1 bg-[#4A74E0] text-white text-sm rounded-full">
                    Mongodb
                  </span>
                  <span className="px-3 py-1 bg-[#4A74E0] text-white text-sm rounded-full">
                    Express
                  </span>
                  <span className="px-3 py-1 bg-[#4A74E0] text-white text-sm rounded-full">
                    Talwindcss
                  </span>
                </div>
              </div>

              {/* Date and Budget Grid */}
              <div className="grid grid-cols-4 gap-6 text-sm mb-6">
                <div>
                  <div className="text-gray-500 mb-2">Estimated start date</div>
                  <div className="font-medium text-gray-800">07 Nov, 2023</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-2">Start date</div>
                  <div className="font-medium text-gray-800">07 Nov, 2023</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-2">Estimated end date</div>
                  <div className="font-medium text-gray-800">07 Nov, 2023</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-2">End date</div>
                  <div className="font-medium text-gray-800">—</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-gray-500 mb-2">Estimated duration</div>
                  <div className="font-medium text-gray-800">07 Nov, 2023</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-2">Estimated budget</div>
                  <div className="font-medium text-gray-800">$14,000</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-2">Budget</div>
                  <div className="font-medium text-gray-800">$14,000</div>
                </div>
              </div>
            </div>
            {/* Topics List Table */}
            <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tasks List</h2>
                <div className="relative" ref={filterRef}>
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <IconFilter2 className="w-6 h-6" />
                  </button>
                  
                  {/* Filter Panel */}
                  {isFilterOpen && (
                    <TopicFilterPanel
                      filters={filters}
                      setFilters={setFilters}
                      onRemoveFilter={handleRemoveFilter}
                      onClearAll={handleClearAllFilters}
                      allTopics={topics}
                    />
                  )}
                </div>
              </div>

              {/* Custom Tab Implementation */}
              <div className="flex mb-1">
                <div className="w-1/2 text-center">
                  <span className={`font-semibold ${tab === 'active' ? 'text-gray-900' : 'text-gray-500'}`}>
                    Active
                  </span>
                </div>
                <div className="w-1/2 text-center">
                  <span className={`font-semibold ${tab === 'archive' ? 'text-gray-900' : 'text-gray-500'}`}>
                    Archive
                  </span>
                </div>
              </div>

              {/* Clickable Bar */}
              <div className="flex w-full h-2 mb-6">
                <button
                  aria-label="Show active topics"
                  className={`w-1/2 h-full transition-all duration-200 p-0 border-none cursor-pointer ${tab === 'active' ? 'bg-blue-600' : 'bg-gray-200 hover:bg-gray-300 hover:scale-y-150'}`}
                  onClick={() => setTab('active')}
                ></button>
                <button
                  aria-label="Show archive topics"
                  className={`w-1/2 h-full transition-all duration-200 p-0 border-none cursor-pointer ${tab === 'archive' ? 'bg-blue-600' : 'bg-gray-200 hover:bg-gray-300 hover:scale-y-150'}`}
                  onClick={() => setTab('archive')}
                ></button>
              </div>

              {/* Data Table */}
              <DataTable
                columns={topicColumns}
                data={filteredTopics}
                stickyColumns={{
                  topic: 'left-20'
                }}
              />
            </div>
            </div>

            {/* Team Project Sidebar */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h3 className="text-base font-medium text-gray-600 mb-3">Project</h3>
                <p className="text-xl font-semibold text-gray-900">{topic?.project || 'Chakra Soft Ui Version'}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Team Topic</h2>
                  <div className="relative">
                    <button
                      onClick={() => setIsTeamFilterOpen(!isTeamFilterOpen)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Filter team members"
                    >
                      <IconFilter2 className="w-6 h-6 text-gray-600" />
                    </button>

                    {isTeamFilterOpen && (
                      <TeamFilterPanel
                        ref={teamFilterRef}
                        filters={teamFilters}
                        setFilters={setTeamFilters}
                        allMembers={teamMembers}
                        onClose={() => setIsTeamFilterOpen(false)}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-4 project-detail-scroll">
                  {filteredTeamMembers.map((member) => (
                    <div key={member.email} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${getAvatarColor(member.gender)} text-white flex items-center justify-center mr-3`}>
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default TopicsDetail;