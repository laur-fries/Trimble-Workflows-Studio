interface StudioProductFlowArrowProps {
  className?: string;
}

export default function StudioProductFlowArrow({
  className = 'studio-template-card-flow-arrow',
}: StudioProductFlowArrowProps) {
  return (
    <svg
      className={className}
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 8H16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 3L17 8L12 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
