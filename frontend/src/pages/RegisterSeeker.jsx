import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function RegisterSeeker() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await authApi.register({ ...form, role: 'jobseeker' });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="panel form-card">
        <h1>Job seeker registration</h1>
        <p>Create an account to search jobs and submit applications.</p>
        <Alert type="error">{error}</Alert>
        <form className="form" onSubmit={submit}>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" required value={form.name} onChange={onChange} />
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={onChange} />
          <label className="label" htmlFor="password">Password (min 8 characters)</label>
          <input id="password" name="password" type="password" minLength={8} required value={form.password} onChange={onChange} />
          <button className="btn btn-primary" type="submit">Create account</button>
        </form>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
