import { ModusWcButton, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';
import { openTrimbleWorkflows, TRIMBLE_WORKFLOWS_TEMPLATES_URL } from '../constants/workflows';

interface FlowsEmptyStateProps {
  onBrowseTemplates?: () => void;
}

export default function FlowsEmptyState({ onBrowseTemplates }: FlowsEmptyStateProps) {
  return (
    <section className="modus-empty-state workflows-empty-state" aria-labelledby="flows-empty-state-title">
      <div className="workflows-empty-state-illustration" aria-hidden="true">
        <ModusWcIcon decorative name="flowchart" size="lg" variant="solid" />
      </div>

      <ModusWcTypography
        hierarchy="h3"
        weight="semibold"
        customClass="workflows-empty-state-title"
      >
        <span id="flows-empty-state-title">No workflows created</span>
      </ModusWcTypography>

      <ModusWcTypography
        hierarchy="p"
        size="sm"
        customClass="workflows-empty-state-description"
      >
        Ready to create your first workflow?
      </ModusWcTypography>

      <ModusWcButton
        color="primary"
        variant="outlined"
        size="md"
        onButtonClick={() => {
          if (onBrowseTemplates) {
            onBrowseTemplates();
            return;
          }
          openTrimbleWorkflows(TRIMBLE_WORKFLOWS_TEMPLATES_URL);
        }}
      >
        See our templates
      </ModusWcButton>
    </section>
  );
}
