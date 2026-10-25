import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page">
      <div className="container" style={{ textAlign: 'center' }}>
        <h1>Page not found</h1>
        <p>The page you requested does not exist in JobConnect.</p>
        <Link className="btn btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
