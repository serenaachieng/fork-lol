// components/login/LoginForm.jsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ForgotPasswordLink from './ForgotPasswordLink';
import SessionNotice from './SessionNotice';
import ErrorAlert from './ErrorAlert';

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 1 12s4 7 11 7a9.74 9.74 0 0 0 5.39-1.61" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export default function LoginForm({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onGuestLogin,
  error,
  sessionMessage,
  isLoading,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="login-form" onSubmit={onSubmit}>
      {!error && sessionMessage && <SessionNotice message={sessionMessage} />}
      {error && <ErrorAlert message={error} />}

      <div className="login-form__field">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="e.g. WORKER123"
          value={username}
          onChange={onUsernameChange}
          autoComplete="username"
          disabled={isLoading}
        />
      </div>

      <div className="login-form__field login-form__field--password">
        <Label htmlFor="password">Password</Label>
        <div className="login-form__password-wrapper">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={onPasswordChange}
            autoComplete="current-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="login-form__password-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            disabled={isLoading}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="forgot-password-row">
        <button type="button" onClick={onForgotPassword} className="forgot-password-link">
          Forgot Password?
        </button>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Verifying...' : 'Login'}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onGuestLogin}
        disabled={isLoading}
        className="w-full"
      >
        Login as Guest
      </Button>

      <p className="login-form__footer">Authorised personnel only</p>
    </form>
  );
}