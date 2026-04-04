export function OrbitalHeart() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          @keyframes orbital-rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .orbit {
            animation: orbital-rotate 20s linear infinite;
            transform-origin: 24px 24px;
          }
        `}</style>
      </defs>

      <circle cx="24" cy="24" r="20" stroke="#E5E7EB" strokeWidth="1" fill="none" />

      <g className="orbit">
        <circle cx="24" cy="8" r="3" fill="#1A6B5A" />
        <circle cx="40" cy="24" r="3" fill="#1A6B5A" />
        <circle cx="24" cy="40" r="3" fill="#1A6B5A" />
        <circle cx="8" cy="24" r="3" fill="#1A6B5A" />
      </g>

      <path
        d="M 24 17 Q 28 20 24 23 Q 20 20 24 17 Z"
        fill="#D94F5C"
        opacity="0.8"
      />
      <circle cx="24" cy="20" r="2" fill="#D94F5C" />
    </svg>
  );
}
