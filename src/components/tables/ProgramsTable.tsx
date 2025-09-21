import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../views/candidates/dataTable";
import { Button } from "@/components/ui/button";
import { IconEye, IconTrash, IconPlayerPauseFilled, IconFilter2, IconCheck, IconX } from '@tabler/icons-react';
import { Calendar, X, Search, ChevronDown } from 'lucide-react';

// Define the Program interface
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

interface ProgramsTableProps {
  showHeader?: boolean;
  showFilters?: boolean;
  showTabs?: boolean;
  showCreateButton?: boolean;
  maxHeight?: string;
  className?: string;
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

export default function ProgramsTable({ 
  showHeader = true, 
  showFilters = true, 
  showTabs = true, 
  showCreateButton = true,
  maxHeight,
  className = ""
}: ProgramsTableProps) {
  const [data, setData] = useState<Program[]>([]);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
  const filterRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
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

  // Define the columns
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
        <div className="text-gray-500 text-xs font-medium tracking-wider">Sub Programs</div>
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
        <div className="text-gray-500 text-xs font-medium tracking-wider">Sub Products</div>
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
        <div className="text-gray-500 text-xs font-medium tracking-wider">Sub Projects</div>
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
        <div className="text-sm font-bold text-gray-900">{row.getValue("budget")}</div>
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
          const newStatus = isCurrentlyActive ? "Cancelled" : "In Progress";
          
          setAllPrograms((prev) =>
            prev.map((p) =>
              p.id === program.id ? { ...p, status: newStatus } : p
            )
          );
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
      if (filters.programNames.length > 0 && !filters.programNames.includes(program.project)) {
        return false;
      }
      if (filters.memberNames.length > 0) {
        const programMemberNames = program.members.map(m => m.name);
        const hasMatchingMember = filters.memberNames.some(filterName => 
          programMemberNames.includes(filterName)
        );
        if (!hasMatchingMember) return false;
      }
      if (filters.statuses.length > 0 && !filters.statuses.includes(program.status)) {
        return false;
      }
      if (filters.domains.length > 0) {
        const hasMatchingDomain = filters.domains.some(filterDomain => 
          program.domain.includes(filterDomain)
        );
        if (!hasMatchingDomain) return false;
      }
      if (program.progress < filters.minProgress || program.progress > filters.maxProgress) {
        return false;
      }
      return true;
    });
  }, [filters]);

  useEffect(() => {
    const activeStatuses = ["In Progress", "Suspended", "Not Started"];
    const archiveStatuses = ["Cancelled", "Finished"];

    const statusFilteredData = activeTab === "active"
      ? allPrograms.filter((program) => activeStatuses.includes(program.status))
      : allPrograms.filter((program) => archiveStatuses.includes(program.status));

    const finalFilteredData = applyFilters(statusFilteredData);
    setData(finalFilteredData);
  }, [allPrograms, activeTab, applyFilters]);

  const handleCreateProgram = () => {
    navigate("/dashboard/programs/create");
  };

  const stickyConfig = {
    id: 'left-0',
    project: 'left-20',
    actions: 'right-0',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 ml-4">Programs List</h2>
            <div className="flex items-center justify-between relative" ref={filterRef}>
              {showFilters && (
                <div className="flex items-center">
                  <IconFilter2 
                    className="w-6 h-6 cursor-pointer ml-2" 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  />
                </div>
              )}
              {showCreateButton && (
                <div className="ml-4">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateProgram}>
                    <span className="mr-1">+</span> Add new program
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6" style={maxHeight ? { maxHeight, overflowY: 'auto' } : {}}>
        {showTabs && (
          <>
            <div className="flex mb-1">
              <div className="w-1/2 text-center">
                <span className={`font-semibold ${activeTab === 'active' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Active
                </span>
              </div>
              <div className="w-1/2 text-center">
                <span className={`font-semibold ${activeTab === 'archive' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Archive
                </span>
              </div>
            </div>

            <div className="flex w-full h-2 cursor-pointer mb-6">
              <div
                className={`w-1/2 h-full transition-all duration-200 ${activeTab === 'active' ? 'bg-blue-500' : 'bg-gray-100 hover:bg-gray-200 hover:scale-y-150'}`}
                onClick={() => setActiveTab('active')}
              ></div>
              <div
                className={`w-1/2 h-full transition-all duration-200 ${activeTab === 'archive' ? 'bg-blue-500' : 'bg-gray-100 hover:bg-gray-200 hover:scale-y-150'}`}
                onClick={() => setActiveTab('archive')}
              ></div>
            </div>
          </>
        )}

        <DataTable columns={columns} data={data} stickyConfig={stickyConfig} enableLayoutFixed={true} tableId="programs" />
      </div>
    </div>
  );
}
