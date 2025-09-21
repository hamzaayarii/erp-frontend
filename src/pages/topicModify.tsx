import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, Plus, X } from 'lucide-react';
import { DomainModal } from '../components/DomainModal';
import { TechnologyModal } from '../components/TechnologyModal';
import { IconTrash, IconEye } from '@tabler/icons-react';
import { useNavigate, useLocation } from "react-router-dom";

type ArrayField = 'domain' | 'technology' | 'project' | 'teamMembers' | 'linkedProgram' | 'linkedProduct' | 'linkedProject';
type NumberField = 'minor' | 'major' | 'nbInterns';


interface TopicFormData {
  title: string;
  domain: string[];
  estimatedBudget: string;
  budget: string;
  estimatedStartDate: string;
  startDate: string;
  estimatedEndDate: string;
  endDate: string;
  description: string;
  technology: string[];
  status: string;
  nbInterns: string;
  priority: string;
  project: string[];
  teamMembers: string[];
  minor: number;
  major: number;
  linkedProgram: string[];
  linkedProduct: string[];
  linkedProject: string[];
}

function TopicModify() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle incoming linked items from navigation state
  useEffect(() => {
    const state = location.state;
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
  }, [location.state]);

  const projectData = location.state?.projectData;
  const [formData, setFormData] = useState<TopicFormData>({
    title: '',
    domain: [],
    estimatedBudget: '',
    budget: '',
    estimatedStartDate: '',
    startDate: '',
    estimatedEndDate: '',
    endDate: '',
    description: '',
    technology: [],
    status: 'Not Started',
    nbInterns: '',
    priority: '',
    project: [],
    teamMembers: [],
    minor: 0,
    major: 0,
    linkedProgram: [],
    linkedProduct: [],
    linkedProject: []
  });

  // Refs to native date inputs
  const dateInputRefs = useRef<Record<'estimatedStartDate' | 'startDate' | 'estimatedEndDate', HTMLInputElement | null>>({
    estimatedStartDate: null,
    startDate: null,
    estimatedEndDate: null,
  });
  type HTMLInputWithPicker = HTMLInputElement & { showPicker?: () => void };

  const [searchStates, setSearchStates] = useState({
    domain: '',
    technology: '',
    project: '',
    teamMembers: '',
    linkedProgram: '',
    linkedProduct: '',
    linkedProject: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    domain: false,
    technology: false,
    project: false,
    teamMembers: false,
    nbInterns: false,
    linkedProgram: false,
    linkedProduct: false,
    linkedProject: false
  });

  // Modal states
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isTechnologyModalOpen, setIsTechnologyModalOpen] = useState(false);

  // Navigation handlers for linked items
  const handleNavigateToProduct = () => {
    navigate('/dashboard/products/create', {
      state: { from: 'topic-create' }
    });
  };

  const handleNavigateToProject = () => {
    navigate('/dashboard/projects/create', {
      state: { from: 'topic-create' }
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a topic title');
      return;
    }
    const newTopicData = {
      name: formData.title,
      type: 'topic' as const,
      ...formData
    };
    
    // Navigate back to the source page if it exists, otherwise go to topics list
    const state = location.state;
    if (state?.from) {
      switch (state.from) {
        case 'project-create':
          navigate('/dashboard/projects/create', {
            state: { newLinkedTopic: newTopicData }
          });
          break;
        case 'product-create':
          navigate('/dashboard/products/create', {
            state: { newLinkedTopic: newTopicData }
          });
          break;
        case 'program-create':
          navigate('/dashboard/programs/create', {
            state: { newLinkedTopic: newTopicData }
          });
          break;
        default:
          navigate('/dashboard/topics');
      }
    } else {
      navigate('/dashboard/topics');
    }
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
        case 'program-create':
          navigate('/dashboard/programs/create');
          break;
        default:
          navigate('/dashboard/topics');
      }
    } else {
      navigate('/dashboard/topics');
    }
  };

  useEffect(() => {
    if (projectData) {
      setFormData(prev => ({
        ...prev,
        domain: projectData.domain || [],
        technology: projectData.technology || [],
        project: projectData.project ? [projectData.project] : [],
        estimatedBudget: projectData.estimatedBudget || '',
        description: projectData.description || '',
      }));
    }
  }, [projectData]);

  const domainOptions = ['Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cybersecurity'];
  const technologyOptions = ['React', 'Node.js', 'Python', 'Java', 'Angular', 'Vue.js', 'JavaScript', 'PHP', 'TypeScript'];
  const teamMemberOptions = ['Amine Gharbi', 'Sarah Johnson', 'Mike Chen', 'Lisa Wang', 'David Brown'];
  const baseProductOptions = ['Product Alpha', 'Product Beta', 'Product Gamma', 'Product Delta'];
  const baseProjectOptions = ['Project Orion', 'Project Nova', 'Project Atlas', 'Project Zenith'];
  
  // Filter out already selected items from dropdown options to prevent duplicates
  const productOptions = baseProductOptions.filter(option => !formData.linkedProduct.includes(option));
  const projectLinkOptions = baseProjectOptions.filter(option => !formData.linkedProject.includes(option));

  const handleInputChange = <K extends keyof TopicFormData>(field: K, value: TopicFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Clear date for a given field
  const handleClearDate = (field: 'estimatedStartDate' | 'startDate' | 'estimatedEndDate') => {
    handleInputChange(field, '');
  };

  // Open native date picker for a field
  const openDatePicker = (field: 'estimatedStartDate' | 'startDate' | 'estimatedEndDate') => {
    const el = dateInputRefs.current[field] as HTMLInputWithPicker | null;
    if (!el) return;
    try {
      if (typeof el.showPicker === 'function') {
        el.showPicker();
      } else {
        el.focus();
        el.click();
      }
    } catch {
      el.focus();
      el.click();
    }
  };

  const handleArrayToggle = (field: ArrayField, value: string) => {
    setFormData(prev => {
      const list = prev[field] as string[];
      const newList = list.includes(value)
        ? list.filter((item: string) => item !== value)
        : [...list, value];
      return { ...prev, [field]: newList };
    });
  };

  const handleRemoveItem = (field: ArrayField, value: string) => {
    setFormData(prev => {
      const list = prev[field] as string[];
      const newList = list.filter((item: string) => item !== value);
      return { ...prev, [field]: newList };
    });
  };

  const handleNumberChange = (field: NumberField, increment: boolean) => {
    setFormData(prev => {
      const currentValue = prev[field] as number;
      const newValue = Math.max(0, currentValue + (increment ? 1 : -1));
      return { ...prev, [field]: newValue };
    });
  };

  const handleSearchChange = (field: ArrayField, value: string) => {
    setSearchStates(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (field: keyof typeof dropdownOpen) => {
    setDropdownOpen(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getFilteredOptions = (options: string[], searchTerm: string) => {
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderSearchableDropdown = (field: ArrayField, options: string[], placeholder: string, selectedItems: string[]) => {
    const filteredOptions = getFilteredOptions(options, searchStates[field]);
    
    return (
      <div className="relative">
        <div className="relative">
          <div className="w-full min-h-[42px] px-3 py-2 pr-10 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 flex flex-wrap items-center gap-2 bg-white">
            {selectedItems.map((item: string) => (
              <span key={item} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded border">
                {field === 'teamMembers' || field === 'project' ? `INT-${String(options.indexOf(item) + 1).padStart(3, '0')}: ${item}` : item}
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
            {filteredOptions.map((option: string, index: number) => {
              const displayText = (field === 'teamMembers' || field === 'project') 
                ? `INT-${String(index + 1).padStart(3, '0')}: ${option}` 
                : option;
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
                    <span>{displayText}</span>
                    {['linkedProgram', 'linkedProduct', 'linkedProject'].includes(field) && (
                      <IconEye 
                        className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" 
                        onClick={(e: React.MouseEvent) => {
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

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.relative')) {
        setDropdownOpen({
          domain: false,
          technology: false,
          project: false,
          teamMembers: false,
          nbInterns: false,
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 pl-10 pr-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <ArrowLeft className="w-5 h-5 mr-3 text-gray-600" />
            <h1 className="text-xl font-semibold text-gray-900">Create Topic</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pl-10 pr-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Topic</h2>
            </div>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Assign a name to your topic"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Estimated Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget</label>
                <input
                  type="text"
                  placeholder="Write your estimated budget"
                  value={formData.estimatedBudget}
                  onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Fields - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated start date</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.estimatedStartDate}
                      onChange={(e) => handleInputChange('estimatedStartDate', e.target.value)}
                      onClick={() => openDatePicker('estimatedStartDate')}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      ref={(el) => (dateInputRefs.current.estimatedStartDate = el)}
                      onChange={(e) => {
                        const iso = e.target.value; // yyyy-mm-dd
                        if (iso && iso.includes('-')) {
                          const [y, m, d] = iso.split('-');
                          handleInputChange('estimatedStartDate', `${d}/${m}/${y}`);
                        } else {
                          handleInputChange('estimatedStartDate', iso);
                        }
                      }}
                      className="absolute inset-y-0 left-0 right-12 w-auto h-full opacity-0 cursor-pointer z-10"
                    />
                    {formData.estimatedStartDate && (
                      <button
                        type="button"
                        onClick={() => handleClearDate('estimatedStartDate')}
                        className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        aria-label="Clear estimated start date"
                        title="Clear date"
                      >
                        <IconTrash size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openDatePicker('estimatedStartDate')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Open calendar"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      onClick={() => openDatePicker('startDate')}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      ref={(el) => (dateInputRefs.current.startDate = el)}
                      onChange={(e) => {
                        const iso = e.target.value;
                        if (iso && iso.includes('-')) {
                          const [y, m, d] = iso.split('-');
                          handleInputChange('startDate', `${d}/${m}/${y}`);
                        } else {
                          handleInputChange('startDate', iso);
                        }
                      }}
                      className="absolute inset-y-0 left-0 right-12 w-auto h-full opacity-0 cursor-pointer z-10"
                    />
                    <button
                      type="button"
                      onClick={() => openDatePicker('startDate')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Open calendar"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                    {formData.startDate && (
                      <button
                        type="button"
                        onClick={() => handleClearDate('startDate')}
                        className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        aria-label="Clear start date"
                        title="Clear date"
                      >
                        <IconTrash size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Estimated End date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated End date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.estimatedEndDate}
                      onChange={(e) => handleInputChange('estimatedEndDate', e.target.value)}
                      onClick={() => openDatePicker('estimatedEndDate')}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      ref={(el) => (dateInputRefs.current.estimatedEndDate = el)}
                      onChange={(e) => {
                        const iso = e.target.value;
                        if (iso && iso.includes('-')) {
                          const [y, m, d] = iso.split('-');
                          handleInputChange('estimatedEndDate', `${d}/${m}/${y}`);
                        } else {
                          handleInputChange('estimatedEndDate', iso);
                        }
                      }}
                      className="absolute inset-y-0 left-0 right-12 w-auto h-full opacity-0 cursor-pointer z-10"
                    />
                    {formData.estimatedEndDate && (
                      <button
                        type="button"
                        onClick={() => handleClearDate('estimatedEndDate')}
                        className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        aria-label="Clear estimated end date"
                        title="Clear date"
                      >
                        <IconTrash size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openDatePicker('estimatedEndDate')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Open calendar"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Reopened</option>
                      <option>Suspended</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              {/* Technology */}
              <div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Technology</label>
                  <button 
                    onClick={() => setIsTechnologyModalOpen(true)}
                    className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {renderSearchableDropdown('technology', technologyOptions, 'Choose your technology', formData.technology)}
              </div>

              {/* NB Interns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NB Interns</label>
                <div className="relative border-2 rounded-md">
                  <input
                    type="number"
                    value={formData.nbInterns}
                    onChange={(e) => handleInputChange('nbInterns', e.target.value)}
                    placeholder="Enter number of interns"
                    className="w-full px-3 py-2 pr-8 bg-white focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                  <div className="absolute right-1 top-1 flex flex-col">
                    <button
                      onClick={() => handleNumberChange('nbInterns', true)}
                      className="p-0.5 hover:bg-gray-100 rounded"
                    >
                      <ChevronUp className="h-3 w-3 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleNumberChange('nbInterns', false)}
                      className="p-0.5 hover:bg-gray-100 rounded"
                    >
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Version Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">NB interns (crit)</label>
                  <div className="relative border-2 rounded-md">
                    <input
                      type="number"
                      value={formData.minor}
                      readOnly
                      className="w-full px-3 py-2 pr-8 bg-white focus:outline-none"
                    />
                    <div className="absolute right-1 top-1 flex flex-col">
                      <button
                        onClick={() => handleNumberChange('minor', true)}
                        className="p-0.5 hover:bg-gray-100 rounded"
                      >
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleNumberChange('minor', false)}
                        className="p-0.5 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">NB interns (aux)</label>
                  <div className="relative border-2 rounded-md">
                    <input
                      type="number"
                      value={formData.major}
                      readOnly
                      className="w-full px-3 py-2 pr-8 bg-white focus:outline-none"
                    />
                    <div className="absolute right-1 top-1 flex flex-col">
                      <button
                        onClick={() => handleNumberChange('major', true)}
                        className="p-0.5 hover:bg-gray-100 rounded"
                      >
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleNumberChange('major', false)}
                        className="p-0.5 hover:bg-gray-100 rounded"
                      >
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Domain */}
              <div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Domain</label>
                  <button 
                    onClick={() => setIsDomainModalOpen(true)}
                    className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {renderSearchableDropdown('domain', domainOptions, 'Choose your domain', formData.domain)}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <input
                  type="text"
                  placeholder="Write your budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder=""
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              {/* Add Team Members */}
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Team Members</label>
                {renderSearchableDropdown('teamMembers', teamMemberOptions, 'Choose your team member', formData.teamMembers)}
              </div>
             

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select priority</option>
                    <option value="1">1 - Lowest</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Medium</option>
                    <option value="4">4 - High</option>
                    <option value="5">5 - Highest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
                    {/* Linked Project */}
                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Linked Project</label>
                    <button
                      onClick={handleNavigateToProject}
                      className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {renderSearchableDropdown(
                    'linkedProject',
                    projectLinkOptions,
                    'Choose your project',
                    formData.linkedProject
                  )}
                </div>
              {/* Project */}
               {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Project</label>
                {renderSearchableDropdown('project', projectOptions, 'Project Title', formData.project)}
              </div>*/}
            </div>
          </div>

        {/* Linked fields section */}
<div className="mt-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Linked Product */}
    <div>
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Linked Product
        </label>
        <button
          onClick={handleNavigateToProduct}
          className="w-5 h-5 ml-2 border border-gray-400 text-gray-600 rounded-full flex items-center justify-center hover:border-gray-600 hover:text-gray-800 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      {renderSearchableDropdown(
        'linkedProduct',
        productOptions,
        'Choose your product',
        formData.linkedProduct
      )}
    </div>
  </div>
</div>


            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button 
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Topic
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
      <TechnologyModal 
        isOpen={isTechnologyModalOpen} 
        onClose={() => setIsTechnologyModalOpen(false)} 
      />
    </div>
  );
}

export default TopicModify;