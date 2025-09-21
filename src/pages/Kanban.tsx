import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X, Search, ChevronDown } from 'lucide-react';
import { IconGripHorizontal, IconFilter2, IconEye } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { IconCalendarEvent } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import CompactCalendar from '../components/CompactCalendar';

// Types
interface User {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
}

interface Task {
  id: string;
  title: string;
  tags: string[];
  progress?: number;
  startDate?: string;
  dueDate?: string;
  suspendedDate?: string;
  restartDate?: string;
  assignedTo: User[];
  priority?: 'high' | 'medium' | 'low';
  projectCodes?: string[];
}

interface Column {
  id: string;
  title: string;
  count: number;
  bgColor: string;
  tasks: Task[];
  hidden: boolean;
}

interface Filters {
  statuses: string[];
  domains: string[];
  interns: string[];
  projects: string[];
  startDate: string;
  dueDate: string;
  restartDate: string;
  suspendedDate: string;
  closedDate: string;
  completedDate: string;
}

// Utility functions
const getTagColor = (tag: string): { bgColor: string; textColor: string } => {
  const tagColors: Record<string, { bgColor: string; textColor: string }> = {
    enhancement: { bgColor: '#DCFCE7', textColor: '#166534' },
    backend: { bgColor: '#DBEAFE', textColor: '#1E40AF' },
    bug: { bgColor: '#FEE2E2', textColor: '#991B1B' },
    feature: { bgColor: '#DCFCE7', textColor: '#166534' },
    performance: { bgColor: '#F3E8FF', textColor: '#6B21A8' },
    documentation: { bgColor: '#F3E8FF', textColor: '#6B21A8' },
    integration: { bgColor: '#DBEAFE', textColor: '#1E40AF' },
    blocked: { bgColor: '#FEE2E2', textColor: '#7F1D1D' },
    critical: { bgColor: '#FEE2E2', textColor: '#7F1D1D' },
    development: { bgColor: '#DCFCE7', textColor: '#166534' },
    design: { bgColor: '#FCE7F3', textColor: '#BE185D' },
    payment: { bgColor: '#FED7AA', textColor: '#C2410C' },
    deprecated: { bgColor: '#F3F4F6', textColor: '#374151' },
    devops: { bgColor: '#E0E7FF', textColor: '#4338CA' },
    ux: { bgColor: '#F3E8FF', textColor: '#6B21A8' },
  };
  return tagColors[tag] || { bgColor: '#F3F4F6', textColor: '#374151' };
};

const getAvatarColor = (gender: 'male' | 'female'): string => {
  return gender === 'female' ? 'bg-pink-500' : 'bg-blue-500';
};

const getColumnBackground = (columnId: string): string => {
  const backgrounds: Record<string, string> = {
    todo: '#E3F2FD',
    progress: '#FFF8E1',
    suspended: '#FFE0B2',
    reopened: '#F3E5F5',
    canceled: '#FFEBEE',
    done: '#E8F5E9',
  };
  return backgrounds[columnId] || '#E3F2FD';
};

const getColumnColor = (columnId: string): string => {
  const colors: Record<string, string> = {
    todo: '#64B5F6',
    progress: '#FFD54F',
    suspended: '#FFB74D',
    reopened: '#BA68C8',
    canceled: '#FFEBEE',
    done: '#81C784',
  };
  return colors[columnId] || '#64B5F6';
};

const getDueDateLabel = (columnId: string, dueDate: string): string => {
  const prefixes: Record<string, string> = {
    suspended: '',
    reopened: '',
    canceled: 'Canc.: ',
    done: '',
  };
  return prefixes[columnId] !== undefined ? prefixes[columnId] + dueDate : dueDate;
};

const getSuspendedDateLabel = (suspendedDate: string): string => {
  return 'Susp.: ' + suspendedDate;
};

