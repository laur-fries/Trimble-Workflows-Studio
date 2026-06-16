import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

interface FlowSuccessViewProps {
  title: string;
  onViewInFlows: () => void;
}

export default function FlowSuccessView({ title, onViewInFlows }: FlowSuccessViewProps) {
  return (
    <div className="workflows-success">
      <div className="workflows-success-icon" aria-hidden="true">
        <ModusWcIcon decorative name="check_circle" size="lg" variant="solid" />
      </div>
      <h3 className="workflows-success-title">Success!</h3>
      <p className="workflows-success-message">
        &ldquo;{title}&rdquo; is on and ready to work!
      </p>
      <button type="button" className="workflows-success-view-flows" onClick={onViewInFlows}>
        View in Flows
      </button>
    </div>
  );
}

export function FlowSuccessFooter({ onOpenStudio }: { onOpenStudio: () => void }) {
  return (
    <footer className="workflows-flow-detail-footer">
      <button type="button" className="workflows-primary-btn workflows-primary-btn--full" onClick={onOpenStudio}>
        <ModusWcIcon decorative name="launch" size="sm" />
        Do more in Trimble Workflows
      </button>
    </footer>
  );
}
