import type { StudioProductKey } from './studioProductIcons';

interface StudioProductIconProps {
  product: StudioProductKey;
  className?: string;
}

export default function StudioProductIcon({ product, className = 'studio-product-icon' }: StudioProductIconProps) {
  if (product === 'projectsight') {
    return (
      <svg
        className={className}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16.0002 22.9578C19.5988 22.9578 22.5161 20.0708 22.5161 16.5096C22.5161 12.9483 19.5988 10.0613 16.0002 10.0613C12.4016 10.0613 9.4843 12.9483 9.4843 16.5096C9.4843 20.0708 12.4016 22.9578 16.0002 22.9578Z"
          fill="#0063A3"
        />
        <path
          d="M19.4204 8L18.1211 9.3426C21.2357 10.2503 23.5287 13.1057 23.5287 16.4905C23.5287 19.8754 21.2548 22.7308 18.1211 23.6573L19.4204 24.9999L28 16.4716L19.4204 8Z"
          fill="#0063A3"
        />
        <path
          d="M12.5796 24.9999L13.8789 23.6573C10.7452 22.7497 8.47132 19.8943 8.47132 16.5094C8.47132 13.1246 10.7452 10.2692 13.8789 9.3426L12.5796 8L4 16.5283L12.5796 24.9999Z"
          fill="#0063A3"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.9994 3L28 9.74999V14.25L22.6667 17.2504V12.7504L10.666 6.0004L15.9994 3Z"
        fill="#0063A3"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.9995 23.25L15.9989 30L11.9995 27.7512V21.7504L15.9989 24.0004L27.9995 17.2504V23.25Z"
        fill="#0063A3"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 23.25V9.74997L7.99815 7.49877L13.3327 10.4992L9.3321 12.7492L9.33334 26.2504L4 23.25Z"
        fill="#0063A3"
      />
    </svg>
  );
}
