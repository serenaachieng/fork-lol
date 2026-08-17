// components/common/AnimatedBrandName.jsx
export default function AnimatedBrandName({ word = 'Batches' }) {
  return (
    <span className="brand-name-accent" aria-label={word}>
      {word.split('').map((letter, i) => (
        <span
          key={i}
          className="letter-breathe"
          style={{ animationDelay: `${i * 0.12}s` }}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}