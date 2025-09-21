import React from 'react';

interface Intern {
  name: string;
  avatar: string;
}

interface ProgressItem {
  id: string;
  task: string;
  project: string;
  interns: Intern[];
  supervisor: string;
}

interface ProgressTableProps {
  items: ProgressItem[];
}

const ProgressTable: React.FC<ProgressTableProps> = ({ items }) => {
  const getAvatarColor = (avatar: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[avatar.charCodeAt(0) % colors.length];
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-gray-900">
          {items.length} projects updated
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Task</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Project</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Intern</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Supervisor</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm text-gray-900">{item.task}</td>
                <td className="py-4 px-4 text-sm text-gray-900 font-medium">{item.project}</td>
                <td className="py-4 px-4">
                  <div className="flex -space-x-2">
                    {item.interns.map((intern) => (
                      <div
                        key={`${item.id}-${intern.name}`}
                        className={`w-8 h-8 rounded-full ${getAvatarColor(intern.avatar)} flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
                        title={intern.name}
                      >
                        {intern.avatar}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.supervisor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTable;
