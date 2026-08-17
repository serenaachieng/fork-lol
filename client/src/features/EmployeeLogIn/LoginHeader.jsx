// components/EmployeeLogIn/LoginHeader.jsx
import AnimatedBrandName from './AnimatedBrandName';

export default function LoginHeader() {
  return (
    <div className="login-header">
      <h2 className="login-header__title">
        Welcome back to <AnimatedBrandName />
      </h2>
      <p className="login-header__subtitle">Sign in to continue</p>
    </div>
  );
}