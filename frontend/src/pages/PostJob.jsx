import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobApi } from '../services/api';
import { JOB_CATEGORIES, JOB_TYPES } from '../constants';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const empty = {
  title: '',
  companyName: '',
  location: '',
  jobType: 'Full-time',
  category: 'Information Technology',
  salaryRange: '',
  description: '',
  requiredSkills: '',
  experienceRequired: '',
  applicationDeadline: '',
};

export default function PostJob() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...empty, companyName: user?.companyName || '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    jobApi
      .get(id)
      .then((data) => {
        const job = data.job;
        setForm({
          title: job.title,
          companyName: job.companyName,
          location: job.location,
          jobType: job.jobType,
          category: job.category,
          salaryRange: job.salaryRange,
          description: job.description,
          requiredSkills: (job.requiredSkills || []).join(', '),
          experienceRequired: job.experienceRequired,
          applicationDeadline: job.applicationDeadline?.slice(0, 10),
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const payload = () => ({
    ...form,
    requiredSkills: form.requiredSkills
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    applicationDeadline: new Date(form.applicationDeadline).toISOString(),
  });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (id) {
        await jobApi.update(id, payload());
      } else {
        await jobApi.create(payload());
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>{id ? 'Edit job' : 'Post a job'}</h1>
      <Alert type="error">{error}</Alert>
      <form className="form panel" style={{ padding: '1.2rem' }} onSubmit={submit}>
        <label className="label">Job title</label>
        <input name="title" required value={form.title} onChange={onChange} />
        <label className="label">Company name</label>
        <input name="companyName" required value={form.companyName} onChange={onChange} />
        <label className="label">Location</label>
        <input name="location" required value={form.location} onChange={onChange} />
        <label className="label">Job type</label>
        <select name="jobType" value={form.jobType} onChange={onChange}>
          {JOB_TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <label className="label">Category</label>
        <select name="category" value={form.category} onChange={onChange}>
          {JOB_CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <label className="label">Salary range</label>
        <input name="salaryRange" required value={form.salaryRange} onChange={onChange} />
        <label className="label">Required skills (comma separated)</label>
        <input name="requiredSkills" value={form.requiredSkills} onChange={onChange} />
        <label className="label">Experience requirements</label>
        <input name="experienceRequired" required value={form.experienceRequired} onChange={onChange} />
        <label className="label">Application deadline</label>
        <input name="applicationDeadline" type="date" required value={form.applicationDeadline} onChange={onChange} />
        <label className="label">Job description</label>
        <textarea name="description" required value={form.description} onChange={onChange} />
        <button className="btn btn-primary" type="submit">
          {id ? 'Save changes' : 'Publish job'}
        </button>
      </form>
    </>
  );
}
