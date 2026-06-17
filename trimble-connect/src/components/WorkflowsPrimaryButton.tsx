import type { ReactNode } from 'react';
import { ModusWcLoader } from '@trimble-oss/moduswebcomponents-react';

interface WorkflowsPrimaryButtonProps {
  children: ReactNode;
  onClick: () => void;
  customClass?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
}

export default function WorkflowsPrimaryButton({
  children,
  onClick,
  customClass = '',
  disabled = false,
  loading = false,
  loadingLabel = 'Turning on…',
  fullWidth = false,
}: WorkflowsPrimaryButtonProps) {
  return (
    <button
      type="button"
      className={`workflows-primary-btn ${fullWidth ? 'workflows-primary-btn--full' : ''} ${customClass}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <ModusWcLoader variant="spinner" size="sm" color="neutral" customClass="workflows-primary-btn-loader" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
