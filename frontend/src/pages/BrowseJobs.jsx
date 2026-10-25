import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { jobApi } from '../services/api';
import { JOB_CATEGORIES } from '../constants';

export default function BrowseJobs() {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    title: params.get('title') || '',
    company: params.get('company') || '',
    location: params.get('location') || '',
    category: params.get('category') || '',
  });

  useEffect(() => {
    setLoading(true);
    jobApi
      .list(filters)
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters.title, filters.company, filters.location, filters.category]);

  const update = (event) => {
    const next = { ...filters, [event.target.name]: event.target.value };
    setFilters(next);
    const query = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    setParams(query);
  };

  return (
    <section className="page">
      <div className="container">
        <p className="eyebrow">Search openings</p>
        <h1>Browse jobs</h1>
        <div className="panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div className="search-box" style={{ boxShadow: 'none', margin: 0 }}>
            <input name="title" placeholder="Title" value={filters.title} onChange={update} />
            <input name="company" placeholder="Company" value={filters.company} onChange={update} />
            <input name="location" placeholder="Location" value={filters.location} onChange={update} />
            <select name="category" value={filters.category} onChange={update}>
              <option value="">All categories</option>
              {JOB_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <Alert type="error">{error}</Alert>
        {loading ? (
          <Spinner />
        ) : jobs.length === 0 ? (
          <Alert>No jobs match these filters.</Alert>
        ) : (
          <div className="card-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
