// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginHero from '../features/EmployeeLogIn/LogInHero';
import LoginPanel from '../features/EmployeeLogIn/LogInPanel';
import ForgotPasswordModal from '../features/EmployeeLogIn/ForgotPasswordModal';
import HeroLogin from  '../assets/hero_login.jpg';

const LoginPage = () => {
  const { login, sessionMessage } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // err.status is set by services/api.js.
  const getLoginErrorMessage = (err) => {
    if (err.isNetworkError || err.message === 'Failed to fetch') {
      return 'Could not reach the server. Check your connection and try again.';
    }
    if (err.status === 401) {
      // Never distinguish "no such user" from "wrong password" — that
      // would let an attacker enumerate valid usernames.
      return 'Incorrect username or password.';
    }
    if (err.status === 403) {
      // 403 is NOT a credential failure: password was correct, account
      // is deactivated. "Incorrect password" here would send someone
      // to reset a password that works fine.
      return err.message || 'This account cannot be used to log in.';
    }
    return err.message || 'Login failed. Please try again.';
  };

  // Sends managers and workers to their own landing screen instead
  // of everyone defaulting to /programmes.
  const redirectByRole = (loggedInUser) => {
    switch (loggedInUser?.role) {
      case 'manager':
        navigate('/manager');
        break;
      case 'worker':
      default:
        navigate('/programmes');
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await login(username.trim(), password);
      redirectByRole(loggedInUser);
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LoginHero image={HeroLogin} />

      <LoginPanel
        username={username}
        onUsernameChange={(e) => setUsername(e.target.value)}
        password={password}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onSubmit={handleSubmit}
        onForgotPassword={() => setShowForgotPassword(true)}
        onGuestLogin={() => navigate('/guest')}
        error={error}
        sessionMessage={sessionMessage}
        isLoading={isLoading}
      />

      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default LoginPage;