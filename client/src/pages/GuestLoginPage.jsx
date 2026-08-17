// src/pages/GuestLoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiPost } from '../services/api';
import LoginHero from '../features/EmployeeLogIn/LogInHero';
import GuestPanel from '../features/EmployeeLogIn/GuestPanel';
import hero_login from '../assets/hero_login.jpg';

const GuestLoginPage = () => {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    // Fire-and-forget: a failed audit write must never lock a
    // volunteer out of the system at the gate.
    try {
      await apiPost('/api/volunteers/sign-in', { name: name.trim() });
    } catch (err) {
      console.error('Guest sign-in not recorded:', err);
    }

    loginAsGuest(name.trim());
    navigate('/guest-home', { replace: true });
  };

  return (
    <div className="login-page">
      <LoginHero image={hero_login} />

      <GuestPanel
        name={name}
        onNameChange={handleNameChange}
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
};

export default GuestLoginPage;