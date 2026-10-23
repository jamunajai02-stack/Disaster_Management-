import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import DisclaimerBanner from '../ui/DisclaimerBanner';
import { USER_NAV } from '../../utils/constants';

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-command-950">
      <Sidebar navItems={USER_NAV} title="Citizen Portal" subtitle="Disaster monitoring & reporting" />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav portalLabel="User Portal" portal="user" />
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
