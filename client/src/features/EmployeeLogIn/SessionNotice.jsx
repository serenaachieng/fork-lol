// components/login/SessionNotice.jsx
export default function SessionNotice({ message }) {
  return (
    <div className="session-notice" role="status">
      <p>{message}</p>
    </div>
  );
}