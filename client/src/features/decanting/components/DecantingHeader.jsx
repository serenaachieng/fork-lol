// features/decanting/components/DecantingHeader.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

export default function DecantingHeader({ title = 'Decanting Plan' }) {
  const navigate = useNavigate();
  return (
    <header className="decanting-header">
      <button
        className="decanting-header__back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeftIcon className="size-5" />
      </button>
      <h1 className="decanting-header__title">{title}</h1>
    </header>
  );
}