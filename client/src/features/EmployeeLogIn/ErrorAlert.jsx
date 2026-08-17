// components/login/ErrorAlert.jsx
export default function ErrorAlert({ message }) {
  return (
    <div className="error-alert" role="alert">
      <p>{message}</p>
    </div>
  );
}