import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            JobConnect is an academic online job portal that helps job seekers and recruiters meet in
            one place.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <p><Link to="/jobs">Browse jobs</Link></p>
          <p><Link to="/about">About us</Link></p>
          <p><Link to="/contact">Contact</Link></p>
        </div>
        <div>
          <h4>Accounts</h4>
          <p><Link to="/register/seeker">Job seeker sign up</Link></p>
          <p><Link to="/register/recruiter">Recruiter sign up</Link></p>
          <p><Link to="/login">Login</Link></p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: support@jobconnect.local</p>
          <p>Phone: +91 90000 00000</p>
          <p>Bengaluru, India (sample campus address)</p>
        </div>
      </div>
      <div className="container copy">© {new Date().getFullYear()} JobConnect. BCA final-year academic project.</div>
    </footer>
  );
}
