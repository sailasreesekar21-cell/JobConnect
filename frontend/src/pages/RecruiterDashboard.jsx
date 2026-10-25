import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    jobApi
      .mine()
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <p className="eyebrow">Recruiter</p>
      <h1>{user?.companyName || user?.name}</h1>
      <p>Post vacancies, manage your listings, and review applicants.</p>
      <Alert type="error">{error}</Alert>
      <div className="stats-grid">
        <div className="card stat">
          <p>Jobs posted</p>
          <strong>{jobs.length}</strong>
        </div>
      </div>
      <div className="row-actions" style={{ marginTop: '1rem' }}>
        <Link className="btn btn-primary" to="/recruiter/jobs/new">
          Post a job
        </Link>
        <Link className="btn btn-outline" to="/recruiter/jobs">
          Manage jobs
        </Link>
      </div>
    </>
  );
}
