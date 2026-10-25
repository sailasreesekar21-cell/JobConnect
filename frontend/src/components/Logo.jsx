import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark">JC</span>
      <span>JobConnect</span>
    </Link>
  );
}
