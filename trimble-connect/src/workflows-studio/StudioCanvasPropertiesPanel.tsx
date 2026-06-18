import {
  ModusWcDivider,
  ModusWcIcon,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import WorkflowsPrimaryButton from '../components/WorkflowsPrimaryButton';
import type { WorkflowCanvasNode } from './data';
import type { StudioStepConfigField } from './stepConfigFields';

interface StudioCanvasPropertiesPanelProps {
  configFields: StudioStepConfigField[];
  configValues: Record<string, string>;
  hasNextStep: boolean;
  node: WorkflowCanvasNode;
  readOnly?: boolean;
  showFieldErrors?: boolean;
  showStepNavigation?: boolean;
  onClose: () => void;
  onConfigChange: (fieldId: string, value: string) => void;
  onNextStep: () => void;
}

export default function StudioCanvasPropertiesPanel({
  configFields,
  configValues,
  hasNextStep,
  node,
  readOnly = false,
  showFieldErrors = false,
  showStepNavigation = false,
  onClose,
  onConfigChange,
  onNextStep,
}: StudioCanvasPropertiesPanelProps) {
  return (
    <aside className="studio-canvas-properties-panel" aria-label="Node properties">
      <div className="studio-canvas-properties-panel-main">
        <div className="studio-canvas-properties-panel-header">
          <ModusWcTypography hierarchy="h5" weight="semibold" customClass="studio-canvas-properties-panel-title">
            Properties
          </ModusWcTypography>
        </div>

        <div className="studio-canvas-properties-panel-body">
          <div className="studio-canvas-properties-node-summary">
            <span className="studio-canvas-properties-node-icon">
              <ModusWcIcon decorative name={node.icon} size="md" variant="solid" />
            </span>
            <div className="studio-canvas-properties-node-copy">
              <ModusWcTypography hierarchy="h6" weight="semibold" customClass="studio-canvas-properties-node-title">
                {node.label}
              </ModusWcTypography>
              <p className="studio-canvas-properties-node-type">
                {node.isStarter ? 'Start trigger' : 'Workflow action'}
              </p>
            </div>
          </div>

          {readOnly && (
            <p className="studio-canvas-properties-readonly-notice">
              Configuration is locked in preview mode.
            </p>
          )}

          <ModusWcDivider customClass="studio-canvas-properties-divider" />

          {configFields.length > 0 ? (
            <section className="studio-canvas-properties-section" aria-labelledby="studio-step-config-heading">
              <h3 className="studio-canvas-properties-section-title" id="studio-step-config-heading">
                Configuration
              </h3>
              <div className="studio-canvas-properties-config-fields">
                {configFields.map((field) => {
                  const value = configValues[field.id] ?? '';
                  const hasError = showFieldErrors && !value.trim();

                  return (
                    <div key={field.id} className="studio-canvas-properties-config-field">
                      <ModusWcTextInput
                        bordered
                        disabled={readOnly}
                        feedback={
                          hasError
                            ? { level: 'error', message: 'This required field is missing' }
                            : undefined
                        }
                        inputId={`studio-step-field-${node.id}-${field.id}`}
                        label={field.label}
                        placeholder={field.placeholder}
                        required
                        size="md"
                        value={value}
                        onInputChange={(event: CustomEvent) => {
                          if (readOnly) {
                            return;
                          }

                          const nextValue = event.detail?.target?.value || '';
                          onConfigChange(field.id, nextValue);
                        }}
                      />
                      {field.helperText && !hasError && (
                        <p className="studio-canvas-properties-field-helper">{field.helperText}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <p className="studio-canvas-properties-section-copy">
              No additional configuration is required for this step.
            </p>
          )}
        </div>

        {showStepNavigation ? (
          <footer className="studio-canvas-properties-panel-footer workflows-flow-detail-footer workflows-step-config-panel-footer">
            <WorkflowsPrimaryButton fullWidth onClick={onNextStep}>
              {hasNextStep ? 'Next step' : 'Done'}
            </WorkflowsPrimaryButton>
          </footer>
        ) : null}
      </div>

      <button
        type="button"
        className="studio-canvas-properties-collapse-rail"
        aria-label="Collapse properties panel"
        onClick={onClose}
      >
        <ModusWcIcon decorative name="caret_right" size="sm" />
        <span className="studio-canvas-properties-collapse-label">Properties</span>
      </button>
    </aside>
  );
}
