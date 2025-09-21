import { useState, useEffect, useRef, useCallback, forwardRef, useMemo } from 'react';
import { IconEye, IconTrash, IconPlayerPause } from '@tabler/icons-react';
import { ArrowLeft, Edit3, X, Search, ChevronDown } from 'lucide-react';

import { IconUsersGroup } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { IconFilter2 } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from "../components/views/candidates/dataTable";
import { ColumnDef } from "@tanstack/react-table";

interface Member {
  initials: string;
  gender: 'male' | 'female';
}

interface Topic {
  id: string;
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
  domain: string;
}

interface Project {
  id: string;
  project: string;
  members: { name: string; gender: string }[];
  progress: number;
  status: string;
  estimatedStartDate: string;
  startDate: string;
  endDate: string;
  estimatedEndDate: string;
  estimatedDuration: string;
  actualDuration: string;
  estimatedBudget: string;
  budget: string;
  description: string;
  domain: string[];
  technology: string[];
}

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
  const memberNames = [...new Set(allMembers.map(m => m.name))];
  const memberEmails = [...new Set(allMembers.map(m => m.email))];
  const memberDomains = [...new Set(allMembers.map(m => m.role))]; // Using role as domain

  const onRemoveFilter = (type: string, value: string) => {
    const newFilters = { ...filters };
    switch (type) {
      case 'names':
        newFilters.names = newFilters.names.filter(v => v !== value);
        break;
      case 'emails':
        newFilters.emails = newFilters.emails.filter(v => v !== value);
        break;
      case 'domains':
        newFilters.domains = newFilters.domains.filter(v => v !== value);
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
            onChange={(values) => setFilters({ ...filters, names: values })}
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
            onChange={(values) => setFilters({ ...filters, emails: values })}
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
            onChange={(values) => setFilters({ ...filters, domains: values })}
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

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tab, setTab] = useState<'active' | 'archive'>('active');
  
  // Team filter state
  const [isTeamFilterOpen, setIsTeamFilterOpen] = useState(false);
  const [filteredTeamMembers, setFilteredTeamMembers] = useState<TeamMember[]>([]);
  const teamFilterRef = useRef<HTMLDivElement>(null);
  const [teamFilters, setTeamFilters] = useState<TeamMemberFilters>({
    names: [],
    emails: [],
    domains: []
  });

  const handleViewDetails = (topicId: string) => {
    console.log("View details for:", topicId);
  };

  const handleArchiveToggle = (topicId: string, isActive: boolean) => {
    setTopics((prevTopics: Topic[]) =>
      prevTopics.map((t: Topic) =>
        t.id === topicId
          ? { ...t, status: isActive ? 'Completed' : 'In Progress' }
          : t
      )
    );
  };

  const handleDelete = (topicId: string) => {
    setTopics((prevTopics: Topic[]) => prevTopics.filter((t: Topic) => t.id !== topicId));
  };

  const columns: ColumnDef<Topic>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-16">ID</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-900">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "project",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-40">Project</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-900 w-40">{row.getValue("project")}</div>,
    },
    {
      accessorKey: "members",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Members</div>,
      cell: ({ row }) => {
        const members: Member[] = row.getValue("members");
        return (
          <div className="flex -space-x-1">
            {members.map((member) => (
              <div
                key={member.initials}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white ${getAvatarColor(member.gender)}`}
              >
                {member.initials}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Status</div>,
      cell: ({ row }) => {
        const status: string = row.getValue("status");
        return (
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "progress",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Progress</div>,
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number;
        return (
          <div className="flex items-center">
            <span className="text-sm font-medium mr-3 text-[#5477F2]">
              {progress}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "estimatedStartDate",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-32">E.Start Date</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700 w-32">{row.getValue("estimatedStartDate")}</div>,
    },
    {
      accessorKey: "startDate",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-32">Start Date</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700 w-32">{row.getValue("startDate")}</div>,
    },
    {
      accessorKey: "endDate",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-32">End Date</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700 w-32">{row.getValue("endDate")}</div>,
    },
    {
      accessorKey: "estimatedEndDate",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-32">E.End Date</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700 w-32">{row.getValue("estimatedEndDate")}</div>,
    },
    {
      accessorKey: "estimatedDuration",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-32">E.Duration</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700 w-32">{row.getValue("estimatedDuration")}</div>,
    },
      {
      accessorKey: "actualDuration",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider w-32">A.Duration</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700 w-32">{row.getValue("actualDuration")}</div>,
    },
    {
      accessorKey: "estimatedBudget",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">E.Budget</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700">{row.getValue("estimatedBudget")}</div>,
    },
    {
      accessorKey: "budget",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Budget</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700">{row.getValue("budget")}</div>,
    },
    {
      accessorKey: "domain",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Domain</div>,
      cell: ({ row }) => <div className="text-sm font-bold text-gray-700">{row.getValue("domain")}</div>,
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Action</div>,
      id: "actions",
      cell: ({ row }) => {
        const topic = row.original;
        const isActive = topic.status !== 'Completed';

        return (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(topic.id)} title="View Details" aria-label="View Details" className="h-8 w-8">
              <IconEye stroke={2} className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleArchiveToggle(topic.id, isActive)}
              title={isActive ? "Archive Topic" : "Unarchive Topic"}
              aria-label={isActive ? "Archive Topic" : "Unarchive Topic"}
              className="h-8 w-8"
            >
              {isActive ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 18l4-4l-1.4-1.4l-1.6 1.6V10h-2v4.2l-1.6-1.6L8 14zm-7 3q-.825 0-1.412-.587T3 19V6.525q0-.35.113-.675t.337-.6L4.7 3.725q.275-.35.687-.538T6.25 3h11.5q.45 0 .863.188t.687.537l1.25 1.525q.225.275.338.6t.112.675V19q0 .825-.587 1.413T19 21zm.4-15h13.2l-.85-1H6.25z"/></svg>
              ) : (
<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
	<path fill="currentColor" d="m21.706 5.292l-2.999-2.999A1 1 0 0 0 18 2H6a1 1 0 0 0-.707.293L2.294 5.292A1 1 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a1 1 0 0 0-.294-.708M6.414 4h11.172l1 1H5.414zM14 14v3h-4v-3H7l5-5l5 5z"></path>
</svg>              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)} title="Delete Topic" aria-label="Delete Topic" className="h-8 w-8">
              <IconTrash stroke={2} className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!id) {
      navigate('/dashboard/projects');
      return;
    }

    const fetchProjectData = async () => {
      try {
        const response = await fetch('/data/ProjectDetail.json');
        const projects = await response.json();
        const currentProject = projects.find((p: Project) => p.id.toString() === id);
        if (currentProject) {
          setProject(currentProject);
        } else {
          navigate('/dashboard/projects');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setLoading(false);
      }
    };

    const mockTopics: Topic[] = [
      {
        id: "T-01",
        project: "ERP Frontend",
        members: [
          { initials: "AM", gender: "male" },
          { initials: "BW", gender: "female" }
        ],
        status: "In Progress",
        progress: 75,
        estimatedStartDate: "07 Nov, 2023",
        startDate: "07 Nov, 2023",
        endDate: "-",
        estimatedEndDate: "07 Dec, 2023",
        estimatedDuration: "1 month",
        actualDuration: "-",
        estimatedBudget: "$15,000",
        budget: "$12,500",
        domain: "Web"
      },
      {
        id: "T-03",
        project: "ERP Backend",
        members: [
          { initials: "IJ", gender: "female" }
        ],
        status: "Not Started",
        progress: 0,
        estimatedStartDate: "01 Dec, 2023",
        startDate: "-",
        endDate: "-",
        estimatedEndDate: "20 Dec, 2023",
        estimatedDuration: "20 days",
        actualDuration: "-",
        estimatedBudget: "$18,000",
        budget: "",
        domain: "API"
      },
      {
        id: "T-04",
        project: "Database Migration",
        members: [
          { initials: "KL", gender: "male" },
          { initials: "MN", gender: "female" }
        ],
        status: "In Progress",
        progress: 45,
        estimatedStartDate: "20 Nov, 2023",
        startDate: "20 Nov, 2023",
        endDate: "-",
        estimatedEndDate: "10 Jan, 2024",
        estimatedDuration: "1.5 months",
        actualDuration: "-",
        estimatedBudget: "$30,000",
        budget: "$28,500",
        domain: "Database"
      },
      {
        id: "T-05",
        project: "Mobile App",
        members: [
          { initials: "OP", gender: "male" }
        ],
        status: "Suspended",
        progress: 20,
        estimatedStartDate: "10 Nov, 2023",
        startDate: "10 Nov, 2023",
        endDate: "-",
        estimatedEndDate: "30 Nov, 2023",
        estimatedDuration: "20 days",
        actualDuration: "-",
        estimatedBudget: "$12,000",
        budget: "$8,000",
        domain: "Mobile"
      },
      {
        id: "T-06",
        project: "Performance Tuning",
        members: [
          { initials: "QR", gender: "female" },
          { initials: "ST", gender: "male" }
        ],
        status: "Cancelled",
        progress: 30,
        estimatedStartDate: "05 Nov, 2023",
        startDate: "05 Nov, 2023",
        endDate: "12 Nov, 2023",
        estimatedEndDate: "20 Nov, 2023",
        estimatedDuration: "15 days",
        actualDuration: "7 days",
        estimatedBudget: "$20,000",
        budget: "$6,000",
        domain: "Performance"
      }
    ];

    fetchProjectData();
    setTopics(mockTopics);
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
  }, [teamFilters]);

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
  const handleCreateProject = () => {
    console.log('Navigating with project data:', project);
    navigate('/dashboard/projects/create', { state: { projectData: project } });
  };

  const handleCreateTopic = () => {
    console.log('Navigating with project data:', project);
    navigate('/dashboard/topics/create', { state: { projectData: project } });
  };


  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className=" px-6 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ArrowLeft className="w-5 h-5 font-bold text-[#2D3748]" />
                    <h1 className="text-xl font-bold text-[#2D3748]">Project Details</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6">
          
            
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="overflow-x-auto project-detail-scroll">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2D3748]">Project Overview</h2>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              In Progress
            </button>
          </div>
              <div className="flex space-x-8 min-w-max pb-2">
                {/* Topics */}
                <div className="flex items-center space-x-3 min-w-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 512 512" className="text-[#718096] flex-shrink-0">
                    <path fill="currentColor" d="M136 24H16v120h120Zm-32 88H48V56h56Zm32 88H16v120h120Zm-32 88H48v-56h56Zm32 88H16v120h120Zm-32 88H48v-56h56Zm32 88H16v120h120Zm-32 88H48v-56h56Zm72-440.002h320v32H176zm0 88h256v32H176zm0 88h320v32H176zm0 88h256v32H176zm0 176h256v32H176zm0-88h320v32H176z"></path>
                  </svg>
                  <div className="text-sm">
                    <div className="text-2xl font-bold text-gray-900">5</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Topics</div>
                  </div>
                </div>
        
                {/* Not Started */}
                <div className="flex items-center space-x-3 min-w-0">
                <svg xmlns="http://www.w3.org/2000/svg" width={54} height={54} viewBox="0 0 24 24" className="text-[#718096]">
	<path fill="currentColor" d="M8 16h2V8H8zm4 0l6-4l-6-4zm0 6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"></path>
</svg>                  <div>
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Not Started</div>
                  </div>
                </div>
        
                {/* Topics In Progress */}
                <div className="flex items-center space-x-3 min-w-0">
                <img
                  src="/icons/InProgress.png"
                  alt="In Progress"
                  className="w-10 h-10 flex-shrink-0"
                />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Topics In progress</div>
                  </div>
                </div>
        
                {/* Reopened */}
                <div className="flex items-center space-x-3 min-w-0">
                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 16 16" className="text-[#718096]">
	<path fill="currentColor" d="M5.029 2.217a6.5 6.5 0 0 1 9.437 5.11a.75.75 0 1 0 1.492-.154a8 8 0 0 0-14.315-4.03L.427 1.927A.25.25 0 0 0 0 2.104V5.75A.25.25 0 0 0 .25 6h3.646a.25.25 0 0 0 .177-.427L2.715 4.215a6.5 6.5 0 0 1 2.314-1.998M1.262 8.169a.75.75 0 0 0-1.22.658a8.001 8.001 0 0 0 14.315 4.03l1.216 1.216a.25.25 0 0 0 .427-.177V10.25a.25.25 0 0 0-.25-.25h-3.646a.25.25 0 0 0-.177.427l1.358 1.358a6.501 6.501 0 0 1-11.751-3.11a.75.75 0 0 0-.272-.506"></path>
	<path fill="currentColor" d="M9.06 9.06a1.5 1.5 0 1 1-2.12-2.12a1.5 1.5 0 0 1 2.12 2.12"></path>
</svg>                 
 <div>
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Reopened</div>
                  </div>
                </div>
        
                {/* Suspended Topics */}
                <div className="flex items-center space-x-3 min-w-0">
                  <IconPlayerPause stroke={2} size={40} className="text-[#718096] flex-shrink-0" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Suspended Topics</div>
                  </div>
                </div>
        
                {/* Completed Topics */}
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src="/icons/CompletedTopics.png"
                    alt="In Progress"
                    className="w-10 h-10 flex-shrink-0"
                  />                  <div>
                      <div className="text-2xl font-bold text-gray-900">2</div>
                      <div className="text-sm text-gray-600 whitespace-nowrap">Completed Topics</div>
                        </div>
                </div>
        
                {/* Total Team Size */}
                <div className="flex items-center space-x-3 min-w-0">
                  <IconUsersGroup stroke={2} size={40} className="text-[#718096] flex-shrink-0" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">Total Team Size</div>
                  </div>
                </div>
        
                {/* Duration Info */}
                <div className="flex items-center space-x-3 min-w-0">
                  <IconClock stroke={2} size={40} className="text-[#718096] flex-shrink-0" />
                  <div className="min-w-max">
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Effective Duration :</span> 1 months
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Remaining Duration :</span> 5 months
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {/* About Project */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">About Project</h2>
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

              {/* Domain */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-800 mb-3">Domain</h3>
                <div className="flex flex-wrap gap-2">
                  {project?.domain?.map((d) => (
                    <span key={d} className="px-3 py-1 bg-[#4A74E0] text-white text-sm font-medium rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technology */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-800 mb-3">Technology</h3>
                <div className="flex flex-wrap gap-2">
                  {project?.technology?.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-[#4A74E0] text-white text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
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
            {/* Topics List */}
            <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Topics List</h2>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <IconFilter2 className="w-6 h-6" />
                  </button>
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

              <div className="max-h-[400px] overflow-y-auto">
                <DataTable columns={columns} data={topics.filter(topic => {
                  const isArchived = topic.status === 'Completed' || topic.status === 'Cancelled';
                  return tab === 'active' ? !isArchived : isArchived;
                })} tableId="topics" />
              </div>
            </div>
            </div>

            {/* Team Project Sidebar */}
            <div className="col-span-1">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={handleCreateTopic} 
                  className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-medium py-2 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={loading || !project}
                >
                  + Create Topic
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Project Team</h2>
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

export default ProjectDetail;