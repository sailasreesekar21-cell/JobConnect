import { useState } from 'react';
import { contactApi } from '../services/api';
import Alert from '../components/Alert';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await contactApi.send(form);
      setMessage(data.message);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="panel form-card">
        <h1>Contact us</h1>
        <p>Send a message to the project team. This form is for the academic demonstration.</p>
        <Alert type="error">{error}</Alert>
        <Alert type="success">{message}</Alert>
        <form className="form" onSubmit={submit}>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required value={form.name} onChange={onChange} />
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          <label className="label" htmlFor="message">Message</label>
          <textarea id="message" name="message" required value={form.message} onChange={onChange} />
          <button className="btn btn-primary" type="submit">Send message</button>
        </form>
      </div>
    </section>
  );
}
