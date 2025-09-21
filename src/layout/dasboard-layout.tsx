import { Outlet, useLocation } from 'react-router-dom';
import Menu from '../components/common/menu';
import Header from '../components/common/header';

// Helper to convert the last segment of the pathname into a human-readable title
const formatTitle = (path: string) =>
  path
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Dashboard';

const DashboardLayout = () => {
  const location = useLocation();
  const title = formatTitle(location.pathname);

  return (
        <div className="grid h-screen grid-cols-6 gap-x-6 overflow-hidden" style={{ backgroundColor: '#e5eeff' }}>
      {/* Sidebar */}
      <aside className="col-span-1 h-full" style={{ backgroundColor: '#c9daf8' }}>
        <Menu />
      </aside>

      {/* Main Content */}
            <main className="col-span-5 flex flex-col gap-6 overflow-y-auto pr-4 pt-5" style={{ backgroundColor: '#e5eeff' }}>
        <Header title={title} />
        <div className="flex-grow">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;