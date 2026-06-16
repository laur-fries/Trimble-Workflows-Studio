import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

interface StudioMyWorkflowsProps {
  onBrowseTemplates: () => void;
}

export default function StudioMyWorkflows({ onBrowseTemplates }: StudioMyWorkflowsProps) {
  return (
    <div className="studio-my-workflows">
      <div className="modus-empty-state studio-my-workflows-empty">
        <div className="studio-my-workflows-empty-illustration" aria-hidden="true">
          <ModusWcIcon decorative name="flowchart" size="lg" />
        </div>
        <h2 className="studio-my-workflows-empty-title">No workflows yet</h2>
        <p className="studio-my-workflows-empty-message">
          Workflows you create or turn on will appear here.
        </p>
        <button type="button" className="studio-my-workflows-empty-link" onClick={onBrowseTemplates}>
          Browse templates in Discover
        </button>
      </div>
    </div>
  );
}
