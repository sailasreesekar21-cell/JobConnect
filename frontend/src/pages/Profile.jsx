import { useState } from 'react';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import Alert from '../components/Alert';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    skills: (user?.skills || []).join(', '),
    education: user?.education || '',
    experience: user?.experience || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    companyWebsite: user?.companyWebsite || '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      };
      const data = await userApi.updateProfile(payload);
      setUser(data.user);
      setMessage('Profile saved.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>User profile</h1>
      <p>Email cannot be changed here: {user?.email}</p>
      <Alert type="error">{error}</Alert>
      <Alert type="success">{message}</Alert>
      <form className="form panel" style={{ padding: '1.2rem' }} onSubmit={submit}>
        <label className="label">Name</label>
        <input name="name" required value={form.name} onChange={onChange} />
        <label className="label">Phone</label>
        <input name="phone" value={form.phone} onChange={onChange} />
        {user?.role === ROLES.JOB_SEEKER && (
          <>
            <label className="label">Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={onChange} />
            <label className="label">Education</label>
            <textarea name="education" value={form.education} onChange={onChange} />
            <label className="label">Experience</label>
            <textarea name="experience" value={form.experience} onChange={onChange} />
          </>
        )}
        {user?.role === ROLES.RECRUITER && (
          <>
            <label className="label">Company name</label>
            <input name="companyName" value={form.companyName} onChange={onChange} />
            <label className="label">Company website</label>
            <input name="companyWebsite" value={form.companyWebsite} onChange={onChange} />
            <label className="label">Company description</label>
            <textarea name="companyDescription" value={form.companyDescription} onChange={onChange} />
          </>
        )}
        <button className="btn btn-primary" type="submit">
          Save profile
        </button>
      </form>
    </>
  );
}
