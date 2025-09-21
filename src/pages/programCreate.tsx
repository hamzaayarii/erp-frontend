import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Calendar, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { DomainModal } from '../components/DomainModal';
import { IconTrash, IconEye } from '@tabler/icons-react';
import { useNavigate, useLocation } from "react-router-dom";

// Types for strong typing of dynamic fields
type MultiSelectField =
  | 'domain'
  | 'critProject'
  | 'auxProject'
  | 'critProduct'
  | 'auxProduct'
  | 'critProgram'
  | 'auxProgram'
  | 'linkedProgram'
  | 'linkedProduct'
  | 'linkedProject';


type FormDataState = {
  title: string;
  domain: string[];
  estimatedBudget: string;
  currency: string;
  priority: string;
  industry: string;
  duration: string;
  durationUnit: 'Days' | 'Weeks' | 'Months' | 'Years' | string;
  estimatedStartDate: string;
  startDate: string;
  estimatedEndDate: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Suspended' | 'Finished' | 'Cancelled' | string;
  critProject: string[];
  auxProject: string[];
  critProduct: string[];
  auxProduct: string[];
  critProgram: string[];
  auxProgram: string[];
  linkedProgram: string[];
  linkedProduct: string[];
  linkedProject: string[];
};

type SearchStatesType = Record<MultiSelectField, string>;
type DropdownOpenType = Record<MultiSelectField, boolean>;
type CalendarField = 'estimatedStartDate' | 'startDate' | 'estimatedEndDate' | null;

