// components/login/LoginHero.jsx
import heroImage from '../../assets/LOL_Logo.jpg';

export default function LoginHero() {
  return (
    <div className="login-hero">
      <img
        src={heroImage}
        alt="Warehouse logistics operations"
        className="login-hero__image"
      />
      <div className="login-hero__overlay" />
    </div>
  );
}