import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../components/views/candidates/dataTable";
import { Button } from "@/components/ui/button";
import { IconEye, IconTrash, IconPlayerPauseFilled, IconFilter2, IconCheck, IconX } from '@tabler/icons-react';
import { Calendar, X, Search, ChevronDown } from 'lucide-react';
import { useTableStore } from '@/store/tableStore';
import { PortfolioTabs } from '../components/PortfolioTabs';
import CompactCalendar from '../components/CompactCalendar';
import ArchiveStatusModal from '../components/ArchiveStatusModal';


// Define the Program interface with all new fields
interface Program {
  id: string;
  project: string;
  members: Array<{ name: string; gender: 'male' | 'female' }>;
  progress: number;
  status: string;
  subPrograms: string;
  subProducts: string;
  subProjects: string;
  estimatedStartDate: string;
  startDate: string;
  estimatedEndDate: string;
  endDate: string;
  estimatedDuration: string;
  actualDuration: string;
  estimatedBudget: string;
  budget: string;
  domain: string[];
}

// Filter interface
interface ProgramFilters {
  programNames: string[];
  memberNames: string[];
  memberEmails: string[];
  statuses: string[];
  domains: string[];
  subPrograms: string[];
  subProducts: string[];
  subProjects: string[];
  minProgress: number;
  maxProgress: number;
  minBudget: number;
  maxBudget: number;
  estimatedStartDate: string;
  startDate: string;
  endDate: string;
  estimatedEndDate: string;
  estimatedDuration: string;
  actualDuration: string;
}

