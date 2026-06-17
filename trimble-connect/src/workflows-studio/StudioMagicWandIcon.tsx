interface StudioMagicWandIconProps {
  className?: string;
}

export default function StudioMagicWandIcon({ className }: StudioMagicWandIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="studio-magic-wand-gradient" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00d4e8" />
          <stop offset="48%" stopColor="#5b5ce6" />
          <stop offset="100%" stopColor="#e040fb" />
        </linearGradient>
      </defs>

      <path
        d="M6.02 7.57a.75.75 0 0 1-.59-.59L5 4.82l-.43 2.16c-.06.3-.29.53-.59.59L1.82 8l2.16.43c.3.06.53.29.59.59L5 11.18l.43-2.16c.06-.3.29-.53.59-.59L8.18 8z"
        fill="#00d4e8"
      />
      <path
        d="M11.68 3.71a.49.49 0 0 1-.39-.39L11 1.88l-.29 1.44a.49.49 0 0 1-.39.39L8.88 4l1.44.29c.2.04.35.19.39.39L11 6.12l.29-1.44c.04-.2.19-.35.39-.39L13.12 4z"
        fill="#6b5ce7"
      />
      <path
        d="m21.12 14-1.44.29a.49.49 0 0 0-.39.39L19 16.12l-.29-1.44a.49.49 0 0 0-.39-.39L16.88 14l1.44-.29c.2-.04.35-.19.39-.39l.29-1.44.29 1.44c.04.2.19.35.39.39z"
        fill="#e040fb"
      />
      <path
        d="M18.72 3.52 20.49 5.29c.39.39.39 1.02 0 1.41L6.7 20.49a.996.996 0 0 1-1.41 0l-1.77-1.77a.996.996 0 0 1 0-1.41L17.3 3.51a.996.996 0 0 1 1.41 0Zm-.71 1.41L14.3 8.64l1.06 1.06 3.71-3.71z"
        fill="url(#studio-magic-wand-gradient)"
      />
    </svg>
  );
}
