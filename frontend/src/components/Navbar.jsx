import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { ROLES } from '../constants';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === ROLES.ADMIN
      ? '/admin'
      : user?.role === ROLES.RECRUITER
        ? '/recruiter'
        : '/dashboard';

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/jobs">Browse Jobs</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <NavLink className="btn btn-outline" to={dashboardPath}>
                Dashboard
              </NavLink>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink className="btn btn-outline" to="/login">
                Login
              </NavLink>
              <NavLink className="btn btn-primary" to="/register/seeker">
                Get started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