const getRestartDateLabel = (restartDate: string): string => {
  return 'Restart: ' + restartDate;
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  columnId: string;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnId, onDragStart }) => (
  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-20">{task.title}</h4>
      <div className="flex items-center gap-1 absolute top-2 right-2">
        <div className="flex -space-x-1">
          {task.assignedTo.map((user, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full ${getAvatarColor(user.gender)} flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
              title={`${user.firstName} ${user.lastName}`}
            >
              {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
            </div>
          ))}
        </div>
        <div
          className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center cursor-move transition-colors group ml-1"
          draggable
          onDragStart={(e) => onDragStart(e, task)}
          title="Drag to move task"
        >
          <IconGripHorizontal className="w-6 h-6 stroke-2" />
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-1 mb-3">
      {task.tags.map((tag, index) => {
        const { bgColor, textColor } = getTagColor(tag);
        return (
          <span 
            key={index} 
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {tag}
          </span>
        );
      })}
    </div>

    {task.progress !== undefined && (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          {columnId !== 'todo' && (
            <span className="text-xs text-gray-600">Progress</span>
          )}
          {task.progress > 0 && (
            <span className="text-xs font-medium text-gray-900">{task.progress}%</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-[#A4A8B2] h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
        </div>
      </div>
    )}

    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
      {task.startDate && (
        <div className="flex items-center gap-1">
          <IconCalendarEvent stroke={2} className="w-3 h-3" />
          <span>{task.startDate}</span>
        </div>
      )}
      {task.dueDate && (
        <div className="flex items-center gap-1">
          <IconCalendarEvent stroke={2} className="w-3 h-3 text-gray-900" />
          <span className="text-gray-900">{getDueDateLabel(columnId, task.dueDate)}</span>
        </div>
      )}
    </div>

    {/* Additional suspended date for suspended tasks */}
    {columnId === 'suspended' && task.suspendedDate && (
      <div className="flex items-center justify-end text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <IconCalendarEvent stroke={2} className="w-3 h-3 text-gray-900" />
          <span className="text-gray-900">{getSuspendedDateLabel(task.suspendedDate)}</span>
        </div>
      </div>
    )}

    {/* Additional restart date for reopened tasks */}
    {columnId === 'reopened' && task.restartDate && (
      <div className="flex items-center justify-end text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <IconCalendarEvent stroke={2} className="w-3 h-3 text-gray-900" />
          <span className="text-gray-900">{getRestartDateLabel(task.restartDate)}</span>
        </div>
      </div>
    )}

    <div className="border-t border-gray-200 pt-2 mt-3">
      <div className="text-xs text-gray-600 mb-1">project/product</div>
      <div className="flex gap-1 flex-wrap">
        {task.projectCodes?.map((code, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {code}
          </span>
        )) || (
          <>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">AUTH-SYS</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">USR-MGT</span>
          </>
        )}
      </div>
    </div>
  </div>
);

// Column Component
interface ColumnProps {
  column: Column;
  onTaskDragStart: (e: React.DragEvent, task: Task) => void;
  onTaskDragOver: (e: React.DragEvent) => void;
  onTaskDrop: (e: React.DragEvent, columnId: string) => void;
  onColumnDragStart: (e: React.DragEvent, column: Column) => void;
  onColumnDragOver: (e: React.DragEvent) => void;
  onColumnDrop: (e: React.DragEvent, columnId: string) => void;
  onHideColumn: (columnId: string) => void;
}

const KanbanColumn: React.FC<ColumnProps> = ({
  column,
  onTaskDragStart,
  onTaskDragOver,
  onTaskDrop,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onHideColumn,
}) => {
  if (column.hidden) return null;

  return (
    <div
      className="flex-shrink-0 w-80 rounded-2xl shadow-sm"
      style={{ backgroundColor: getColumnBackground(column.id) }}
      onDragOver={onColumnDragOver}
      onDrop={(e) => onColumnDrop(e, column.id)}
    >
      <div
        className="px-4 py-3 rounded-t-2xl flex items-center justify-between cursor-move hover:bg-black hover:bg-opacity-5 transition-colors border-b border-gray-300"
        draggable
        onDragStart={(e) => onColumnDragStart(e, column)}
        title="Drag to reorder columns"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 select-none">{column.title}</h3>
          <span 
            className="text-white px-2 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: getColumnColor(column.id) }}
          >
            {column.count}
          </span>
        </div>
        <IconEye stroke={2} className="text-gray-600 cursor-pointer" onClick={() => onHideColumn(column.id)} />
      </div>
      <div className="p-3 space-y-3 rounded-b-2xl min-h-96" onDragOver={onTaskDragOver} onDrop={(e) => onTaskDrop(e, column.id)}>
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={column.id} onDragStart={onTaskDragStart} />
        ))}
        <div className="flex justify-center pt-4">
          <button
            className="w-12 h-12 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-200 transition-colors group"
            title="Add new task"
            onClick={() => console.log(`Add task to ${column.id}`)}
          >
            <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
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
    { id: 'todo', label: 'Todo' },
    { id: 'progress', label: 'In Progress' },
    { id: 'suspended', label: 'Suspended' },
    { id: 'canceled', label: 'Cancelled' },
    { id: 'reopened', label: 'Reopened' },
    { id: 'done', label: 'Done' }
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
const ActiveFilters: React.FC<{ filters: Filters, onRemoveFilter: (type: string, value: string) => void, onClearAll: () => void }> = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFiltersCount = 
    filters.statuses.length + 
    filters.domains.length + 
    filters.interns.length + 
    filters.projects.length +
    (filters.startDate ? 1 : 0) +
    (filters.dueDate ? 1 : 0);

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
        {filters.interns.map(intern => (
          <div key={intern} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Intern: {intern}
            <button onClick={() => onRemoveFilter('interns', intern)} className="hover:bg-blue-200 rounded">
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
        {filters.startDate && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Start Date: {filters.startDate}
            <button onClick={() => onRemoveFilter('startDate', filters.startDate)} className="hover:bg-blue-200 rounded">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {filters.dueDate && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            Due Date: {filters.dueDate}
            <button onClick={() => onRemoveFilter('dueDate', filters.dueDate)} className="hover:bg-blue-200 rounded">
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

// Main Kanban Component
const Kanban: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<Filters>({
    statuses: ['todo', 'progress', 'suspended', 'reopened', 'canceled', 'done'],
    domains: [],
    interns: [],
    projects: [],
    startDate: '',
    dueDate: '',
    restartDate: '',
    suspendedDate: '',
    closedDate: '',
    completedDate: '',
  });

  // Load data from JSON file instead of using static data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/kanbanData.json');
        const data = await response.json();
        setColumns(data.map((col: Column) => ({ ...col, hidden: false })));
      } catch (error) {
        console.error('Error loading data:', error);
        setColumns([]);
      }
    };
    loadData();
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

  // Apply filters and update visibility
  useEffect(() => {
    const applyFilters = (columns: Column[]): Column[] => {
      return columns.map(column => {
        const isVisible = filters.statuses.includes(column.id);
        let filteredTasks = column.tasks;

        // Apply filters only to visible columns
        if (isVisible) {
          // Domain filter (using tags as domains)
          if (filters.domains.length > 0) {
            filteredTasks = filteredTasks.filter(task =>
              task.tags.some(tag => filters.domains.includes(tag))
            );
          }

          // Interns filter
          if (filters.interns.length > 0) {
            filteredTasks = filteredTasks.filter(task =>
              task.assignedTo.some(user => 
                filters.interns.includes(`${user.firstName} ${user.lastName}`)
              )
            );
          }

          // Projects filter
          if (filters.projects.length > 0) {
            filteredTasks = filteredTasks.filter(task =>
              task.projectCodes?.some(code => filters.projects.includes(code)) || false
            );
          }

          // Date filters
          if (filters.startDate) {
            filteredTasks = filteredTasks.filter(task => task.startDate === filters.startDate);
          }
          if (filters.dueDate) {
            filteredTasks = filteredTasks.filter(task => task.dueDate === filters.dueDate);
          }
        }

        return {
          ...column,
          tasks: filteredTasks,
          count: filteredTasks.length,
          hidden: !isVisible
        };
      });
    };
    const updatedColumns = applyFilters([...columns]); // Create a new array to avoid mutating state directly
    setColumns(updatedColumns);
  }, [filters.statuses, filters.domains, filters.interns, filters.projects, filters.startDate, filters.dueDate]);

  const handleRemoveFilter = (type: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type as keyof Filters] as string[]).filter(v => v !== value) || ''
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      statuses: ['todo', 'progress', 'suspended', 'reopened', 'canceled', 'done'],
      domains: [],
      interns: [],
      projects: [],
      startDate: '',
      dueDate: '',
      restartDate: '',
      suspendedDate: '',
      closedDate: '',
      completedDate: '',
    });
  };

  const handleHideColumn = (columnId: string) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.filter(id => id !== columnId)
    }));
  };

  // Task Drag and Drop functions
  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    setDraggedColumn(null);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'task');
  };

  const handleTaskDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('text/plain')) {
      const dragType = e.dataTransfer.getData('text/plain') || 'task';
      if (dragType === 'task') {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
    }
  };

  const handleTaskDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragType = e.dataTransfer.getData('text/plain');
    if (dragType !== 'task' || !draggedTask) return;

    const sourceColumnId = columns.find(col => 
      col.tasks.some(task => task.id === draggedTask.id)
    )?.id;

    if (sourceColumnId === targetColumnId) return;

    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== draggedTask.id),
            count: column.count - 1
          };
        } else if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, draggedTask],
            count: column.count + 1
          };
        }
        return column;
      });
    });

    setDraggedTask(null);
  };

  // Column Drag and Drop functions
  const handleColumnDragStart = (e: React.DragEvent, column: Column) => {
    setDraggedColumn(column);
    setDraggedTask(null);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'column');
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('text/plain')) {
      const dragType = e.dataTransfer.getData('text/plain') || 'column';
      if (dragType === 'column') {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragType = e.dataTransfer.getData('text/plain');
    if (dragType !== 'column' || !draggedColumn || draggedColumn.id === targetColumnId) return;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const draggedIndex = newColumns.findIndex(col => col.id === draggedColumn.id);
      const targetIndex = newColumns.findIndex(col => col.id === targetColumnId);
      
      const [draggedCol] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, draggedCol);
      
      return newColumns;
    });

    setDraggedColumn(null);
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

  return (
    <div className="min-h-screen bg-[#d6e4ff] p-6 rounded-2xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-white"
          >
            <IconFilter2 stroke={2} />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg py-4 z-50 max-h-96 overflow-y-auto">
              <div className="px-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                <ActiveFilters
                  filters={filters}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAllFilters}
                />
              </div>

              <div className="px-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <StatusFilter
                    selected={filters.statuses}
                    onChange={(statuses) => setFilters(prev => ({ ...prev, statuses }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                  <Dropdown
                    options={['Entertainment', 'Finance', 'Education', 'Healthcare', 'Web Development', 'Mobile Development']}
                    selected={filters.domains}
                    onChange={(domains) => setFilters(prev => ({ ...prev, domains }))}
                    placeholder="Select and search domains..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interns</label>
                  <Dropdown
                    options={['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Sarah Ben Ali']}
                    selected={filters.interns}
                    onChange={(interns) => setFilters(prev => ({ ...prev, interns }))}
                    placeholder="Select and search interns..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <Dropdown
                    options={['Project Title 1', 'Project Title 2', 'Project Title 3', 'Project Title 4', 'Project Title 5']}
                    selected={filters.projects}
                    onChange={(projects) => setFilters(prev => ({ ...prev, projects }))}
                    placeholder="Select and search projects..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Ranges</label>
                  <div className="space-y-2">
                    <DatePicker
                      label="Start Date"
                      value={filters.startDate}
                      onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                      onClear={() => setFilters(prev => ({ ...prev, startDate: '' }))}
                    />
                    <DatePicker
                      label="Due Date"
                      value={filters.dueDate}
                      onChange={(date) => setFilters(prev => ({ ...prev, dueDate: date }))}
                      onClear={() => setFilters(prev => ({ ...prev, dueDate: '' }))}
                    />
                    <DatePicker
                      label="Restart Date"
                      value={filters.restartDate}
                      onChange={(date) => setFilters(prev => ({ ...prev, restartDate: date }))}
                      onClear={() => setFilters(prev => ({ ...prev, restartDate: '' }))}
                    />
                    <DatePicker
                      label="Suspended Date"
                      value={filters.suspendedDate}
                      onChange={(date) => setFilters(prev => ({ ...prev, suspendedDate: date }))}
                      onClear={() => setFilters(prev => ({ ...prev, suspendedDate: '' }))}
                    />
                    <DatePicker
                      label="Closed Date"
                      value={filters.closedDate}
                      onChange={(date) => setFilters(prev => ({ ...prev, closedDate: date }))}
                      onClear={() => setFilters(prev => ({ ...prev, closedDate: '' }))}
                    />
                    <DatePicker
                      label="Completed Date"
                      value={filters.completedDate}
                      onChange={(date) => setFilters(prev => ({ ...prev, completedDate: date }))}
                      onClear={() => setFilters(prev => ({ ...prev, completedDate: '' }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onTaskDragStart={handleTaskDragStart}
            onTaskDragOver={handleTaskDragOver}
            onTaskDrop={handleTaskDrop}
            onColumnDragStart={handleColumnDragStart}
            onColumnDragOver={handleColumnDragOver}
            onColumnDrop={handleColumnDrop}
            onHideColumn={handleHideColumn}
          />
        ))}
      </div>
    </div>
  );
};

export default Kanban;