import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import Alert from '../components/Alert';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await authApi.login(form);
      login(data.token, data.user);
      const fallback =
        data.user.role === ROLES.ADMIN
          ? '/admin'
          : data.user.role === ROLES.RECRUITER
            ? '/recruiter'
            : '/dashboard';
      navigate(location.state?.from || fallback);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="panel form-card">
        <h1>Login</h1>
        <p>Use the email and password you created during registration.</p>
        <Alert type="error">{error}</Alert>
        <form className="form" onSubmit={submit}>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={onChange} />
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
        <p>
          New job seeker? <Link to="/register/seeker">Create an account</Link>
        </p>
        <p>
          Hiring? <Link to="/register/recruiter">Recruiter registration</Link>
        </p>
      </div>
    </section>
  );
}
