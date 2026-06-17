import {
  ModusWcDivider,
  ModusWcIcon,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import type { WorkflowCanvasNode } from './data';
import type { StudioStepConfigField } from './stepConfigFields';

interface StudioCanvasPropertiesPanelProps {
  configFields: StudioStepConfigField[];
  configValues: Record<string, string>;
  node: WorkflowCanvasNode;
  readOnly?: boolean;
  onClose: () => void;
  onConfigChange: (fieldId: string, value: string) => void;
}

export default function StudioCanvasPropertiesPanel({
  configFields,
  configValues,
  node,
  readOnly = false,
  onClose,
  onConfigChange,
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
                {configFields.map((field) => (
                  <div key={field.id} className="studio-canvas-properties-config-field">
                    <ModusWcTextInput
                      bordered={false}
                      disabled={readOnly}
                      inputId={`studio-step-field-${node.id}-${field.id}`}
                      label={field.label}
                      placeholder={field.placeholder}
                      required
                      value={configValues[field.id] ?? ''}
                      onInputChange={(event: CustomEvent) => {
                        if (readOnly) {
                          return;
                        }

                        const nextValue = event.detail?.target?.value || '';
                        onConfigChange(field.id, nextValue);
                      }}
                    />
                    {field.helperText && (
                      <p className="studio-canvas-properties-field-helper">{field.helperText}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <p className="studio-canvas-properties-section-copy">
              No additional configuration is required for this step.
            </p>
          )}
        </div>
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
