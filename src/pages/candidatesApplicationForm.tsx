import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { IconUser, IconEdit, IconCirclePlus } from '@tabler/icons-react';
import TopicSelectionModal from '@/components/TopicSelectionModal';
interface Candidate {
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
    firstImpression: string[];
    softSkills: string[];
    technologies: string[];
    domains: string[];
}

const CandidatesApplicationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedCandidate, setEditedCandidate] = useState<Candidate | null>(null);
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showTechModal, setShowTechModal] = useState(false);
    const [showImpressionModal, setShowImpressionModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [newSkillInput, setNewSkillInput] = useState('');
    const [newTechInput, setNewTechInput] = useState('');
    const [newImpressionInput, setNewImpressionInput] = useState('');
    const [newDomainInput, setNewDomainInput] = useState('');
    const [showTopicModal, setShowTopicModal] = useState(false);

    useEffect(() => {
        async function loadCandidateData() {
            try {
                const response = await fetch('/data/CandidatesData.json');
                const data = await response.json();
                const foundCandidate = data.candidates.find((c: Candidate) => c.id === id);
                setCandidate(foundCandidate || null);
                setEditedCandidate(foundCandidate || null);
            } catch (error) {
                console.error('Error loading candidate data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadCandidateData();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!candidate) {
        return <div className="min-h-screen flex items-center justify-center">Candidate not found</div>;
    }

    const handleEditToggle = () => {
        if (isEditMode) {
            // Cancel edit - reset to original data
            setEditedCandidate(candidate);
            setNewSkillInput('');
            setNewTechInput('');
            setNewImpressionInput('');
            setNewDomainInput('');
            setShowSkillModal(false);
            setShowTechModal(false);
            setShowImpressionModal(false);
            setShowDomainModal(false);
            setShowTopicModal(false);
        }
        setIsEditMode(!isEditMode);
    };

    const handleSave = () => {
        if (editedCandidate) {
            setCandidate(editedCandidate);
            setIsEditMode(false);
            // Here you would typically save to backend
            console.log('Saving candidate data:', editedCandidate);
        }
    };

    const handleInputChange = (field: keyof Candidate, value: string) => {
        if (editedCandidate) {
            // Convert date format for storage if it's a date field
            const finalValue = (field === 'startDate' || field === 'finishDate' || field === 'backToSchoolDate') 
                ? formatDateForStorage(value) 
                : value;
            setEditedCandidate({ ...editedCandidate, [field]: finalValue });
        }
    };

    const addSkill = () => {
        if (newSkillInput.trim() && editedCandidate) {
            const updatedSkills = [...editedCandidate.softSkills, newSkillInput.trim()];
            setEditedCandidate({ ...editedCandidate, softSkills: updatedSkills });
            setNewSkillInput('');
            setShowSkillModal(false);
        }
    };

    const addTech = () => {
        if (newTechInput.trim() && editedCandidate) {
            const updatedTechs = [...editedCandidate.technologies, newTechInput.trim()];
            setEditedCandidate({ ...editedCandidate, technologies: updatedTechs });
            setNewTechInput('');
            setShowTechModal(false);
        }
    };

    const addImpression = () => {
        if (newImpressionInput.trim() && editedCandidate) {
            const updatedImpressions = [...editedCandidate.firstImpression, newImpressionInput.trim()];
            setEditedCandidate({ ...editedCandidate, firstImpression: updatedImpressions });
            setNewImpressionInput('');
            setShowImpressionModal(false);
        }
    };

    const addDomain = () => {
        if (newDomainInput.trim() && editedCandidate) {
            const updatedDomains = [...editedCandidate.domains, newDomainInput.trim()];
            setEditedCandidate({ ...editedCandidate, domains: updatedDomains });
            setNewDomainInput('');
            setShowDomainModal(false);
        }
    };


    const currentCandidate = isEditMode ? editedCandidate : candidate;

    // Helper function to convert DD/MM/YYYY to YYYY-MM-DD for date inputs
    const formatDateForInput = (dateStr: string) => {
        if (!dateStr || dateStr.includes('-')) return dateStr; // Already in correct format or empty
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
    };

    // Helper function to convert YYYY-MM-DD back to DD/MM/YYYY for storage
    const formatDateForStorage = (dateStr: string) => {
        if (!dateStr || dateStr.includes('/')) return dateStr; // Already in DD/MM/YYYY format or empty
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    };

    const handleTopicSelection = (topic: { id: string; name: string; description?: string }) => {
        console.log('Selected topic:', topic);
        // Here you would typically update the candidate's assigned topic
        // and possibly change their status to 'Affected'
        if (editedCandidate) {
            setEditedCandidate({ ...editedCandidate, topic: topic.id, status: 'Affected' });
        }
    };

    const handleAccept = () => {
        if (candidate) {
            // Convert candidate to intern and navigate to intern detail page
            const internData = {
                id: candidate.id,
                fullName: candidate.fullName,
                email: candidate.email,
                phone: candidate.phone,
                address: candidate.address,
                institute: candidate.institute,
                internshipType: candidate.internshipType,
                duration: candidate.duration,
                startDate: candidate.startDate,
                finishDate: candidate.finishDate,
                backToSchoolDate: candidate.backToSchoolDate,
                topic: candidate.topic,
                softSkills: candidate.softSkills,
                technologies: candidate.technologies,
                domains: candidate.domains,
                firstImpression: candidate.firstImpression,
                internshipStatus: 'In Extension',
                supervisor: 'Name Lastname'
            };
            
            console.log('Converting candidate to intern:', internData);
            // Navigate to intern detail page
            navigate(`/dashboard/interns/${candidate.id}`);
        }
    };
    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className=" border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/dashboard/candidates')}
                            className="flex items-center gap-2 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Candidate</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6 p-6 items-start">
                {/* Left Sidebar - Profile */}
                <div className="w-80 bg-white rounded-lg p-6 flex flex-col" style={{minHeight: '663px'}}>
                    <div className="flex-1">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                                <IconUser size={64} stroke={1.5} className="text-white" />
                            </div>
                            
                            <div className="text-center space-y-2">
                                <h2 className="font-semibold text-gray-900 text-lg">Name Lastname</h2>
                                <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                                    <span>email.example@gmail.com</span>
                                    <span className="text-gray-400">📋</span>
                                </p>
                                <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                                    <span>+216 12312312</span>
                                    <span className="text-gray-400">📋</span>
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="text-center mb-6 mt-[90px]">
                            <span className="text-gray-600 mr-2">State :</span>
                            <span className="px-4 py-1 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800">
                               Affected
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 mt-auto">
                        <div className="flex gap-2">
                            <Button 
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 text-sm"
                                onClick={handleAccept}
                            >
                                Accept
                            </Button>
                            <Button 
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 text-sm"
                                onClick={() => setShowTopicModal(true)}
                            >
                                Affect
                            </Button>
                        </div>
                        <Button 
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 text-sm"
                            onClick={() => setShowRejectModal(true)}
                        >
                            Reject / Ban
                        </Button>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 bg-white rounded-lg p-8 relative" style={{minHeight: '600px'}}>
                    <div className="absolute top-6 right-6">
                        {!isEditMode && (
                            <IconEdit 
                                stroke={2} 
                                className="text-gray-400 cursor-pointer hover:text-gray-600" 
                                onClick={handleEditToggle}
                            />
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12 mt-4">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Candidate Info */}
                            <div>
                                <h3 className="text-blue-600 font-semibold text-lg mb-6">Candidate Info :</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-20">Adress :</span>
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={currentCandidate?.address || ''}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            />
                                        ) : (
                                            <span className="ml-4">Akouda, Sousse</span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-20">Status :</span>
                                        {isEditMode ? (
                                            <select
                                                value={currentCandidate?.status || 'Student'}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Worker">Worker</option>
                                                <option value="Intern">Intern</option>
                                            </select>
                                        ) : (
                                            <span className="ml-4">Student</span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-20">Institute :</span>
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={currentCandidate?.institute || ''}
                                                onChange={(e) => handleInputChange('institute', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            />
                                        ) : (
                                            <span className="ml-4">Higher Institute of Applied Sciences and technology</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Internship Details */}
                            <div>
                                <h3 className="text-blue-600 font-semibold text-lg mb-6">Internship Details :</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-32">Internship Type :</span>
                                        {isEditMode ? (
                                            <select
                                                value={currentCandidate?.internshipType || 'PFE'}
                                                onChange={(e) => handleInputChange('internshipType', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            >
                                                <option value="PFE">PFE</option>
                                                <option value="Normal">Normal</option>
                                            </select>
                                        ) : (
                                            <span className="ml-4">PFE</span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-32">Duration :</span>
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={currentCandidate?.duration || ''}
                                                onChange={(e) => handleInputChange('duration', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm w-24 ml-4"
                                                placeholder="2 months"
                                            />
                                        ) : (
                                            <span className="ml-4">2 months</span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-32">Starting Date:</span>
                                        {isEditMode ? (
                                            <input
                                                type="date"
                                                value={formatDateForInput(currentCandidate?.startDate || '')}
                                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            />
                                        ) : (
                                            <span className="ml-4">01/01/2024</span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-32">Finishing Date:</span>
                                        {isEditMode ? (
                                            <input
                                                type="date"
                                                value={formatDateForInput(currentCandidate?.finishDate || '')}
                                                onChange={(e) => handleInputChange('finishDate', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            />
                                        ) : (
                                            <span className="ml-4">31/08/2024</span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-32">Back to School :</span>
                                        {isEditMode ? (
                                            <input
                                                type="date"
                                                value={formatDateForInput(currentCandidate?.backToSchoolDate || '')}
                                                onChange={(e) => handleInputChange('backToSchoolDate', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            />
                                        ) : (
                                            <span className="ml-4">September 1st</span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 font-medium w-32">Topic(s) :</span>
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={currentCandidate?.topic || ''}
                                                onChange={(e) => handleInputChange('topic', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm ml-4"
                                            />
                                        ) : (
                                            <span className="ml-4">PLS1</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* First Impression */}
                            <div>
                                <h3 className="text-blue-600 font-semibold text-lg mb-6">First Impression :</h3>
                                <div className="flex gap-2 flex-wrap items-center">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Shy</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Very</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Polite</span>
                                    {isEditMode && (
                                        <button
                                            onClick={() => setShowImpressionModal(true)}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            <IconCirclePlus stroke={2} className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Soft Skills */}
                            <div>
                                <h3 className="text-blue-600 font-semibold text-lg mb-6">Soft Skills :</h3>
                                <div className="flex gap-2 flex-wrap items-center">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Leadership</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Public</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Speaking</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Communication</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Resposability</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Team Work</span>
                                    {isEditMode && (
                                        <button
                                            onClick={() => setShowSkillModal(true)}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            <IconCirclePlus stroke={2} className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Technologies */}
                            <div>
                                <h3 className="text-blue-600 font-semibold text-lg mb-6">Technologies :</h3>
                                <div className="flex gap-2 flex-wrap items-center">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">React</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Node.js</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">PostgreSQL</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">MySQL</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Docker</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Git</span>
                                    {isEditMode && (
                                        <button
                                            onClick={() => setShowTechModal(true)}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            <IconCirclePlus stroke={2} className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Domains */}
                            <div>
                                <h3 className="text-blue-600 font-semibold text-lg mb-6">Domains :</h3>
                                <div className="flex gap-2 flex-wrap items-center">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Web</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Mobile</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">Cloud</span>
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
                        </div>
                    </div>
                    
                    {/* Bottom Buttons */}
                    {isEditMode && (
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                            <Button 
                                onClick={handleEditToggle}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSave}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                            >
                                Save
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject/Ban Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Attention</h2>
                            <button 
                                onClick={() => setShowRejectModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <p className="text-gray-600 mb-4">Are u sure you want to reject or ban this user ?</p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Reason:
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Enter reason for rejection or ban..."
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white"
                                onClick={() => {
                                    // Handle ban logic here
                                    console.log('Ban user with reason:', rejectReason);
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                            >
                                Ban
                            </Button>
                            <Button 
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => {
                                    // Handle reject logic here
                                    console.log('Reject user with reason:', rejectReason);
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Skill Modal */}
            {showSkillModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Add Soft Skill</h2>
                            <button 
                                onClick={() => setShowSkillModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <input
                                type="text"
                                value={newSkillInput}
                                onChange={(e) => setNewSkillInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter skill name..."
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setShowSkillModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addSkill}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Technology Modal */}
            {showTechModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Add Technology</h2>
                            <button 
                                onClick={() => setShowTechModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <input
                                type="text"
                                value={newTechInput}
                                onChange={(e) => setNewTechInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTech()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter technology name..."
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setShowTechModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addTech}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add First Impression Modal */}
            {showImpressionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Add First Impression</h2>
                            <button 
                                onClick={() => setShowImpressionModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <input
                                type="text"
                                value={newImpressionInput}
                                onChange={(e) => setNewImpressionInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addImpression()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter impression..."
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setShowImpressionModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addImpression}
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
                                value={newDomainInput}
                                onChange={(e) => setNewDomainInput(e.target.value)}
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

            {/* Topic Selection Modal */}
            <TopicSelectionModal
                isOpen={showTopicModal}
                onClose={() => setShowTopicModal(false)}
                onSelectTopic={handleTopicSelection}
            />
        </div>
    );
};

export default CandidatesApplicationForm;
