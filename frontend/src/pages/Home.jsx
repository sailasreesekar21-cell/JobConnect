import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { jobApi } from '../services/api';
import { JOB_CATEGORIES } from '../constants';

export default function Home() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobApi
      .list({ featured: 'true' })
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const search = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Online job portal</p>
            <h1>Find Your Dream Job</h1>
            <p>
              JobConnect brings together students, fresh graduates, and recruiters. Search openings,
              submit applications, and manage hiring from one beginner-friendly website.
            </p>
            <form className="search-box" onSubmit={search}>
              <input
                placeholder="Job title or keyword"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Job title"
              />
              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
              />
              <button className="btn btn-primary" type="submit">
                Search Jobs
              </button>
            </form>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Why JobConnect</p>
            <h3>A complete MERN stack campus project</h3>
            <p>Create an account, keep your profile updated, and apply with a resume link.</p>
            <p>Recruiters can post jobs, review applicants, and update application status.</p>
            <Link className="btn btn-outline" to="/about">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured listings</p>
              <h2>Jobs shared on JobConnect</h2>
            </div>
            <Link to="/jobs">View all jobs</Link>
          </div>
          <Alert type="error">{error}</Alert>
          {loading ? (
            <Spinner />
          ) : jobs.length === 0 ? (
            <Alert type="info">
              No jobs yet. Ask a recruiter to post a listing, or run the optional seed script for
              demonstration data.
            </Alert>
          ) : (
            <div className="card-grid">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Explore</p>
              <h2>Popular job categories</h2>
            </div>
          </div>
          <div className="cat-grid">
            {JOB_CATEGORIES.map((category) => (
              <Link key={category} className="cat" to={`/jobs?category=${encodeURIComponent(category)}`}>
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Simple process</p>
              <h2>How it works</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Create an account</h3>
              <p>Register as a job seeker or recruiter with your email and a strong password.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Build your profile</h3>
              <p>Add skills, education, and experience, or describe your company if you hire.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Apply or hire</h3>
              <p>Job seekers apply with a resume URL. Recruiters review and update application status.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container cta-grid">
          <div className="cta seeker">
            <h2>Looking for a job?</h2>
            <p>Create a free job seeker account and start applying in minutes.</p>
            <Link className="btn" style={{ background: 'white', color: '#1d4ed8' }} to="/register/seeker">
              Register as job seeker
            </Link>
          </div>
          <div className="cta recruiter">
            <h2>Hiring talent?</h2>
            <p>Post vacancies, manage listings, and track applicants from your dashboard.</p>
            <Link className="btn" style={{ background: 'white', color: '#0f2744' }} to="/register/recruiter">
              Register as recruiter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
