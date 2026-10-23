import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import DisclaimerBanner from '../ui/DisclaimerBanner';
import { ADMIN_NAV } from '../../utils/constants';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-command-950">
      <Sidebar navItems={ADMIN_NAV} title="Admin Console" subtitle="Coordination & analytics" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav portalLabel="Admin Console" portal="admin" />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-4">
            <DisclaimerBanner compact />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
