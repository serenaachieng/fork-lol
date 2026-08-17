// components/login/LoginPanel.jsx
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';

export default function LoginPanel(props) {
  return (
    <div className="login-panel">
      <div className="login-panel__inner">
        <LoginHeader />
        <LoginForm {...props} />
      </div>
    </div>
  );
}