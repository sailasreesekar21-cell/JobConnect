import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationApi
      .mine()
      .then((data) => setApplications(data.applications || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <h1>My applications</h1>
      <Alert type="error">{error}</Alert>
      {applications.length === 0 ? (
        <Alert>You have not applied for any jobs yet.</Alert>
      ) : (
        <div className="card-grid">
          {applications.map((item) => (
            <article className="card" key={item._id}>
              <span className={`badge ${item.status}`}>{item.status}</span>
              <h3>{item.job?.title || 'Job removed'}</h3>
              <p>{item.job?.companyName}</p>
              <p>Applied on {new Date(item.createdAt).toLocaleDateString()}</p>
              {item.job?._id && (
                <Link className="btn btn-outline" to={`/jobs/${item.job._id}`}>
                  View job
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
