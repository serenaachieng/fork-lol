// components/login/ForgotPasswordLink.jsx
export default function ForgotPasswordLink({ href = "#" }) {
  return (
    <div className="forgot-password-row">
      <a href={href} className="forgot-password-link">
        Forgot Password?
      </a>
    </div>
  );
}