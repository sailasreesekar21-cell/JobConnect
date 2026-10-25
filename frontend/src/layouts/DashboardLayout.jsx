import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';

const menus = {
  [ROLES.JOB_SEEKER]: [
    { to: '/dashboard', label: 'Overview' },
    { to: '/jobs', label: 'Browse jobs' },
    { to: '/applications', label: 'My applications' },
    { to: '/profile', label: 'Profile' },
  ],
  [ROLES.RECRUITER]: [
    { to: '/recruiter', label: 'Overview' },
    { to: '/recruiter/jobs/new', label: 'Post a job' },
    { to: '/recruiter/jobs', label: 'Manage jobs' },
    { to: '/profile', label: 'Company profile' },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Admin dashboard' },
    { to: '/profile', label: 'Profile' },
  ],
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const links = menus[user?.role] || [];

  return (
    <div className="site">
      <Navbar />
      <div className="dashboard">
        <aside className="sidebar">
          <p className="eyebrow">Signed in as</p>
          <h3>{user?.name}</h3>
          <p>{user?.role}</p>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to.split('/').length <= 2}>
              {item.label}
            </NavLink>
          ))}
        </aside>
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