const getAvatarColor = (gender: 'male' | 'female'): string => {
  return gender === 'female' ? 'bg-pink-500' : 'bg-blue-500';
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'bg-yellow-400 text-white';
    case 'finished':
      return 'bg-green-500 text-white';
    case 'cancelled':
      return 'bg-red-500 text-white';
    case 'suspended':
      return 'bg-blue-500 text-white';
    case 'not started':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-300 text-black';
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
    { id: 'Suspended', label: 'Suspended' },
    { id: 'Cancelled', label: 'Cancelled' },
    { id: 'Reopened', label: 'Reopened' },
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

// Active Filters Component
const ActiveFilters: React.FC<{ filters: ProgramFilters, onRemoveFilter: (type: string, value: string | number) => void, onClearAll: () => void }> = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFiltersCount = 
    filters.programNames.length + 
    filters.memberNames.length + 
    filters.memberEmails.length + 
    filters.statuses.length + 
    filters.domains.length +
    filters.subPrograms.length +
    filters.subProducts.length +
    filters.subProjects.length +
    (filters.estimatedStartDate ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0) +
    (filters.estimatedEndDate ? 1 : 0);

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
        {filters.programNames.map(name => (
          <div key={name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Program: {name}
            <button onClick={() => onRemoveFilter('programNames', name)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.subPrograms.map(name => (
          <div key={name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Sub-Program: {name}
            <button onClick={() => onRemoveFilter('subPrograms', name)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.subProducts.map(name => (
          <div key={name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Sub-Product: {name}
            <button onClick={() => onRemoveFilter('subProducts', name)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filters.subProjects.map(name => (
          <div key={name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Sub-Project: {name}
            <button onClick={() => onRemoveFilter('subProjects', name)} className="hover:bg-blue-200 rounded">
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

// Progress Range Component (dual-thumb)
const ProgressRange: React.FC<{ min: number; max: number; onChange: (min: number, max: number) => void }> = ({ min, max, onChange }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Base track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
        {/* Selected range highlight */}
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

// Budget Range Component (dual-thumb)
const BudgetRange: React.FC<{ min: number; max: number; onChange: (min: number, max: number) => void }> = ({ min, max, onChange }) => {
  const maxBudget = 100000;
  const formatCurrency = (value: number) => `$${(value).toLocaleString()}`;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{formatCurrency(0)}</span>
        <span>{formatCurrency(maxBudget / 2)}</span>
        <span>{formatCurrency(maxBudget)}</span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Base track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
        {/* Selected range highlight */}
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

// Program Filter Panel Component
interface ProgramFilterPanelProps {
  filters: ProgramFilters;
  setFilters: (filters: ProgramFilters) => void;
  onRemoveFilter: (type: string, value: string | number) => void;
  onClearAll: () => void;
  allPrograms: Program[];
}

const ProgramFilterPanel: React.FC<ProgramFilterPanelProps> = ({ filters, setFilters, onRemoveFilter, onClearAll, allPrograms }) => {
  // Extract unique values from programs for dropdown options
  const programNames = [...new Set(allPrograms.map(p => p.project))];
  const memberNames = [...new Set(allPrograms.flatMap(p => p.members.map(m => m.name)))];
  const memberEmails = [...new Set(allPrograms.flatMap(p => p.members.map(m => `${m.name}@company.com`)))]; // Mock emails
  const domains = [...new Set(allPrograms.flatMap(p => p.domain))];
  const subPrograms = [...new Set(allPrograms.map(p => p.subPrograms))];
  const subProducts = [...new Set(allPrograms.map(p => p.subProducts))];
  const subProjects = [...new Set(allPrograms.map(p => p.subProjects))];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-4 z-50 max-h-96 overflow-y-auto">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Program Name</label>
          <Dropdown
            options={programNames}
            selected={filters.programNames}
            onChange={(programNames) => setFilters({ ...filters, programNames })}
            placeholder="Select and search names..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Programs</label>
          <Dropdown
            options={subPrograms}
            selected={filters.subPrograms}
            onChange={(subPrograms) => setFilters({ ...filters, subPrograms })}
            placeholder="Select and search sub-programs..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Products</label>
          <Dropdown
            options={subProducts}
            selected={filters.subProducts}
            onChange={(subProducts) => setFilters({ ...filters, subProducts })}
            placeholder="Select and search sub-products..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Projects</label>
          <Dropdown
            options={subProjects}
            selected={filters.subProjects}
            onChange={(subProjects) => setFilters({ ...filters, subProjects })}
            placeholder="Select and search sub-projects..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Member Name</label>
          <Dropdown
            options={memberNames}
            selected={filters.memberNames}
            onChange={(memberNames) => setFilters({ ...filters, memberNames })}
            placeholder="Select and search names..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Member Email</label>
          <Dropdown
            options={memberEmails}
            selected={filters.memberEmails}
            onChange={(memberEmails) => setFilters({ ...filters, memberEmails })}
            placeholder="Select and search emails..."
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
          <BudgetRange
            min={filters.minBudget}
            max={filters.maxBudget}
            onChange={(minBudget, maxBudget) => setFilters({ ...filters, minBudget, maxBudget })}
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
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => setFilters({ ...filters, startDate: date })}
              onClear={() => setFilters({ ...filters, startDate: '' })}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
              onClear={() => setFilters({ ...filters, endDate: '' })}
            />
            <DatePicker
              label="E.End Date"
              value={filters.estimatedEndDate}
              onChange={(date) => setFilters({ ...filters, estimatedEndDate: date })}
              onClear={() => setFilters({ ...filters, estimatedEndDate: '' })}
            />
            <DatePicker
              label="E.duration"
              value={filters.estimatedDuration}
              onChange={(date) => setFilters({ ...filters, estimatedDuration: date })}
              onClear={() => setFilters({ ...filters, estimatedDuration: '' })}
            />
            <DatePicker
              label="A.duration"
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
};

// Archive Overview Item Component
interface ArchiveOverviewItemProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  color: string;
}

const ArchiveOverviewItem = ({ icon, count, label, color }: ArchiveOverviewItemProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-8 h-8 rounded-full border-2 ${color} bg-white flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-lg font-bold text-gray-900">{count}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default function Programs() {
  const [data, setData] = useState<Program[]>([]);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [archiveModal, setArchiveModal] = useState<{
    isOpen: boolean;
    program: Program | null;
    isArchiving: boolean;
  }>({
    isOpen: false,
    program: null,
    isArchiving: true
  });
  const activeTab = useTableStore((state) => state.activeTab.projects);
  const projectViewType = useTableStore((state) => state.projectViewType);
  const setActiveTab = useTableStore((state) => state.setActiveTab);
  const setProjectViewType = useTableStore((state) => state.setProjectViewType);
  
  const [filters, setFilters] = useState<ProgramFilters>({
    programNames: [],
    memberNames: [],
    memberEmails: [],
    statuses: [],
    domains: [],
    subPrograms: [],
    subProducts: [],
    subProjects: [],
    minProgress: 0,
    maxProgress: 100,
    minBudget: 0,
    maxBudget: 100000,
    estimatedStartDate: '',
    startDate: '',
    endDate: '',
    estimatedEndDate: '',
    estimatedDuration: '',
    actualDuration: ''
  });
  
  const handleSetActiveTab = (tab: 'active' | 'archive') => setActiveTab('projects', tab);
  const tab = activeTab;
  const viewType = projectViewType;
  const navigate = useNavigate();

  // Calculate status counts
  const getStatusCounts = () => {
    const counts = {
      notStarted: allPrograms.filter(p => p.status === 'Not Started').length,
      inProgress: allPrograms.filter(p => p.status === 'In Progress').length,
      reopened: 0, // You may want to add this status to your data
      suspended: allPrograms.filter(p => p.status === 'Suspended').length,
      finished: allPrograms.filter(p => p.status === 'Finished').length,
      cancelled: allPrograms.filter(p => p.status === 'Cancelled').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Archive modal handlers
  const handleArchiveConfirm = (newStatus: string) => {
    if (archiveModal.program) {
      setAllPrograms((prev) =>
        prev.map((p) =>
          p.id === archiveModal.program!.id ? { ...p, status: newStatus } : p
        )
      );
    }
  };

  const handleArchiveClose = () => {
    setArchiveModal({
      isOpen: false,
      program: null,
      isArchiving: true
    });
  };

  // Define the columns with updated styling to match the design
  const columns: ColumnDef<Program>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Id</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-900 px-2">{row.getValue("id")}</div>
      ),
      enableResizing: true,
      size: 80,
      minSize: 80,
    },
    {
      accessorKey: "project",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Program</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-900 px-2">{row.getValue("project")}</div>
      ),
      enableResizing: true,
      size: 180,
      minSize: 150,
    },
    {
      accessorKey: "members",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Members</div>
      ),
      cell: ({ row }) => {
        const members = row.getValue("members") as Array<{ name: string; gender: 'male' | 'female' }>;
        return (
          <div className="flex -space-x-1 px-2">
            {members.map((member, index) => (
              <div
                key={index}
                className={`w-7 h-7 rounded-full ${getAvatarColor(member.gender)} flex items-center justify-center text-white text-xs font-bold border-2 border-white`}
              >
                {member.name}
              </div>
            ))}
          </div>
        );
      },
      enableResizing: true,
      size: 140,
      minSize: 120,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Status</div>
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
      minSize: 120,
    },
    {
      accessorKey: "progress",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Progress</div>
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
      minSize: 100,
    },
    {
      accessorKey: "subPrograms",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Sub-Programs</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("subPrograms")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "subProducts",
      header: () => (
        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Sub-Products</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("subProducts")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "subProjects",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Sub-Projects</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("subProjects")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "estimatedStartDate",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">E.Start Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("estimatedStartDate")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "startDate",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Start Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("startDate")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "estimatedEndDate",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">E.End Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("estimatedEndDate")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "endDate",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">End Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("endDate")}</div>
      ),
      enableResizing: true,
      size: 120,
      minSize: 140,
    },
    {
      accessorKey: "estimatedDuration",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">E.Duration</div>
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
        <div className="text-gray-500 text-xs font-medium tracking-wider">A.Duration</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-700">{row.getValue("actualDuration")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "estimatedBudget",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">E.Budget</div>
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
        <div className="text-gray-500 text-xs font-medium tracking-wider">Budget</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm font-bold text-gray-900">{row.getValue("budget")}</div>
      ),
      enableResizing: true,
      size: 120,
    },
    {
      accessorKey: "domain",
      header: () => (
        <div className="text-gray-500 text-xs font-medium tracking-wider">Domain</div>
      ),
      cell: ({ row }) => {
        const domains: string[] = row.getValue("domain");
        return (
          <div className="text-sm font-bold text-gray-700">
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
        <div className="text-gray-500 text-xs font-medium tracking-wider">Action</div>
      ),
      enableResizing: true,
      size: 120,
      cell: ({ row }) => {
        const program = row.original;
        
        const handleViewDetails = () => {
          navigate(`/dashboard/programs/detail/${program.id}`);
        };
        
        const handleDelete = () => {
          setAllPrograms((prev) => prev.filter((p) => p.id !== program.id));
        };

        const handleArchiveToggle = () => {
          const isCurrentlyActive = ["In Progress", "Suspended", "Not Started"].includes(program.status);
          setArchiveModal({
            isOpen: true,
            program: program,
            isArchiving: isCurrentlyActive
          });
        };

        const isActive = ["In Progress", "Suspended", "Not Started"].includes(program.status);

        return (
          <div className="flex items-center justify-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={handleViewDetails} title="View Details" aria-label="View Details" className="h-8 w-8">
              <IconEye stroke={2} className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleArchiveToggle}
              title={isActive ? "Archive Program" : "Unarchive Program"}
              aria-label={isActive ? "Archive Program" : "Unarchive Program"}
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
            <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete Program" aria-label="Delete Program" className="h-8 w-8">
              <IconTrash stroke={2} className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        );
      },
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ProgramsData.json');
        const jsonData = await response.json();
        setAllPrograms(jsonData.programs);
      } catch (error) {
        console.error('Error loading data:', error);
        setAllPrograms([]);
      }
    };
    loadData();
  }, []);

  // Apply filters to programs
  const applyFilters = useCallback((programs: Program[]): Program[] => {
    return programs.filter((program) => {
      // Program name filter
      if (filters.programNames.length > 0 && !filters.programNames.includes(program.project)) {
        return false;
      }

      // Sub-programs filter
      if (filters.subPrograms.length > 0 && !filters.subPrograms.includes(program.subPrograms)) {
        return false;
      }

      // Sub-products filter
      if (filters.subProducts.length > 0 && !filters.subProducts.includes(program.subProducts)) {
        return false;
      }

      // Sub-projects filter
      if (filters.subProjects.length > 0 && !filters.subProjects.includes(program.subProjects)) {
        return false;
      }

      // Member name filter
      if (filters.memberNames.length > 0) {
        const programMemberNames = program.members.map(m => m.name);
        const hasMatchingMember = filters.memberNames.some(filterName => 
          programMemberNames.includes(filterName)
        );
        if (!hasMatchingMember) return false;
      }

      // Member email filter (using mock emails)
      if (filters.memberEmails.length > 0) {
        const programMemberEmails = program.members.map(m => `${m.name}@company.com`);
        const hasMatchingEmail = filters.memberEmails.some(filterEmail => 
          programMemberEmails.includes(filterEmail)
        );
        if (!hasMatchingEmail) return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(program.status)) {
        return false;
      }

      // Domain filter
      if (filters.domains.length > 0) {
        const hasMatchingDomain = filters.domains.some(filterDomain => 
          program.domain.includes(filterDomain)
        );
        if (!hasMatchingDomain) return false;
      }

      // Progress filter (min/max)
      if (program.progress < filters.minProgress || program.progress > filters.maxProgress) {
        return false;
      }

      // Budget filter (convert budget strings to numbers for comparison)
      const programBudget = parseFloat(program.budget.replace(/[$,]/g, ''));
      if (programBudget < filters.minBudget || programBudget > filters.maxBudget) {
        return false;
      }

      // Date filters
      if (filters.estimatedStartDate && program.estimatedStartDate !== filters.estimatedStartDate) {
        return false;
      }
      if (filters.startDate && program.startDate !== filters.startDate) {
        return false;
      }
      if (filters.endDate && program.endDate !== filters.endDate) {
        return false;
      }
      if (filters.estimatedEndDate && program.estimatedEndDate !== filters.estimatedEndDate) {
        return false;
      }

      return true;
    });
  }, [filters]);

  useEffect(() => {
    const activeStatuses = ["In Progress", "Suspended", "Not Started"];
    const archiveStatuses = ["Cancelled", "Finished"];

    // First filter by active/archive status
    const statusFilteredData = activeTab === "active"
      ? allPrograms.filter((program) => activeStatuses.includes(program.status))
      : allPrograms.filter((program) => archiveStatuses.includes(program.status));

    // Then apply additional filters
    const finalFilteredData = applyFilters(statusFilteredData);

    setData(finalFilteredData);
  }, [allPrograms, activeTab, applyFilters]);

  const handleCreateProgram = () => {
    navigate("/dashboard/programs/create");
  };

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

  const handleRemoveFilter = (type: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [type]: Array.isArray(prev[type as keyof ProgramFilters]) 
        ? (prev[type as keyof ProgramFilters] as string[]).filter(v => v !== value)
        : ''
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      programNames: [],
      memberNames: [],
      memberEmails: [],
      statuses: [],
      domains: [],
      subPrograms: [],
      subProducts: [],
      subProjects: [],
      minProgress: 0,
      maxProgress: 100,
      minBudget: 0,
      maxBudget: 100000,
      estimatedStartDate: '',
      startDate: '',
      endDate: '',
      estimatedEndDate: '',
      estimatedDuration: '',
      actualDuration: ''
    });
  };

  const stickyConfig = {
    id: 'left-0',
    project: 'left-20',
    actions: 'right-0',
  };

  return (
    <div className="min-h-screen pr-5">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          </div>
          
        </div>
      <div className="flex flex-col gap-8">
        {/* Portfolio Navigation Tabs */}
        <PortfolioTabs currentPage="programs" />

    {/* Programs Overview Section */}
<div className="bg-white rounded-lg shadow-sm">
  <div className="px-6 py-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900">Programs Overview</h2>
  </div>
  <div className="p-6">
    <div className={`flex ${tab === "active" ? "justify-between" : "gap-8"}`}>
    {tab === "active" ? (
       <>
       <div className="flex items-center space-x-3">
         <img
           src="/icons/NotStarted.png"
           alt="Not Started"
           className="w-10 h-10 flex-shrink-0"
         />
         <div>
           <div className="text-2xl font-bold text-gray-900">{statusCounts.notStarted}</div>
           <div className="text-sm text-gray-600">Not started</div>
         </div>
       </div>
       <div className="flex items-center space-x-3">
       <img
         src="/icons/InProgress.png"
         alt="In Progress"
         className="w-10 h-10 flex-shrink-0"
         style={{
           filter: "brightness(0) saturate(100%) invert(79%) sepia(65%) saturate(652%) hue-rotate(350deg) brightness(103%) contrast(92%)"
         }}
/>

         <div>
           <div className="text-2xl font-bold text-gray-900">{statusCounts.inProgress}</div>
           <div className="text-sm text-gray-600">In progress</div>
         </div>
       </div>
       <div className="flex items-center space-x-3">
       <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 16 16" className="text-black">
 <path fill="currentColor" d="M5.029 2.217a6.5 6.5 0 0 1 9.437 5.11a.75.75 0 1 0 1.492-.154a8 8 0 0 0-14.315-4.03L.427 1.927A.25.25 0 0 0 0 2.104V5.75A.25.25 0 0 0 .25 6h3.646a.25.25 0 0 0 .177-.427L2.715 4.215a6.5 6.5 0 0 1 2.314-1.998M1.262 8.169a.75.75 0 0 0-1.22.658a8.001 8.001 0 0 0 14.315 4.03l1.216 1.216a.25.25 0 0 0 .427-.177V10.25a.25.25 0 0 0-.25-.25h-3.646a.25.25 0 0 0-.177.427l1.358 1.358a6.501 6.501 0 0 1-11.751-3.11a.75.75 0 0 0-.272-.506"></path>
 <path fill="currentColor" d="M9.06 9.06a1.5 1.5 0 1 1-2.12-2.12a1.5 1.5 0 0 1 2.12 2.12"></path>
</svg>                 
         <div>
           <div className="text-2xl font-bold text-gray-900">2</div>
           <div className="text-sm text-gray-600">Reopened</div>
         </div>
       </div>

       <div className="flex items-center space-x-3">
       <IconPlayerPauseFilled size={40} className="text-[#5477f2] flex-shrink-0" />
         <div>
           <div className="text-2xl font-bold text-gray-900">2</div>
           <div className="text-sm text-gray-600">Suspended</div>
         </div>
       </div>
     </>
    ) : (
          <div className="flex w-full">
            <div className="flex-1 flex justify-center">
              <ArchiveOverviewItem
                icon={<IconCheck className="w-4 h-4 text-green-600" />}
                count={statusCounts.finished}
                label="Completed"
                color="border-green-500"
              />
            </div>
            <div className="flex-1 flex justify-center">
              <ArchiveOverviewItem
                icon={<IconX className="w-4 h-4 text-red-600" />}
                count={statusCounts.cancelled}
                label="Cancelled"
                color="border-red-500"
              />
            </div>
          </div>
    )}
      </div>
  </div>
</div>

        {/* Programs List Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 ml-4">Programs List</h2>
              <div className="flex items-center justify-between relative" ref={filterRef}>
                <div className="flex items-center">
                  <IconFilter2 
                    className="w-6 h-6 cursor-pointer ml-2" 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  />
                </div>
                <div className="ml-4">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateProgram}>
                    <span className="mr-1">+</span> Add new program
                  </Button>
                </div>
                
                {/* Filter Panel */}
                {isFilterOpen && (
                  <ProgramFilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAllFilters}
                    allPrograms={allPrograms}
                  />
                )}
              </div>
            </div>
          </div>
          
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
            <DataTable columns={columns} data={data} stickyConfig={stickyConfig} enableLayoutFixed={true} tableId="programs" />
          </div>
        </div>
      </div>

      {/* Archive Status Modal */}
      <ArchiveStatusModal
        isOpen={archiveModal.isOpen}
        onClose={handleArchiveClose}
        onConfirm={handleArchiveConfirm}
        currentStatus={archiveModal.program?.status || ''}
        itemName={archiveModal.program?.project || ''}
        isArchiving={archiveModal.isArchiving}
      />
    </div>
  );
}