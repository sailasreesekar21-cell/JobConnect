import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applicationApi } from '../services/api';
import { APPLICATION_STATUSES } from '../constants';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function ApplicantManagement() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    applicationApi
      .byJob(jobId)
      .then((data) => {
        setJob(data.job);
        setApplications(data.applications || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, [jobId]);

  const changeStatus = async (id, status) => {
    setError('');
    try {
      await applicationApi.updateStatus(id, status);
      setMessage('Status updated.');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <p className="eyebrow">Applicants</p>
      <h1>{job?.title}</h1>
      <Alert type="error">{error}</Alert>
      <Alert type="success">{message}</Alert>
      {applications.length === 0 ? (
        <Alert>No applications yet.</Alert>
      ) : (
        applications.map((item) => (
          <article className="card" key={item._id} style={{ marginBottom: '1rem' }}>
            <h3>{item.applicant?.name}</h3>
            <p>{item.applicant?.email} · {item.applicant?.phone}</p>
            <p><strong>Skills:</strong> {(item.applicant?.skills || []).join(', ') || 'Not added'}</p>
            <p><strong>Education:</strong> {item.applicant?.education || 'Not added'}</p>
            <p><strong>Experience:</strong> {item.applicant?.experience || 'Not added'}</p>
            <p>
              <strong>Resume:</strong>{' '}
              <a href={item.resumeUrl} target="_blank" rel="noreferrer">
                Open resume link
              </a>
            </p>
            <p>{item.coverLetter}</p>
            <label className="label">Status</label>
            <select value={item.status} onChange={(event) => changeStatus(item._id, event.target.value)}>
              {APPLICATION_STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </article>
        ))
      )}
    </>
  );
}
