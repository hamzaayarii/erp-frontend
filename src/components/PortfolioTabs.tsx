import { useNavigate } from 'react-router-dom';

interface PortfolioTabsProps {
  currentPage?: 'programs' | 'products' | 'projects';
}

export const PortfolioTabs = ({ currentPage }: PortfolioTabsProps) => {
  const navigate = useNavigate();

  const tabs = [
    { key: 'programs', label: 'programs', path: '/dashboard/programs' },
    { key: 'products', label: 'Products', path: '/dashboard/products' },
    { key: 'projects', label: 'Projects', path: '/dashboard/projects' }
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Custom Tab Implementation */}
      <div className="flex mb-1">
        {tabs.map((tab) => (
          <div key={tab.key} className="w-1/3 text-center">
            <span className={`font-semibold ${currentPage === tab.key ? 'text-gray-900' : 'text-gray-500'}`}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* Clickable Bar with Separators */}
      <div className="flex w-full h-2 cursor-pointer">
        {tabs.map((tab, index) => (
          <div key={tab.key} className="flex w-1/3">
            <div
              className={`flex-1 h-full transition-all duration-200 ${
                currentPage === tab.key 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200 hover:bg-gray-300 hover:scale-y-150'
              }`}
              onClick={() => handleTabClick(tab.path)}
            ></div>
            {/* Blue separator - show after first two tabs */}
            {index < tabs.length - 1 && (
              <div 
                className="w-2 h-full" 
                style={{ backgroundColor: '#4A74E0' }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
