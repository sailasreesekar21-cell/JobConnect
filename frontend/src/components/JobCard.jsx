import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <article className="card">
      <div className="row-actions">
        <span className="badge">{job.jobType}</span>
        {job.isDemo && <span className="badge demo">Demonstration listing</span>}
      </div>
      <h3>{job.title}</h3>
      <p className="job-meta">
        <span>{job.companyName}</span>
        <span>· {job.location}</span>
        <span>· {job.category}</span>
      </p>
      <p>{job.salaryRange}</p>
      <div className="row-actions">
        <Link className="btn btn-primary" to={`/jobs/${job._id}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
