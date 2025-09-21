import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

interface ChartDataPoint {
  month: string;
  value: number;
}

interface FilterItem {
  id: string;
  name: string;
}

interface StatChartProps {
  title: string;
  data: ChartDataPoint[];
  filters: FilterItem[];
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
}

const StatChart: React.FC<StatChartProps> = ({ 
  title, 
  data, 
  filters, 
  selectedFilter, 
  onFilterChange 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  // Generate SVG path for the area chart
  const generatePath = () => {
    const width = 400;
    const height = 200;
    const padding = 20;
    
    const xStep = (width - 2 * padding) / (data.length - 1);
    const yScale = (height - 2 * padding) / (maxValue - minValue);
    
    let path = '';
    let areaPath = '';
    
    data.forEach((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (point.value - minValue) * yScale;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
        areaPath += `M ${x} ${height - padding}`;
        areaPath += ` L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
        areaPath += ` L ${x} ${y}`;
      }
    });
    
    // Close the area path
    areaPath += ` L ${padding + (data.length - 1) * xStep} ${height - padding} Z`;
    
    return { linePath: path, areaPath };
  };

  const { linePath, areaPath } = generatePath();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
          >
            {selectedFilter}
            <IconChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-48 overflow-y-auto">
              <div className="p-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      onFilterChange(filter.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedFilter === filter.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {filter.id} : {filter.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-48 relative">
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Y-axis grid lines */}
          {[0, 25, 50, 75, 100].map((value) => (
            <line
              key={value}
              x1="20"
              y1={180 - (value / 100) * 160}
              x2="380"
              y2={180 - (value / 100) * 160}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill={`url(#gradient-${title})`}
          />
          
          {/* Main line */}
          <path
            d={linePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = 20 + index * (360 / (data.length - 1));
            const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160;
            return (
              <circle
                key={`${point.month}-${point.value}`}
                cx={x}
                cy={y}
                r="3"
                fill="#10B981"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          
          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = 20 + index * (360 / (data.length - 1));
            return (
              <text
                key={`label-${point.month}`}
                x={x}
                y="195"
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {point.month}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default StatChart;
