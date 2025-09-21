import { useEffect, useState } from "react";
import { Intern, columns } from "@/components/views/interns/columns";
import { DataTable } from "../components/views/candidates/dataTable";

import { Button } from "@/components/ui/button";
import { IconFilter2 } from '@tabler/icons-react';
import { useTableStore ,IconEye} from '@/store/tableStore';

async function getData(): Promise<Intern[]> {
    try {
        const response = await fetch('/data/InternsData.json');
        const jsonData = await response.json();
        const allInterns = jsonData.interns || [];
        // Filter for active interns (non-Finished status)
        return allInterns.filter((intern: Intern) => intern.internshipStatus !== "Finished");
    } catch (error) {
        console.error('Error loading interns data:', error);
        return [];
    }
}
async function getArchiveData(): Promise<Intern[]> {
    try {
        const response = await fetch('/data/InternsData.json');
        const jsonData = await response.json();
        const allInterns = jsonData.interns || [];
        // Filter for archived interns (Finished status)
        return allInterns.filter((intern: Intern) => intern.internshipStatus === "Finished");
    } catch (error) {
        console.error('Error loading archive interns data:', error);
        return [];
    }
}

export default function Interns() {
    const [data, setData] = useState<Intern[]>([]);
    const { activeTab, setActiveTab } = useTableStore();
    const tab = activeTab.interns || 'active';

    const handleSetActiveTab = (newTab: 'active' | 'archive') => {
        setActiveTab('interns', newTab);
    };

    useEffect(() => {
        async function getTableData() {
            if (tab === "active") {
                const data = await getData();
                setData(data);
                return;
            } else {
                const data = await getArchiveData();
                setData(data);
                return;
            }
        }
        getTableData();
    }, [tab]);

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Interns</h1>                

                    <div>
                        <IconFilter2 className="w-6 h-6 cursor-pointer" />
                    </div>    
                </div>
                {/* Interns List Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 ml-4">Interns List</h2>
                            
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
                        <DataTable columns={columns} data={data.filter(intern => intern && intern.internshipStatus)} tableId="interns" />
                    </div>
                </div>
            </div>
        </div>
    );
}
