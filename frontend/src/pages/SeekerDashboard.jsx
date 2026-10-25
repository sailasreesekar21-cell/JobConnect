import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    applicationApi
      .mine()
      .then((data) => setApplications(data.applications || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <p className="eyebrow">Job seeker</p>
      <h1>Welcome, {user?.name}</h1>
      <p>Complete your profile, search jobs, and track application status from here.</p>
      <Alert type="error">{error}</Alert>
      <div className="stats-grid">
        <div className="card stat">
          <p>Applications</p>
          <strong>{applications.length}</strong>
        </div>
        <div className="card stat">
          <p>Pending</p>
          <strong>{applications.filter((item) => item.status === 'Pending').length}</strong>
        </div>
        <div className="card stat">
          <p>Shortlisted</p>
          <strong>{applications.filter((item) => item.status === 'Shortlisted').length}</strong>
        </div>
      </div>
      <div className="row-actions" style={{ marginTop: '1rem' }}>
        <Link className="btn btn-primary" to="/jobs">
          Browse jobs
        </Link>
        <Link className="btn btn-outline" to="/profile">
          Update profile
        </Link>
      </div>
    </>
  );
}
