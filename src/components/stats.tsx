import AreaChart1 from './areaChart';
import BarChart1 from './barChart';

const Stats = () => {
  return (
    <div className="flex flex-row  h-60 gap-4">
      <BarChart1 />
      <AreaChart1 />
    </div>
  );
};

export default Stats;
