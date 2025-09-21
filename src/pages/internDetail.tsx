import { Button } from '../components/ui/button';
import { IconUser, IconArrowLeft, IconEdit, IconCirclePlus } from '@tabler/icons-react';
import { X } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import TopicSelectionModal from '../components/TopicSelectionModal';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface InternDetail {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    institute: string;
    internshipType: string;
    duration: string;
    startDate: string;
    finishDate: string;
    backToSchoolDate: string;
    topic: string;
    project: string;
    supervisor: string;
    internshipStatus: string;
    softSkills: string[];
    technologies: string[];
    domains: string[];
    firstImpression: string[];
}

const InternDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [intern, setIntern] = useState<InternDetail | null>(null);
    const [isFireModalOpen, setIsFireModalOpen] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedIntern, setEditedIntern] = useState(intern);
    const [newSoftSkill, setNewSoftSkill] = useState('');
    const [newTechnology, setNewTechnology] = useState('');
    const [newDomain, setNewDomain] = useState('');
    const [newFirstImpression, setNewFirstImpression] = useState('');
    const [showSoftSkillModal, setShowSoftSkillModal] = useState(false);
    const [showTechnologyModal, setShowTechnologyModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [showFirstImpressionModal, setShowFirstImpressionModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadInternData() {
            try {
                // First try to load from InternsData.json
                const response = await fetch('/data/InternsData.json');
                const data = await response.json();
                let foundIntern = data.interns?.find((i: InternDetail) => i.id === id);
                
                // If not found in interns, check candidates (for newly accepted ones)
                if (!foundIntern) {
                    const candidateResponse = await fetch('/data/CandidatesData.json');
                    const candidateData = await candidateResponse.json();
                    const foundCandidate = candidateData.candidates?.find((c: any) => c.id === id);
                    
                    if (foundCandidate) {
                        // Convert candidate to intern format
                        foundIntern = {
                            id: foundCandidate.id,
                            fullName: foundCandidate.fullName,
                            email: foundCandidate.email,
                            phone: foundCandidate.phone,
                            address: foundCandidate.address,
                            status: foundCandidate.status,
                            institute: foundCandidate.institute,
                            internshipType: foundCandidate.internshipType,
                            duration: foundCandidate.duration,
                            startDate: foundCandidate.startDate,
                            finishDate: foundCandidate.finishDate,
                            backToSchoolDate: foundCandidate.backToSchoolDate,
                            topic: foundCandidate.topic || 'Chakra Soft UI Version',
                            project: 'Chakra Soft UI Version',
                            supervisor: 'Name Lastname',
                            internshipStatus: 'In Extension',
                            softSkills: foundCandidate.softSkills || [],
                            technologies: foundCandidate.technologies || [],
                            domains: foundCandidate.domains || [],
                            firstImpression: foundCandidate.firstImpression || []
                        };
                    }
                }
                
                setIntern(foundIntern || null);
                setEditedIntern(foundIntern || null);
            } catch (error) {
                console.error('Error loading intern data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadInternData();
    }, [id]);

    // Update editedIntern when intern changes
    useEffect(() => {
        if (intern) {
            setEditedIntern(intern);
        }
    }, [intern]);


    const handleFireConfirm = () => {
        // Handle fire action here
        console.log('Intern fired');
        setIsFireModalOpen(false);
    };

    const handleTopicSelect = (topic: any) => {
        // Handle topic assignment here
        console.log('Topic selected:', topic);
        setIsTopicModalOpen(false);
    };

    const handleInputChange = (field: keyof InternDetail, value: any) => {
        if (editedIntern) {
            setEditedIntern({
                ...editedIntern,
                [field]: value
            });
        }
    };

    const addSoftSkill = () => {
        if (newSoftSkill.trim() && editedIntern) {
            setEditedIntern({
                ...editedIntern,
                softSkills: [...editedIntern.softSkills, newSoftSkill.trim()]
            });
            setNewSoftSkill('');
            setShowSoftSkillModal(false);
        }
    };

    const removeSoftSkill = (index: number) => {
        if (editedIntern) {
            setEditedIntern({
                ...editedIntern,
                softSkills: editedIntern.softSkills.filter((_, i) => i !== index)
            });
        }
    };

    const addTechnology = () => {
        if (newTechnology.trim() && editedIntern) {
            setEditedIntern({
                ...editedIntern,
                technologies: [...editedIntern.technologies, newTechnology.trim()]
            });
            setNewTechnology('');
            setShowTechnologyModal(false);
        }
    };

    const removeTechnology = (index: number) => {
        if (editedIntern) {
            setEditedIntern({
                ...editedIntern,
                technologies: editedIntern.technologies.filter((_, i) => i !== index)
            });
        }
    };

    const addDomain = () => {
        if (newDomain.trim() && editedIntern) {
            setEditedIntern({
                ...editedIntern,
                domains: [...editedIntern.domains, newDomain.trim()]
            });
            setNewDomain('');
            setShowDomainModal(false);
        }
    };

    const removeDomain = (index: number) => {
        if (editedIntern) {
            setEditedIntern({
                ...editedIntern,
                domains: editedIntern.domains.filter((_, i) => i !== index)
            });
        }
    };

    const addFirstImpression = () => {
        if (newFirstImpression.trim() && editedIntern) {
            setEditedIntern({
                ...editedIntern,
                firstImpression: [...editedIntern.firstImpression, newFirstImpression.trim()]
            });
            setNewFirstImpression('');
            setShowFirstImpressionModal(false);
        }
    };

    const removeFirstImpression = (index: number) => {
        if (editedIntern) {
            setEditedIntern({
                ...editedIntern,
                firstImpression: editedIntern.firstImpression.filter((_, i) => i !== index)
            });
        }
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    }

    if (!intern) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Intern not found</div>;
    }

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/dashboard/interns')}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <IconArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Interns</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditMode && (
                            <IconEdit 
                                stroke={2} 
                                className="text-blue-500 cursor-pointer hover:text-blue-600" 
                                onClick={() => setIsEditMode(true)}
                            />
                        )}
                        {isEditMode && (
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => {
                                        setIntern(editedIntern);
                                        setIsEditMode(false);
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 text-sm"
                                >
                                    Save
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setEditedIntern(intern);
                                        setIsEditMode(false);
                                    }}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 text-sm"
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Header Section */}
            <div className="bg-white border-b p-6 shadow-sm rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                                <IconUser size={40} stroke={1.5} className="text-white" />
                            </div>
                            {/* Online indicator */}
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        
                        <div className="space-y-1">
                            {isEditMode ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            value={editedIntern?.fullName || ''} 
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            className="text-xl font-semibold text-gray-900 px-2 py-1 border border-gray-300 rounded flex-1"
                                        />
                                        <IconEdit className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="email" 
                                            value={editedIntern?.email || ''} 
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="text-gray-600 px-2 py-1 border border-gray-300 rounded flex-1"
                                        />
                                        <IconEdit className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="tel" 
                                            value={editedIntern?.phone || ''} 
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="text-gray-600 px-2 py-1 border border-gray-300 rounded flex-1"
                                        />
                                        <IconEdit className="w-4 h-4 text-blue-500" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold text-gray-900">{intern.fullName}</h2>
                                    <p className="text-gray-600">{intern.email}</p>
                                    <p className="text-gray-600">{intern.phone}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500">Internship Status :</span>
                        <span className="px-4 py-1 rounded-lg text-sm font-medium bg-blue-500 text-white shadow-sm">
                           {intern.internshipStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content - Three Columns */}
            <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Intern Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ml-[-30px] mr-[-30px]">
                    <h3 className="text-blue-600 font-semibold text-lg mb-4">Intern Info :</h3>
                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Address :</span>
                                {isEditMode ? (
                                    <input 
                                        type="text" 
                                        value={editedIntern?.address || ''} 
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                ) : (
                                    <span>{intern.address}</span>
                                )}
                            </div>
                            
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Status :</span>
                                {isEditMode ? (
                                    <select 
                                        value={editedIntern?.status || ''} 
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Worker">Worker</option>
                                        <option value="Intern">Intern</option>
                                    </select>
                                ) : (
                                    <span>{intern.status}</span>
                                )}
                            </div>
                            
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Institute :</span>
                                {isEditMode ? (
                                    <input 
                                        type="text" 
                                        value={editedIntern?.institute || ''} 
                                        onChange={(e) => handleInputChange('institute', e.target.value)}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                ) : (
                                    <span>{intern.institute}</span>
                                )}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        <div className="mt-6">
                            <h4 className="text-blue-600 font-semibold text-base mb-3">Soft Skills :</h4>
                            <div className="flex gap-2 flex-wrap items-center">
                                {(isEditMode ? editedIntern?.softSkills : intern.softSkills)?.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                                        {skill}
                                        {isEditMode && (
                                            <X 
                                                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeSoftSkill(index)}
                                            />
                                        )}
                                    </span>
                                ))}
                                {isEditMode && (
                                    <button
                                        onClick={() => setShowSoftSkillModal(true)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        <IconCirclePlus stroke={2} className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* First Impression */}
                        <div className="mt-6">
                            <h4 className="text-blue-600 font-semibold text-base mb-3">First Impression :</h4>
                            <div className="flex gap-2 flex-wrap items-center">
                                {(isEditMode ? editedIntern?.firstImpression : intern.firstImpression)?.map((impression, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                                        {impression}
                                        {isEditMode && (
                                            <X 
                                                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeFirstImpression(index)}
                                            />
                                        )}
                                    </span>
                                ))}
                                {isEditMode && (
                                    <button
                                        onClick={() => setShowFirstImpressionModal(true)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        <IconCirclePlus stroke={2} className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Internship Details */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <h3 className="text-blue-600 font-semibold text-lg mb-4">Internship Details :</h3>
                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Internship Type :</span>
                                {isEditMode ? (
                                    <select
                                        value={editedIntern?.internshipType || 'PFE'}
                                        onChange={(e) => handleInputChange('internshipType', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                        <option value="PFE">PFE</option>
                                        <option value="Normal">Normal</option>
                                    </select>
                                ) : (
                                    <span>{intern.internshipType}</span>
                                )}
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Duration :</span>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={editedIntern?.duration || ''}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm w-24"
                                        placeholder="2 months"
                                    />
                                ) : (
                                    <span>{intern.duration}</span>
                                )}
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Starting Date :</span>
                                {isEditMode ? (
                                    <input
                                        type="date"
                                        value={formatDateForInput(editedIntern?.startDate || '')}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                ) : (
                                    <span>{intern.startDate}</span>
                                )}
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Finishing Date :</span>
                                {isEditMode ? (
                                    <input
                                        type="date"
                                        value={formatDateForInput(editedIntern?.finishDate || '')}
                                        onChange={(e) => handleInputChange('finishDate', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                ) : (
                                    <span>{intern.finishDate}</span>
                                )}
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-gray-500 font-medium">Back to School :</span>
                                {isEditMode ? (
                                    <input
                                        type="date"
                                        value={formatDateForInput(editedIntern?.backToSchoolDate || '')}
                                        onChange={(e) => handleInputChange('backToSchoolDate', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                ) : (
                                    <span>{intern.backToSchoolDate}</span>
                                )}
                            </div>
                        </div>

                        {/* Domains */}
                        <div className="mt-6">
                            <h4 className="text-blue-600 font-semibold text-base mb-3">Domains :</h4>
                            <div className="flex gap-2 flex-wrap items-center">
                                {(isEditMode ? editedIntern?.domains : intern.domains)?.map((domain, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                                        {domain}
                                        {isEditMode && (
                                            <X 
                                                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeDomain(index)}
                                            />
                                        )}
                                    </span>
                                ))}
                                {isEditMode && (
                                    <button
                                        onClick={() => setShowDomainModal(true)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        <IconCirclePlus stroke={2} className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Technologies */}
                        <div className="mt-6">
                            <h4 className="text-blue-600 font-semibold text-base mb-3">Technologies :</h4>
                            <div className="flex gap-2 flex-wrap items-center">
                                {(isEditMode ? editedIntern?.technologies : intern.technologies)?.map((tech, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                                        {tech}
                                        {isEditMode && (
                                            <X 
                                                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                                                onClick={() => removeTechnology(index)}
                                            />
                                        )}
                                    </span>
                                ))}
                                {isEditMode && (
                                    <button
                                        onClick={() => setShowTechnologyModal(true)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        <IconCirclePlus stroke={2} className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Project, Supervisor, and Action Buttons */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mr-[-25px]">
                        {/* Project */}
                        <h3 className="text-blue-600 font-semibold text-lg mb-4">Project :</h3>
                        {isEditMode ? (
                            <input 
                                type="text" 
                                value={editedIntern?.project || ''} 
                                onChange={(e) => handleInputChange('project', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-4"
                            />
                        ) : (
                            <p className="text-gray-900 mb-4">{intern.project}</p>
                        )}
                        
                        <div className="mb-6">
                            <h4 className="text-blue-600 font-semibold text-base mb-2">Topic :</h4>
                            {isEditMode ? (
                                <input 
                                    type="text" 
                                    value={editedIntern?.topic || ''} 
                                    onChange={(e) => handleInputChange('topic', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                            ) : (
                                <p className="text-gray-900">{intern.topic}</p>
                            )}
                        </div>

                        {/* Supervisor */}
                        <h3 className="text-blue-600 font-semibold text-lg mb-4">Supervisor :</h3>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                <IconUser size={24} stroke={1.5} className="text-white" />
                            </div>
                            <div className="flex-1">
                                {isEditMode ? (
                                    <>
                                        <input 
                                            type="text" 
                                            value={editedIntern?.supervisor || ''} 
                                            onChange={(e) => handleInputChange('supervisor', e.target.value)}
                                            className="font-medium text-gray-900 px-2 py-1 border border-gray-300 rounded text-sm w-full mb-1"
                                        />
                                        <p className="text-sm text-gray-600">email.example@gmail.com</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium text-gray-900">{intern.supervisor}</p>
                                        <p className="text-sm text-gray-600">email.example@gmail.com</p>
                                    </>
                                )}
                            </div>
                            {isEditMode && (
                                <IconEdit className="w-4 h-4 text-blue-500" />
                            )}
                        </div>

                        {/* Action Buttons - Only show when not in edit mode */}
                        {!isEditMode && (
                            <div className="flex gap-3 mt-[70px] ml-[80px]" >
                                <Button 
                                    onClick={() => setIsFireModalOpen(true)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 shadow-md hover:shadow-lg transition-all rounded-lg"
                                >
                                    Fire
                                </Button>
                                <Button 
                                    onClick={() => setIsTopicModalOpen(true)}
                                    className="bg-[#F4C54D] hover:bg-[#F4BC4D] text-white px-8 py-2 shadow-md hover:shadow-lg transition-all rounded-lg">
                                    Affect
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal for Fire */}
            <ConfirmationModal
                isOpen={isFireModalOpen}
                onClose={() => setIsFireModalOpen(false)}
                onConfirm={handleFireConfirm}
                title="Attention"
                message="Are u sure you want to fire or ban this user ?"
                confirmText="Fire"
                cancelText="Ban"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
            />

            {/* Topic Selection Modal for Affect */}
            <TopicSelectionModal
                isOpen={isTopicModalOpen}
                onClose={() => setIsTopicModalOpen(false)}
                onSelectTopic={handleTopicSelect}
            />

            {/* Add Soft Skill Modal */}
            {showSoftSkillModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Add Soft Skill</h2>
                            <button 
                                onClick={() => setShowSoftSkillModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <input
                                type="text"
                                value={newSoftSkill}
                                onChange={(e) => setNewSoftSkill(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSoftSkill()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter soft skill..."
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setShowSoftSkillModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addSoftSkill}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Technology Modal */}
            {showTechnologyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Add Technology</h2>
                            <button 
                                onClick={() => setShowTechnologyModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <input
                                type="text"
                                value={newTechnology}
                                onChange={(e) => setNewTechnology(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTechnology()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter technology..."
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setShowTechnologyModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addTechnology}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Domain Modal */}
            {showDomainModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Add Domain</h2>
                            <button 
                                onClick={() => setShowDomainModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <input
                                type="text"
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addDomain()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter domain name..."
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setShowDomainModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addDomain}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add First Impression Modal */}
            {showFirstImpressionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Add First Impression</h2>
                            <button 
                                onClick={() => setShowFirstImpressionModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <input
                                type="text"
                                value={newFirstImpression}
                                onChange={(e) => setNewFirstImpression(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addFirstImpression()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter impression..."
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setShowFirstImpressionModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addFirstImpression}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternDetail;