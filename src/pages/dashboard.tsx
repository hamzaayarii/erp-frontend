import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Users, FileText, Briefcase, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Cards from '@/components/cards';
import Progress from '@/components/progress';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const programsData = [
  { name: 'Pg-01: Wellness Program', data: [2.5, 3.8644479930317774, 3.6336243615313872, 2.077401164737856, 1.015267837178601, 1.6890387738166037, 3.3109612261833954, 3.984732162821399, 2.9225988352621446, 1.3663756384686134, 1.1355520069682226, 2.499999999999999] },
  { name: 'Pg-01: Safety Program', data: [3.560660171779821, 3.9054245874996427, 2.6070087747988486, 1.1834815156491167, 1.2991881386134592, 2.8188479343294652, 3.965720298956739, 3.398916499767021, 1.7811265199199162, 1.0038218280846196, 1.975803730601354, 3.560660171779822] },
  { name: 'Pg-01: Training Program', data: [4.0, 3.1231225195028296, 1.5177088990820726, 1.0607605395782538, 2.286527742590072, 3.761880299246772, 3.7618802992467724, 2.2865277425900716, 1.060760539578254, 1.5177088990820713, 3.1231225195028296, 4.0] },
  { name: 'Pg-01: Rewards Program', data: [3.5606601717798214, 1.9758037306013523, 1.0038218280846198, 1.7811265199199142, 3.39891649976702, 3.9657202989567395, 2.8188479343294675, 1.2991881386134598, 1.183481515649117, 2.607008774798848, 3.9054245874996423, 3.5606601717798227] },
  { name: 'Pg-01: Recycling Program', data: [2.5, 1.1355520069682223, 1.3663756384686128, 2.9225988352621437, 3.984732162821399, 3.3109612261833963, 1.6890387738166046, 1.0152678371786006, 2.077401164737855, 3.6336243615313863, 3.8644479930317774, 2.500000000000001] },
];

const productsData = [
  { name: 'Pr-03: Product Pro', data: [2.5, 4.319263990709037, 4.011499148708516, 1.9365348863171412, 0.5203571162381346, 1.4187183650888051, 3.5812816349111944, 4.479642883761866, 3.06346511368286, 0.9885008512914846, 0.6807360092909633, 2.499999999999999] },
  { name: 'Pr-03: Product Line A', data: [3.6755705045849463, 4.460165122184787, 2.952993534851529, 0.9161955081554503, 0.7311341380043712, 2.614177621725536, 4.363728058422904, 3.934263609517929, 1.8279012135691401, 0.5073365382746173, 1.5165341507087926, 3.6755705045849454] },
  { name: 'Pr-03: Product Max', data: [4.402113032590307, 3.8523498005480388, 1.7214597873652173, 0.5008156143436215, 1.617557797513557, 3.766024907617741, 4.4342937094039145, 2.84104438526525, 0.8490562060744524, 0.787301939496821, 2.7279828197810816, 4.402113032590307] },
  { name: 'Pr-03: Product Beta', data: [4.402113032590307, 2.727982819781081, 0.7873019394968217, 0.8490562060744518, 2.8410443852652474, 4.4342937094039145, 3.7660249076177417, 1.6175577975135598, 0.5008156143436215, 1.721459787365215, 3.8523498005480388, 4.402113032590307] },
  { name: 'Pr-03: Product Alpha', data: [3.6755705045849467, 1.5165341507087922, 0.5073365382746173, 1.827901213569139, 3.9342636095179264, 4.363728058422905, 2.6141776217255375, 0.7311341380043725, 0.9161955081554494, 2.952993534851527, 4.460165122184787, 3.675570504584947] },
];

const topicsData = [
  { name: 'Tp-01: Topic Spark', data: [3.799038105676658, 3.7218639280755035, 2.2161231334593845, 1.0422826475146878, 1.5727615206690917, 3.187339782591115, 3.9983010087745123, 3.057493683490492, 1.4648814827768315, 1.0824987719279973, 2.3574159350437274, 3.799038105676658] },
  { name: 'Tp-01: Topic Delta', data: [3.799038105676658, 2.3574159350437265, 1.0824987719279975, 1.464881482776831, 3.0574936834904913, 3.998301008774512, 3.1873397825911174, 1.5727615206690924, 1.0422826475146871, 2.2161231334593823, 3.721863928075503, 3.799038105676659] },
  { name: 'Tp-01: Topic Nova', data: [2.5, 1.1355520069682223, 1.3663756384686128, 2.9225988352621437, 3.984732162821399, 3.3109612261833963, 1.6890387738166046, 1.0152678371786006, 2.077401164737855, 3.6336243615313863, 3.8644479930317774, 2.500000000000001] },
  { name: 'Tp-01: Topic Green', data: [1.2009618943233424, 1.2781360719244963, 2.7838768665406137, 3.957717352485312, 3.4272384793309083, 1.8126602174088862, 1.001698991225488, 1.9425063165095076, 3.535118517223168, 3.9175012280720027, 2.6425840649562757, 1.2009618943233433] },
  { name: 'Tp-01: Topic Blue', data: [1.200961894323342, 2.6425840649562744, 3.9175012280720027, 3.535118517223169, 1.9425063165095087, 1.001698991225488, 1.8126602174088848, 3.4272384793309074, 3.9577173524853126, 2.7838768665406177, 1.2781360719244954, 1.2009618943233424] },
];

