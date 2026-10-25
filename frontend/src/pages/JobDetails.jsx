import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jobApi, applicationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobApi
      .get(id)
      .then((data) => setJob(data.job))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const apply = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setNotice('');
    if (job.isDemo) {
      setNotice('Applications will be available when the backend is connected.');
      return;
    }
    try {
      await applicationApi.apply({ jobId: id, resumeUrl, coverLetter });
      setMessage('Application submitted. You can track it under My Applications.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (!job) return <section className="page"><div className="container"><Alert type="error">{error || 'Job not found.'}</Alert></div></section>;

  return (
    <section className="page">
      <div className="container two-col">
        <article className="panel" style={{ padding: '1.5rem' }}>
          {job.isDemo && <span className="badge demo">Demo Job</span>}
          <h1>{job.title}</h1>
          <p className="job-meta">
            <span>{job.companyName}</span>
            <span>{job.location}</span>
            <span>{job.jobType}</span>
            <span>{job.category}</span>
          </p>
          <p><strong>Salary:</strong> {job.salaryRange}</p>
          <p><strong>Experience:</strong> {job.experienceRequired}</p>
          <p><strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
          <p><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
          <h3>Description</h3>
          <p>{job.description}</p>
          <h3>Required skills</h3>
          <p>{(job.requiredSkills || []).join(', ') || 'Not specified'}</p>
        </article>
        <aside className="panel" style={{ padding: '1.5rem' }}>
          <h3>Apply for this job</h3>
          <Alert type="error">{error}</Alert>
          <Alert type="success">{message}</Alert>
          <Alert type="info">{notice}</Alert>
          {user?.role === ROLES.JOB_SEEKER ? (
            <form className="form" onSubmit={apply}>
              <label className="label" htmlFor="resumeUrl">Resume URL</label>
              <input
                id="resumeUrl"
                required
                placeholder="https://drive.google.com/..."
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
              <label className="label" htmlFor="coverLetter">Short note (optional)</label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Submit application</button>
            </form>
          ) : (
            <Alert>Log in as a job seeker to apply. Duplicate applications to the same job are blocked.</Alert>
          )}
        </aside>
      </div>
    </section>
  );
}
