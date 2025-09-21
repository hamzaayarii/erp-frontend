import logo from '../../assets/logo.jpg';
import { IoBuild, IoHome } from 'react-icons/io5';
import { SiGooglechat } from 'react-icons/si';
import { MdTopic } from 'react-icons/md';
import {
  BsFillBriefcaseFill,
  BsKanbanFill,
  BsPeopleFill,
  BsPersonBoundingBox,
  BsBarChartFill,
} from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Menu = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col gap-6 w-full min-h-screen p-4 pt-8" style={{ backgroundColor: '#c9daf8' }}>
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex flex-row items-center justify-center gap-3">
          <img src={logo} alt="logo" className="w-12 h-12" />
          <h1 className="font-bold text-[#2D3748] text-lg">3S ERP Internship</h1>
        </div>
        <hr className="w-4/5 border-white/30" />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col justify-center items-start gap-2 w-full">
        {list.map((item, index) =>
          item.state ? (
            <Link
              to={item.href}
              key={index}
              className={cn(
                'flex items-center gap-4 w-full p-2.5 group rounded-xl transition-all ease-in-out duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-sm',
                pathname === item.href && 'bg-white/30 backdrop-blur-sm shadow-md border border-white/40'
              )}
            >
              <div className="flex items-center gap-4 w-full">
                <div
                  className={cn(
                    'group-hover:bg-[#4A74E0] group-hover:text-white bg-white/80 text-[#4A74E0] rounded-xl p-2 relative shadow-sm transition-all duration-300',
                    pathname === item.href && 'bg-[#4A74E0] text-white shadow-md'
                  )}
                >
                  {item.icon}
                  {item.label === 'Chat' && (
                    <FaLock className="w-4 h-4 fill-[#E53E3E] absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
                  )}
                </div>
                <h1
                  className={cn(
                    'font-semibold group-hover:text-[#2D3748] text-[#2D3748]/70 transition-colors duration-300',
                    pathname === item.href && 'text-[#2D3748] font-bold'
                  )}
                >
                  {item.label}
                </h1>
              </div>
            </Link>
          ) : (
            <div
              key={index}
              className="flex items-center gap-4 w-full p-2.5 opacity-50"
            >
              <div className="bg-white/50 rounded-xl p-2 shadow-sm">
                {item.icon}
              </div>
              <h1 className="font-semibold text-[#2D3748]/50">{item.label}</h1>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const list = [
  {
    label: 'Dashboard',
    icon: <IoHome className="w-4 h-4 " />,
    state: true,
    href: '/dashboard',
  },
  {
    label: 'Staff',
    icon: <BsFillBriefcaseFill className="w-4 h-4 " />,
    state: true,
    href: '/dashboard/staff',
  },
  {
    label: 'Interns',
    icon: <BsPeopleFill className="w-4 h-4 " />,
    state: true,
    href: '/dashboard/interns',
  },
  {
    label: 'Portfolio',
    icon: <MdTopic className="w-4 h-4 " />,
    state: true,
    href: '/dashboard/portfolio',
  },
  {
    label: 'Topics',
    icon: <IoBuild className="w-4 h-4 " />,
    state: true,
    href: '/dashboard/topics',
  },
  {
    label: 'Candidates',
    icon: <BsPersonBoundingBox className="w-4 h-4 " />,
    state: true,
    href: '/dashboard/candidates',
  },
  {
    label: 'Chat',
    icon: <SiGooglechat className="w-4 h-4 " />,
    state: true,
    href: '/dashboard/chat',
  },
  {
    label: 'Kanban',
    icon: <BsKanbanFill className="w-4 h-4 " />,
    state: true,
    href: '/dashboard/kanban',
  },
];

export default Menu;