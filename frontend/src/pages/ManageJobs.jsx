import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    jobApi
      .mine()
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this job listing and its applications?')) return;
    try {
      await jobApi.remove(id);
      setJobs((current) => current.filter((job) => job._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="section-head">
        <h1>Manage jobs</h1>
        <Link className="btn btn-primary" to="/recruiter/jobs/new">
          Post a job
        </Link>
      </div>
      <Alert type="error">{error}</Alert>
      {jobs.length === 0 ? (
        <Alert>You have not posted any jobs yet.</Alert>
      ) : (
        <div className="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Deadline</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.jobType}</td>
                  <td>{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                  <td className="row-actions">
                    <Link className="btn btn-outline" to={`/recruiter/jobs/${job._id}/applicants`}>
                      Applicants
                    </Link>
                    <Link className="btn btn-outline" to={`/recruiter/jobs/${job._id}/edit`}>
                      Edit
                    </Link>
                    <button className="btn btn-danger" onClick={() => remove(job._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