function ProgramCreate() {
  const location = useLocation();
  const programData = location.state?.programData;
  console.log('Received program data in ProgramCreate:', programData);
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    domain: [],
    estimatedBudget: '',
    currency: '',
    priority: '',
    industry: '',
    duration: '',
    durationUnit: 'Days',
    estimatedStartDate: '',
    startDate: '',
    estimatedEndDate: '',
    description: '',
    status: '',
    critProject: [],
    auxProject: [],
    critProduct: [],
    auxProduct: [],
    critProgram: [],
    auxProgram: [],
    linkedProgram: [],
    linkedProduct: [],
    linkedProject: []
  });

  const navigate = useNavigate();
  const [durationValue, setDurationValue] = useState(50);

  useEffect(() => {
    if (programData) {
      setFormData(prev => ({
        ...prev,
        title: programData.program || '',
        description: programData.description || '',
        status: programData.status || 'Not Started',
        estimatedBudget: programData.estimatedBudget || '',
        domain: programData.domain || [],
        critProject: programData.critProject || [],
        auxProject: programData.auxProject || [],
        critProduct: programData.critProduct || [],
        auxProduct: programData.auxProduct || [],
        critProgram: programData.critProgram || [],
        auxProgram: programData.auxProgram || [],
        linkedProgram: programData.linkedProgram || [],
        linkedProduct: programData.linkedProduct || [],
        linkedProject: programData.linkedProject || [],
      }));
    }
  }, [programData]);

  // Handle incoming linked items from other create pages
  useEffect(() => {
    const state = location.state;
    if (state?.newLinkedProgram) {
      const newProgram = state.newLinkedProgram;
      setFormData(prev => {
        if (!prev.linkedProgram.includes(newProgram.name)) {
          return {
            ...prev,
            linkedProgram: [...prev.linkedProgram, newProgram.name]
          };
        }
        return prev;
      });
      window.history.replaceState({}, document.title);
    }
    
    if (state?.newLinkedProduct) {
      const newProduct = state.newLinkedProduct;
      setFormData(prev => {
        if (!prev.linkedProduct.includes(newProduct.name)) {
          return {
            ...prev,
            linkedProduct: [...prev.linkedProduct, newProduct.name]
          };
        }
        return prev;
      });
      window.history.replaceState({}, document.title);
    }

    if (state?.newLinkedProject) {
      const newProject = state.newLinkedProject;
      setFormData(prev => {
        if (!prev.linkedProject.includes(newProject.name)) {
          return {
            ...prev,
            linkedProject: [...prev.linkedProject, newProject.name]
          };
        }
        return prev;
      });
      window.history.replaceState({}, document.title);
    }

    if (state?.newLinkedTopic) {
      const newTopic = state.newLinkedTopic;
      // For now, we can log this - topic handling can be implemented when topic fields are added to the form
      console.log('New linked topic created:', newTopic);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [showCalendar, setShowCalendar] = useState<{ field: CalendarField; show: boolean }>({ field: null, show: false });
  const [currentDate, setCurrentDate] = useState(new Date(2022, 0, 1)); // January 2022
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Duration utilities
  const minDuration = 1;
  const maxDuration = 31;
  const percentToDuration = (p: number) => Math.round(minDuration + (p / 100) * (maxDuration - minDuration));
  const durationToPercent = (d: number) => ((Math.min(Math.max(d, minDuration), maxDuration) - minDuration) / (maxDuration - minDuration)) * 100;

  // Search states for checkbox inputs
  const [searchStates, setSearchStates] = useState<SearchStatesType>({
    domain: '',
    critProject: '',
    auxProject: '',
    critProduct: '',
    auxProduct: '',
    critProgram: '',
    auxProgram: '',
    linkedProgram: '',
    linkedProduct: '',
    linkedProject: ''
  });

  // Dropdown states for checkbox inputs
  const [dropdownOpen, setDropdownOpen] = useState<DropdownOpenType>({
    domain: false,
    critProject: false,
    auxProject: false,
    critProduct: false,
    auxProduct: false,
    critProgram: false,
    auxProgram: false,
    linkedProgram: false,
    linkedProduct: false,
    linkedProject: false
  });

  // Options for checkbox inputs
  const domainOptions = ['Web Development', 'Mobile Development', 'Data Science', 'DevOps', 'AI/ML', 'Cybersecurity'];
  const critProjectOptions = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'];
  const auxProjectOptions = ['Project Echo', 'Project Foxtrot', 'Project Golf', 'Project Hotel'];
  const critProductOptions = ['Product Alpha', 'Product Beta', 'Product Gamma', 'Product Delta'];
  const auxProductOptions = ['Product Echo', 'Product Foxtrot', 'Product Golf', 'Product Hotel'];
  const critProgramOptions = ['Program Alpha', 'Program Beta', 'Program Gamma', 'Program Delta'];
  const auxProgramOptions = ['Program Echo', 'Program Foxtrot', 'Program Golf', 'Program Hotel'];
  const industryOptions = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail'];
  const baseProgramOptions = ['Program Alpha', 'Program Beta', 'Program Gamma', 'Program Delta'];
  const baseProductOptions = ['Product X', 'Product Y', 'Product Z', 'Product W'];
  const baseProjectOptions = ['Project Orion', 'Project Nova', 'Project Atlas', 'Project Zenith'];
  
  // Filter out already selected items from dropdown options to prevent duplicates
  const programLinkOptions = baseProgramOptions.filter(option => !formData.linkedProgram.includes(option));
  const productLinkOptions = baseProductOptions.filter(option => !formData.linkedProduct.includes(option));
  const projectLinkOptions = baseProjectOptions.filter(option => !formData.linkedProject.includes(option));

  // Navigation handlers
  const handleCreateAuxProject = () => {
    navigate("/dashboard/projects/create", {
      state: { from: 'program-create' }
    });
  };

  const handleCreateCritProject = () => {
    navigate("/dashboard/projects/create", {
      state: { from: 'program-create' }
    });
  };

  const handleCreateAuxProduct = () => {
    navigate("/dashboard/products/create", {
      state: { from: 'program-create' }
    });
  };

  const handleCreateCritProduct = () => {
    navigate("/dashboard/products/create", {
      state: { from: 'program-create' }
    });
  };

  const handleCreateAuxProgram = () => {
    navigate("/dashboard/programs/create", {
      state: { from: 'program-create' }
    });
  };

  const handleCreateCritProgram = () => {
    navigate("/dashboard/programs/create", {
      state: { from: 'program-create' }
    });
  };

  // Navigation handlers for linked items
  const handleNavigateToProgram = () => {
    navigate('/dashboard/programs/create', {
      state: { from: 'program-create' }
    });
  };

  const handleNavigateToProduct = () => {
    navigate('/dashboard/products/create', {
      state: { from: 'program-create' }
    });
  };

  const handleNavigateToProject = () => {
    navigate('/dashboard/projects/create', {
      state: { from: 'program-create' }
    });
  };

  const handleCancel = () => {
    const state = location.state;
    if (state?.from) {
      switch (state.from) {
        case 'project-create':
          navigate('/dashboard/projects/create');
          break;
        case 'product-create':
          navigate('/dashboard/products/create');
          break;
        case 'topic-create':
          navigate('/dashboard/topics/create');
          break;
        default:
          navigate('/dashboard/programs');
      }
    } else {
      navigate('/dashboard/programs');
    }
  };
  // Handle save and redirect back to source page
  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a program title');
      return;
    }

    // Create the new program data
    const newProgramData = {
      name: formData.title,
      type: 'program' as const,
      ...formData
    };

    // Navigate back to the source page if it exists, otherwise go to programs list
    const state = location.state;
    if (state?.from) {
      switch (state.from) {
        case 'project-create':
          navigate('/dashboard/projects/create', {
            state: { newLinkedProgram: newProgramData }
          });
          break;
        case 'product-create':
          navigate('/dashboard/products/create', {
            state: { newLinkedProgram: newProgramData }
          });
          break;
        case 'topic-create':
          navigate('/dashboard/topics/create', {
            state: { newLinkedProgram: newProgramData }
          });
          break;
        default:
          navigate('/dashboard/programs');
      }
    } else {
      navigate('/dashboard/programs');
    }
  };

  // Modal states
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);

  const handleInputChange = <K extends keyof FormDataState>(field: K, value: FormDataState[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear date for a specific field and close calendar if it's open for that field
  const handleClearDate = (field: Exclude<CalendarField, null>) => {
    handleInputChange(field, '' as FormDataState[typeof field]);
    if (showCalendar.field === field) {
      setShowCalendar({ field: null, show: false });
    }
  };

  // Checkbox toggle handler
  const handleArrayToggle = (field: MultiSelectField, value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: next } as FormDataState;
    });
  };

  // Remove item handler
  const handleRemoveItem = (field: MultiSelectField, value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      return { ...prev, [field]: current.filter(item => item !== value) } as FormDataState;
    });
  };

  // Search change handler
  const handleSearchChange = (field: MultiSelectField, value: string) => {
    setSearchStates(prev => ({ ...prev, [field]: value }));
  };

  // Toggle dropdown
  const toggleDropdown = (field: MultiSelectField) => {
    setDropdownOpen(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Filter options based on search
  const getFilteredOptions = (options: string[], searchTerm: string) => {
    if (!options) {
      return [];
    }
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Render searchable dropdown with checkboxes
  const renderSearchableDropdown = (
    field: MultiSelectField,
    options: string[],
    placeholder: string,
    selectedItems: string[]
  ) => {
    const filteredOptions = getFilteredOptions(options, searchStates[field]);

    return (
      <div className="relative">
        <div className="relative">
          <div className="w-full min-h-[42px] px-3 py-2 pr-10 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 flex flex-wrap items-center gap-2 bg-white">
            {selectedItems.map(item => (
              <span key={item} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded border">
                {item}
                <button
                  onClick={() => handleRemoveItem(field, item)}
                  className="ml-1 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={selectedItems.length === 0 ? placeholder : ''}
              value={searchStates[field]}
              onChange={(e) => handleSearchChange(field, e.target.value)}
              onFocus={() => setDropdownOpen(prev => ({ ...prev, [field]: true }))}
              className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
            />
          </div>
          <button
            onClick={() => toggleDropdown(field)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {dropdownOpen[field] && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = selectedItems.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => handleArrayToggle(field, option)}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleArrayToggle(field, option)}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="flex-1 flex items-center justify-between">
                    <span>{option}</span>
                    {['critProject', 'auxProject', 'critProduct', 'auxProduct', 'critProgram', 'auxProgram', 'linkedProgram', 'linkedProduct', 'linkedProject'].includes(field) && (
                      <IconEye 
                        className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // View functionality can be implemented later if needed
                        }}
                      />
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleDateSelect = (date: Date) => {
    const formatted = formatDate(date);
    if (showCalendar.field) {
      handleInputChange(showCalendar.field, formatted);
    }
    setShowCalendar({ field: null, show: false });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendar = () => {
    if (!showCalendar.show) return null;

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = day === 1;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          className={`w-8 h-8 text-sm rounded-full flex items-center justify-center hover:bg-gray-100 ${isSelected ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <div key={day} className="w-8 h-6 text-xs text-gray-500 flex items-center justify-center font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element)?.closest('.relative')) {
        setDropdownOpen({
          domain: false,
          critProject: false,
          auxProject: false,
          critProduct: false,
          auxProduct: false,
          critProgram: false,
          auxProgram: false,
          linkedProgram: false,
          linkedProduct: false,
          linkedProject: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <ArrowLeft className="w-5 h-5 mr-3" />
            <h1 className="text-xl font-semibold">Create Program</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Create New Program</h2>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Title</label>
                  <input
                    type="text"
                    placeholder="Assign a name to your program"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  />
                </div>

                {/* Estimated Budget */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Estimated Budget</label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Write your estimated budget"
                      value={formData.estimatedBudget}
                      onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                    />
                    <div className="relative">
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className={`appearance-none bg-gray-50 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 pr-8 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${formData.currency ? 'text-gray-900' : 'text-gray-400'}`}
                      >
                        <option value="" disabled>Select currency</option>
                        <option value="Dinar">Dinar</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="USD">USD (Dollar)</option>
                        <option value="GBP">GBP (Pound)</option>
                        <option value="CAD">CAD (Canadian Dollar)</option>
                        <option value="RUB">RUB (Russian Ruble)</option>
                        <option value="CNY">CNY (Chinese Yuan)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Duration</label>
                  <div className="flex items-center mb-3">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <span>1</span>
                        <span>15</span>
                        <span>31</span>
                      </div>
                      <div className="relative">
                        <div className="w-full h-1 bg-gray-200 rounded-full">
                          <div
                            className="h-1 bg-blue-500 rounded-full relative"
                            style={{ width: `${durationValue}%` }}
                          >
                            <div
                              className="absolute right-0 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2 cursor-pointer border-2 border-white shadow-md"
                              onMouseDown={(e: React.MouseEvent) => {
                                const parentEl = e.currentTarget.parentElement?.parentElement;
                                if (!parentEl) return;
                                const rect = parentEl.getBoundingClientRect();
                                const handleMouseMove = (e: MouseEvent) => {
                                  const x = e.clientX - rect.left;
                                  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                                  setDurationValue(percentage);
                                  const newDuration = percentToDuration(percentage);
                                  setFormData(prev => ({ ...prev, duration: String(newDuration) }));
                                };
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Min</span>
                          <span>Mid</span>
                          <span>Max</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Write your duration"
                        value={formData.duration}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw.trim() === '') {
                            handleInputChange('duration', '');
                            return;
                          }
                          const parsed = parseInt(raw, 10);
                          if (!Number.isNaN(parsed)) {
                            const clamped = Math.max(minDuration, Math.min(maxDuration, parsed));
                            handleInputChange('duration', String(clamped));
                            setDurationValue(durationToPercent(clamped));
                          } else {
                            handleInputChange('duration', raw);
                          }
                        }}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                      />
                      <div className="relative">
                        <select
                          value={formData.durationUnit}
                          onChange={(e) => handleInputChange('durationUnit', e.target.value)}
                          className="appearance-none bg-gray-50 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 pr-8 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="Days">Days</option>
                          <option value="Weeks">Weeks</option>
                          <option value="Months">Months</option>
                          <option value="Years">Years</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
                         {/* Date Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Estimated Start Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={formData.estimatedStartDate}
                        onChange={(e) => handleInputChange('estimatedStartDate', e.target.value)}
                        className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                        readOnly
                      />
                      {formData.estimatedStartDate && (
                        <button
                          type="button"
                          onClick={() => handleClearDate('estimatedStartDate')}
                          className="absolute right-9 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                          aria-label="Clear estimated start date"
                          title="Clear date"
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowCalendar({ field: 'estimatedStartDate', show: !showCalendar.show || showCalendar.field !== 'estimatedStartDate' })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </button>
                      {showCalendar.field === 'estimatedStartDate' && renderCalendar()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Start Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                        readOnly
                      />
                      {formData.startDate && (
                        <button
                          type="button"
                          onClick={() => handleClearDate('startDate')}
                          className="absolute right-9 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                          aria-label="Clear start date"
                          title="Clear date"
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowCalendar({ field: 'startDate', show: !showCalendar.show || showCalendar.field !== 'startDate' })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </button>
                      {showCalendar.field === 'startDate' && renderCalendar()}
                    </div>
                  </div>
                </div>

                {/* Estimated End Date and Status */}
                <div className="flex gap-4">
                  {/* Estimated End Date */}
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Estimated End Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={formData.estimatedEndDate}
                        onChange={(e) => handleInputChange('estimatedEndDate', e.target.value)}
                        className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                        readOnly
                      />
                      {formData.estimatedEndDate && (
                        <button
                          type="button"
                          onClick={() => handleClearDate('estimatedEndDate')}
                          className="absolute right-9 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                          aria-label="Clear estimated end date"
                          title="Clear date"
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowCalendar({ field: 'estimatedEndDate', show: !showCalendar.show || showCalendar.field !== 'estimatedEndDate' })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </button>
                      {showCalendar.field === 'estimatedEndDate' && renderCalendar()}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Status</label>
                    <div className="relative">
                      <div
                        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer bg-white flex items-center justify-between"
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      >
                        <span className={`${formData.status ? 'text-gray-900' : 'text-gray-400'}`}>{formData.status || 'Select status'}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      {showStatusDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          {['Not Started', 'In Progress', 'Reopened', 'Suspended', 'Completed', 'Cancelled'].map((status) => (
                            <div
                              key={status}
                              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm ${status === 'Completed' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                              onClick={() => {
                                handleInputChange('status', status);
                                setShowStatusDropdown(false);
                              }}
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
              </div>

              {/* Right Column */}
              <div className="space-y-5">

                  {/* Domain */}
                  <div>
                  <div className="flex items-center mb-2 font-semibold">
                    <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Domain</label>
                    <button
                      onClick={() => setIsDomainModalOpen(true)}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown('domain', domainOptions, 'Choose your Domain', formData.domain)}
                </div>

               

                {/* Industry */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Industry</label>
                  <div className="relative">
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${formData.industry ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      <option value="" disabled>Select industry</option>
                      {industryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Description */}
                                <div>
                                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Description</label>
                                  <textarea
                                    rows={10}
                                    cols={30}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                                    placeholder=""
                                  />
                                </div>
                
              </div>
            </div>

            {/* Critical and Auxiliary Inputs */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-6">
              {/* Left Column - Aux inputs */}
              <div className="space-y-5">
                {/* Aux Project */}
                <div>
                  <div className="flex items-center mb-2 font-semibold">
                    <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Aux. Project</label>
                    <button
                      onClick={handleCreateAuxProject}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown('auxProject', auxProjectOptions, 'Choose your Aux Project', formData.auxProject)}
                </div>

                {/* Aux Product */}
                <div>
                  <div className="flex items-center mb-2 font-semibold">
                    <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Aux. Product</label>
                    <button
                      onClick={handleCreateAuxProduct}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown('auxProduct', auxProductOptions, 'Choose your Aux Product', formData.auxProduct)}
                </div>

                {/* Aux Program */}
                <div>
                  <div className="flex items-center mb-2 font-semibold">
                    <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Aux. Program</label>
                    <button
                      onClick={handleCreateAuxProgram}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown('auxProgram', auxProgramOptions, 'Choose your Aux Program', formData.auxProgram)}
                </div>
              </div>

              {/* Right Column - Crit inputs */}
              <div className="space-y-5">
                {/* Crit Project */}
                <div>
                  <div className="flex items-center mb-2 font-semibold">
                    <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Crit. Project</label>
                    <button
                      onClick={handleCreateCritProject}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown('critProject', critProjectOptions, 'Choose your Crit Project', formData.critProject)}
                </div>

                {/* Crit Product */}
                <div>
                  <div className="flex items-center mb-2 font-semibold">
                    <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Crit. Product</label>
                    <button
                      onClick={handleCreateCritProduct}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown('critProduct', critProductOptions, 'Choose your Crit Product', formData.critProduct)}
                </div>

                {/* Crit Program */}
                <div>
                  <div className="flex items-center mb-2 font-semibold">
                    <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Crit. Program</label>
                    <button
                      onClick={handleCreateCritProgram}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown('critProgram', critProgramOptions, 'Choose your Crit Program', formData.critProgram)}
                </div>
              </div>
            </div>
            {/* Linked selects row */}
           <div className="grid grid-cols-3 gap-x-8 gap-y-6 mt-6">
              {/* Linked Program */}
              <div>
                <div className="flex items-center mb-2 font-semibold">
                  <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Linked Program</label>
                  <button
                    onClick={handleNavigateToProgram}
                    className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {renderSearchableDropdown('linkedProgram', programLinkOptions, 'Choose a program', formData.linkedProgram)}
              </div>

              {/* Linked Product */}
              <div>
                <div className="flex items-center mb-2 font-semibold">
                  <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Linked Product</label>
                  <button
                    onClick={handleNavigateToProduct}
                    className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {renderSearchableDropdown('linkedProduct', productLinkOptions, 'Choose a product', formData.linkedProduct)}
              </div>

              {/* Linked Project */}
              <div>
                <div className="flex items-center mb-2 font-semibold">
                  <label className="block text-sm font-semibold" style={{ color: '#2D3748', fontFamily: 'Poppins, sans-serif' }}>Linked Project</label>
                  <button
                    onClick={handleNavigateToProject}
                    className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {renderSearchableDropdown('linkedProject', projectLinkOptions, 'Choose a project', formData.linkedProject)}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={() => {
                  const sourcePage = location.state?.from || '/dashboard/projects/create';
                  navigate(sourcePage);
                }}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
           
        </div>
      </div>

      {/* Modals */}
      <DomainModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />

    </div>
  );
}

export default ProgramCreate;