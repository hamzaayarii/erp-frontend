import React, { useState, useEffect } from 'react';

interface Intern {
  name: string;
  avatar: string;
}

interface ProgressItem {
  id: number;
  task: string;
  project: string;
  interns: Intern[];
  supervisor: string;
  progressPercentage: number;
}

interface ProgressData {
  progress: ProgressItem[];
  totalProjectsUpdated: number;
}

const Progress = () => {
  const [progressData, setProgressData] = useState<ProgressData>({
    progress: [],
    totalProjectsUpdated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ProgressData.json');
        const jsonData = await response.json();
        setProgressData(jsonData);
      } catch (error) {
        console.error('Error loading data:', error);
        setProgressData({ progress: [], totalProjectsUpdated: 0 });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-auto w-full bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto w-full bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 mb-3">Progress</h1>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            {progressData.totalProjectsUpdated} projects updated
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wide">Task</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wide">Project</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wide">Intern</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wide">Supervisor</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 uppercase tracking-wide">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {progressData.progress.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                  {item.task}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {item.project}
                </td>
                <td className="py-4 px-6">
                  <div className="flex -space-x-2">
                    {item.interns.slice(0, 5).map((intern, index) => (
                      <div
                        key={index}
                        className="relative inline-block"
                        title={intern.name}
                      >
                        <img
                          src={intern.avatar}
                          alt={intern.name}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                        />
                      </div>
                    ))}
                    {item.interns.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
                        +{item.interns.length - 5}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                  {item.supervisor}
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="text-sm font-medium text-blue-500">
                      {item.progressPercentage}%
                    </span>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${item.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {progressData.progress.length === 0 && !loading && (
        <div className="py-12 text-center">
          <div className="text-gray-400 text-lg mb-2">No progress data available</div>
          <div className="text-gray-500 text-sm">Check back later for updates</div>
        </div>
      )}
    </div>
  );
};

export default Progress;