const projectsData = [
  { name: 'DW09: Project Spark', data: [2.5, 3.6336243615313872, 3.984732162821399, 3.3109612261833967, 2.077401164737856, 1.135552006968223, 1.1355520069682221, 2.0774011647378554, 3.3109612261833954, 3.9847321628213987, 3.633624361531389, 2.5000000000000004] },
  { name: 'DW09: Project Delta', data: [3.25, 3.97289304589406, 3.679079642114181, 2.571372873735614, 1.414398942842395, 1.006792116140373, 1.6299146356432026, 2.8536384032641413, 3.833253172982385, 3.89255189952411, 2.9906019449761354, 1.7500000000000013] },
  { name: 'DW09: Project Nova', data: [3.799038105676658, 3.9175012280720027, 3.0574936834904918, 1.8126602174088846, 1.0422826475146878, 1.2781360719244954, 2.3574159350437247, 3.5351185172231676, 3.9983010087745123, 3.4272384793309083, 2.2161231334593863, 1.200961894323342] },
  { name: 'DW09: Project Green', data: [4.0, 3.482291100917928, 2.2865277425900725, 1.238119700753228, 1.0607605395782538, 1.876877480497169, 3.1231225195028287, 3.9392394604217458, 3.7618802992467724, 2.7134722574099293, 1.5177088990820744, 1.0] },
  { name: 'DW09: Project Sunrise', data: [3.799038105676658, 2.7838768665406155, 1.5727615206690926, 1.0016989912254881, 1.464881482776831, 2.6425840649562717, 3.7218639280755035, 3.9577173524853126, 3.1873397825911174, 1.9425063165095113, 1.0824987719279984, 1.2009618943233413] },
];

const colors = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [dropdownStates, setDropdownStates] = useState({
    programs: false,
    products: false,
    topics: false,
    projects: false
  });

  const [selectedData, setSelectedData] = useState({
    programs: [programsData[0].name],
    products: [productsData[0].name],
    topics: [topicsData[0].name],
    projects: [projectsData[0].name]
  });

  const toggleDropdown = (chart) => {
    setDropdownStates(prev => ({
      ...prev,
      [chart]: !prev[chart]
    }));
  };

  const handleDataToggle = (chartType, name) => {
    setSelectedData(prev => ({
      ...prev,
      [chartType]: prev[chartType].includes(name) 
        ? prev[chartType].filter(n => n !== name)
        : [...prev[chartType], name]
    }));
  };

  const getChartData = (dataSource: Array<{ name: string; data: number[]; color?: string }>, chartSelectedData: string[]) => {
    return months.map((month, i) => {
      const obj: { [key: string]: string | number } = { month };
      chartSelectedData.forEach(name => {
        const item = dataSource.find(p => p.name === name);
        if (item) obj[name] = item.data[i];
      });
      return obj;
    });
  };

  const ChartCard = ({ title, subtitle, chartKey, dataSource }: {
    title: string;
    subtitle: string;
    chartKey: 'programs' | 'products' | 'topics' | 'projects';
    dataSource: Array<{ name: string; data: number[]; color?: string }>;
  }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const chartData = React.useMemo(() => {
      const chartSelectedData = selectedData[chartKey] || [];
      return getChartData(dataSource, chartSelectedData);
    }, [chartKey, dataSource, selectedData[chartKey]]);
    const isDropdownOpen = dropdownStates[chartKey];
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownStates(prev => ({ ...prev, [chartKey]: false }));
        }
      };

      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isDropdownOpen, chartKey]);
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => toggleDropdown(chartKey)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              P1 <ChevronDown size={16} />
            </button>
            
            {dropdownStates[chartKey] && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-10 w-64 max-h-60 overflow-y-auto">
                {dataSource.map((item) => (
                  <label key={item.name} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2" onClick={() => handleDataToggle(chartKey, item.name)}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      selectedData[chartKey].includes(item.name) 
                        ? 'bg-gray-800 border-2 border-gray-800' 
                        : 'bg-white border-2 border-gray-400'
                    }`}>
                      {selectedData[chartKey].includes(item.name) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-base text-gray-700 font-medium">
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis 
                domain={[0, 5]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              {selectedData[chartKey].map((name, index) => (
                <Area
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen ">
      {/* Header Stats */}
      <Cards />

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8 mt-8">
        <ChartCard
          title="Programs"
          subtitle="Progress"
          chartKey="programs"
          dataSource={programsData}
        />
        <ChartCard
          title="Products"
          subtitle="Progress"
          chartKey="products"
          dataSource={productsData}
        />
        <ChartCard
          title="Topics"
          subtitle="Progress"
          chartKey="topics"
          dataSource={topicsData}
        />
        <ChartCard
          title="Projects"
          subtitle="Progress"
          chartKey="projects"
          dataSource={projectsData}
        />
      </div>

      <Progress />

    </div>
  );
};

export default Dashboard;