export function OrbitalHeart() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="16" cy="16" r="14" stroke="#0A7E72" strokeWidth="1.5" fill="none" opacity="0.2" />

      {/* Inner filled circle */}
      <circle cx="16" cy="16" r="9" fill="#E8F5F3" />

      {/* Heart mark */}
      <path
        d="M16 21.5c-0.3 0-0.5-0.1-0.7-0.3l-4.5-4.3C9.6 15.8 9 14.5 9 13.2c0-2 1.6-3.5 3.5-3.5c1.1 0 2.2 0.5 2.8 1.3L16 12l0.7-1c0.7-0.8 1.7-1.3 2.8-1.3c1.9 0 3.5 1.5 3.5 3.5c0 1.3-0.6 2.6-1.8 3.7l-4.5 4.3C16.5 21.4 16.3 21.5 16 21.5z"
        fill="#0A7E72"
      />

      {/* Orbital dots — static */}
      <circle cx="16" cy="3" r="1.5" fill="#0A7E72" opacity="0.4" />
      <circle cx="29" cy="16" r="1.5" fill="#0A7E72" opacity="0.4" />
      <circle cx="16" cy="29" r="1.5" fill="#0A7E72" opacity="0.4" />
      <circle cx="3" cy="16" r="1.5" fill="#0A7E72" opacity="0.4" />
    </svg>
  );
}
