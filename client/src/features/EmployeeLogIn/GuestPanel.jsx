// components/EmployeeLogIn/GuestPanel.jsx
import { useNavigate } from 'react-router-dom';
import TextField from './TextField';
import PrimaryButton from './PrimaryButton';
import ErrorAlert from './ErrorAlert';
import AnimatedBrandName from './AnimatedBrandName';

export default function GuestPanel({ name, onNameChange, onSubmit, error }) {
  const navigate = useNavigate();

  return (
    <div className="login-panel">
      <div className="login-panel__inner">
        <div className="login-header">
          <h2 className="login-header__title">
            Welcome to <AnimatedBrandName />
          </h2>
          <p className="login-header__subtitle">Please enter your name to continue</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          {error && <ErrorAlert message={error} />}

          <TextField
            id="guest-name"
            label="Full Name"
            placeholder="e.g. Thabo Mokoena"
            value={name}
            onChange={onNameChange}
            autoComplete="name"
          />

          <PrimaryButton type="submit">Login</PrimaryButton>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="back-to-login-link"
          >
            ← Back to employee sign in
          </button>
        </form>
      </div>
    </div>
  );
}