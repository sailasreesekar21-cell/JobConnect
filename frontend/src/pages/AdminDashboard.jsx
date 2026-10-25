import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function AdminDashboard() {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminApi.stats(),
      adminApi.users(),
      adminApi.recruiters(),
      adminApi.jobs(),
      adminApi.applications(),
    ])
      .then(([statsRes, usersRes, recruitersRes, jobsRes, appsRes]) => {
        setStats(statsRes.stats);
        setUsers(usersRes.users || []);
        setRecruiters(recruitersRes.recruiters || []);
        setJobs(jobsRes.jobs || []);
        setApplications(appsRes.applications || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const removeJob = async (id) => {
    if (!window.confirm('Delete this job listing?')) return;
    try {
      await adminApi.deleteJob(id);
      setJobs((current) => current.filter((job) => job._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <h1>Administrator dashboard</h1>
      <p>Server-side role checks protect these operations. Admin accounts are created with the create-admin script only.</p>
      <Alert type="error">{error}</Alert>
      <div className="row-actions" style={{ marginBottom: '1rem' }}>
        {['stats', 'users', 'recruiters', 'jobs', 'applications'].map((item) => (
          <button key={item} className={`btn ${tab === item ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>
      {tab === 'stats' && stats && (
        <div className="stats-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div className="card stat" key={key}>
              <p>{key}</p>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      )}
      {tab === 'users' && (
        <UserTable rows={users} />
      )}
      {tab === 'recruiters' && (
        <UserTable rows={recruiters} company />
      )}
      {tab === 'jobs' && (
        <div className="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Posted by</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.companyName}</td>
                  <td>{job.postedBy?.email}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => removeJob(job._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'applications' && (
        <div className="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Applicant</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item._id}>
                  <td>{item.job?.title}</td>
                  <td>{item.applicant?.email}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function UserTable({ rows, company }) {
  return (
    <div className="table-wrap panel">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {company && <th>Company</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {company && <td>{user.companyName}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
