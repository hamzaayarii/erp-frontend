import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTableStore } from '../store/tableStore';
import { Candidate, columns } from '../components/views/candidates/columns';
import { DataTable } from '../components/views/candidates/dataTable';
import { IconFilter2, IconTrash, IconCheck } from '@tabler/icons-react';
import { Calendar, ChevronDown, Search, X } from 'lucide-react';
import CompactCalendar from '../components/CompactCalendar';

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

// Filter interface
interface CandidateFilters {
  fullNames: string[];
  statuses: string[];
  minScore: number;
  maxScore: number;
  availabilityDate: string;
  mustEndDate: string;
  applicationDate: string;
  durations: string[];
}

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
    { id: 'Accepted', label: 'Accepted' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Affected', label: 'Affected' },
    { id: 'Rejected', label: 'Rejected' },
    { id: 'Banned', label: 'Banned' },
    { id: 'Finished', label: 'Finished' }
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

// Date Picker Component
const DatePicker: React.FC<{ label: string, value: string, onChange: (value: string) => void, onClear: () => void }> = ({ label, value, onChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
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
    <div className="relative" ref={datePickerRef}>
      <div
        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-700">{label}</span>
        {value && (
          <span className="ml-auto text-sm text-gray-900">{value}</span>
        )}
        {value && (
          <button onClick={handleClearDate} className="ml-2 text-red-500 hover:text-red-700 p-1">
            <IconTrash className="w-4 h-4" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1">
          <CompactCalendar
            value={value}
            onChange={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
};

// Score Range Component
const ScoreRange: React.FC<{ min: number; max: number; onChange: (min: number, max: number) => void }> = ({ min, max, onChange }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>0</span>
        <span>50</span>
        <span>100</span>
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
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 1 }}
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
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ zIndex: 2 }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
};

// Active Filters Component
const ActiveFilters: React.FC<{ filters: CandidateFilters, onRemoveFilter: (type: string, value: string | number) => void, onClearAll: () => void }> = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFiltersCount = 
    filters.fullNames.length + 
    filters.statuses.length + 
    filters.durations.length +
    (filters.availabilityDate ? 1 : 0) +
    (filters.mustEndDate ? 1 : 0) +
    (filters.applicationDate ? 1 : 0) +
    (filters.minScore > 0 ? 1 : 0) +
    (filters.maxScore < 100 ? 1 : 0);

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
        {filters.fullNames.map(name => (
          <div key={name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Name: {name}
            <button onClick={() => onRemoveFilter('fullNames', name)} className="hover:bg-blue-200 rounded">
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
        {filters.durations.map(duration => (
          <div key={duration} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Duration: {duration}
            <button onClick={() => onRemoveFilter('durations', duration)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.availabilityDate && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Availability: {filters.availabilityDate}
            <button onClick={() => onRemoveFilter('availabilityDate', filters.availabilityDate)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {filters.mustEndDate && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Must End: {filters.mustEndDate}
            <button onClick={() => onRemoveFilter('mustEndDate', filters.mustEndDate)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {filters.applicationDate && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Application: {filters.applicationDate}
            <button onClick={() => onRemoveFilter('applicationDate', filters.applicationDate)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {filters.minScore > 0 && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Min Score: {filters.minScore}
            <button onClick={() => onRemoveFilter('minScore', filters.minScore)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {filters.maxScore < 100 && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Max Score: {filters.maxScore}
            <button onClick={() => onRemoveFilter('maxScore', filters.maxScore)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
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

// Candidate Filter Panel Component
interface CandidateFilterPanelProps {
  filters: CandidateFilters;
  setFilters: (filters: CandidateFilters) => void;
  onRemoveFilter: (type: string, value: string | number) => void;
  onClearAll: () => void;
  allCandidates: Candidate[];
}

const CandidateFilterPanel: React.FC<CandidateFilterPanelProps> = ({ filters, setFilters, onRemoveFilter, onClearAll, allCandidates }) => {
  // Extract unique values from candidates for dropdown options
  const fullNames = [...new Set(allCandidates.map(c => c.fullName))];
  const durations = [...new Set(allCandidates.map(c => c.duration))];

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg py-4 z-50 max-h-96 overflow-y-auto">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <Dropdown
            options={fullNames}
            selected={filters.fullNames}
            onChange={(fullNames) => setFilters({ ...filters, fullNames })}
            placeholder="Select and search names..."
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <Dropdown
            options={durations}
            selected={filters.durations}
            onChange={(durations) => setFilters({ ...filters, durations })}
            placeholder="Select and search durations..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
          <ScoreRange
            min={filters.minScore}
            max={filters.maxScore}
            onChange={(minScore, maxScore) => setFilters({ ...filters, minScore, maxScore })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Ranges</label>
          <div className="space-y-2">
            <DatePicker
              label="Availability Date"
              value={filters.availabilityDate}
              onChange={(date) => setFilters({ ...filters, availabilityDate: date })}
              onClear={() => setFilters({ ...filters, availabilityDate: '' })}
            />
            <DatePicker
              label="Must End Date"
              value={filters.mustEndDate}
              onChange={(date) => setFilters({ ...filters, mustEndDate: date })}
              onClear={() => setFilters({ ...filters, mustEndDate: '' })}
            />
            <DatePicker
              label="Application Date"
              value={filters.applicationDate}
              onChange={(date) => setFilters({ ...filters, applicationDate: date })}
              onClear={() => setFilters({ ...filters, applicationDate: '' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Candidates() {
    const [data, setData] = useState<Candidate[]>([]);
    const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const { activeTab, setActiveTab } = useTableStore();
    const tab = activeTab.candidates || 'active';

    // Inject slider styles
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = sliderStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const [filters, setFilters] = useState<CandidateFilters>({
        fullNames: [],
        statuses: [],
        minScore: 0,
        maxScore: 100,
        availabilityDate: '',
        mustEndDate: '',
        applicationDate: '',
        durations: [],
    });

    const handleSetActiveTab = (newTab: 'active' | 'archive') => {
        setActiveTab('candidates', newTab);
    };

    // Handle archive/unarchive functionality
    const handleArchiveToggle = (candidateId: string) => {
        setAllCandidates(prev => {
            return prev.map(candidate => {
                if (candidate.id === candidateId) {
                    const isCurrentlyActive = ["Accepted", "Pending", "Affected", "Rejected", "Banned"].includes(candidate.status);
                    const newStatus = isCurrentlyActive ? "Finished" : "Pending";
                    return { ...candidate, status: newStatus };
                }
                return candidate;
            });
        });
    };

    // Handle delete functionality
    const handleDelete = (candidateId: string) => {
        setAllCandidates(prev => prev.filter(c => c.id !== candidateId));
    };

    useEffect(() => {
        async function loadAllData() {
            try {
                const response = await fetch('/data/CandidatesData.json');
                const jsonData = await response.json();
                const candidates = jsonData.candidates || [];
                setAllCandidates(candidates);
            } catch (error) {
                console.error('Error loading candidates data:', error);
                setAllCandidates([]);
            }
        }
        loadAllData();
    }, []);

    // Handle click outside for filter dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Apply filters
    const applyFilters = useCallback((candidates: Candidate[]): Candidate[] => {
        return candidates.filter(candidate => {
            // Full Name filter
            if (filters.fullNames.length > 0 && !filters.fullNames.includes(candidate.fullName)) {
                return false;
            }

            // Status filter
            if (filters.statuses.length > 0 && !filters.statuses.includes(candidate.status)) {
                return false;
            }

            // Score range filter
            if (candidate.score < filters.minScore || candidate.score > filters.maxScore) {
                return false;
            }

            // Duration filter
            if (filters.durations.length > 0 && !filters.durations.includes(candidate.duration)) {
                return false;
            }

            // Date filters
            if (filters.availabilityDate && candidate.availabilityDate !== filters.availabilityDate) {
                return false;
            }

            if (filters.mustEndDate && candidate.mustEndDate !== filters.mustEndDate) {
                return false;
            }

            if (filters.applicationDate && candidate.applicationDate !== filters.applicationDate) {
                return false;
            }

            return true;
        });
    }, [filters]);

    useEffect(() => {
        if (allCandidates.length > 0) {
            // First filter by tab (active/archive)
            let tabFilteredData;
            if (tab === "active") {
                tabFilteredData = allCandidates.filter((candidate: Candidate) => candidate.status !== "Finished");
            } else {
                tabFilteredData = allCandidates.filter((candidate: Candidate) => candidate.status === "Finished");
            }
            
            // Then apply additional filters
            const filtered = applyFilters(tabFilteredData);
            setData(filtered);
        }
    }, [tab, allCandidates, applyFilters]);

    const handleRemoveFilter = (type: string, value: string | number) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (type === 'fullNames' || type === 'statuses' || type === 'durations') {
                newFilters[type] = (prev[type as keyof CandidateFilters] as string[]).filter(v => v !== value);
            } else if (type === 'minScore') {
                newFilters.minScore = 0;
            } else if (type === 'maxScore') {
                newFilters.maxScore = 100;
            } else {
                (newFilters as any)[type] = '';
            }
            return newFilters;
        });
    };

    const handleClearAllFilters = () => {
        setFilters({
            fullNames: [],
            statuses: [],
            minScore: 0,
            maxScore: 100,
            availabilityDate: '',
            mustEndDate: '',
            applicationDate: '',
            durations: [],
        });
    };

    // Add event listeners for custom events from the table
    useEffect(() => {
        const handleArchiveEvent = (event: CustomEvent) => {
            handleArchiveToggle(event.detail.candidateId);
        };

        const handleDeleteEvent = (event: CustomEvent) => {
            handleDelete(event.detail.candidateId);
        };

        window.addEventListener('candidateArchiveToggle', handleArchiveEvent as EventListener);
        window.addEventListener('candidateDelete', handleDeleteEvent as EventListener);

        return () => {
            window.removeEventListener('candidateArchiveToggle', handleArchiveEvent as EventListener);
            window.removeEventListener('candidateDelete', handleDeleteEvent as EventListener);
        };
    }, []);

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Candidates List</h1>                

                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-white"
                        >
                            <IconFilter2 stroke={2} />
                        </button>
                        {isFilterOpen && (
                            <CandidateFilterPanel
                                filters={filters}
                                setFilters={setFilters}
                                onRemoveFilter={handleRemoveFilter}
                                onClearAll={handleClearAllFilters}
                                allCandidates={allCandidates}
                            />
                        )}
                    </div>    
                </div>

                {/* Candidates List Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    
                    <div className="p-6">
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
                        <div className="flex w-full h-2 cursor-pointer mb-6">
                            <div
                                className={`w-1/2 h-full transition-all duration-200 ${tab === 'active' ? 'bg-blue-500' : 'bg-gray-100 hover:bg-gray-200 hover:scale-y-150'}`}
                                onClick={() => handleSetActiveTab('active')}
                            ></div>
                            <div
                                className={`w-1/2 h-full transition-all duration-200 ${tab === 'archive' ? 'bg-blue-500' : 'bg-gray-100 hover:bg-gray-200 hover:scale-y-150'}`}
                                onClick={() => handleSetActiveTab('archive')}
                            ></div>
                        </div>

                        {/* Content */}
                        <DataTable 
                            columns={columns} 
                            data={data.filter(candidate => candidate?.fullName)} 
                            tableId="candidates"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// let address = candidate.address;
// let backToSchoolDate = candidate.backToSchoolDate;
// let domains = candidate.domains;
// let duration = candidate.duration;
// let email = candidate.email;
// let finishDate = candidate.finishDate;
// let firstImpression = candidate.firstImpression;
// let institute = candidate.institute;
// let internshipType = candidate.internshipType;
// let interviewDay = candidate.interviewDay;
// let phone = candidate.phone;
// let position = candidate.position;
// let resume = candidate.resume;
// let skills = candidate.skills;
// let slots = candidate.slots;
// let startDate = candidate.startDate;
// let technologies = candidate.technologies;
