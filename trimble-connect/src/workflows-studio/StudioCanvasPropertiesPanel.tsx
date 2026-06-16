import {
  ModusWcButton,
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
  isActive: boolean;
  node: WorkflowCanvasNode;
  onActivate: () => void;
  onClose: () => void;
  onConfigChange: (fieldId: string, value: string) => void;
  onDeactivate: () => void;
}

export default function StudioCanvasPropertiesPanel({
  configFields,
  configValues,
  isActive,
  node,
  onActivate,
  onClose,
  onConfigChange,
  onDeactivate,
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
                      inputId={`studio-step-field-${node.id}-${field.id}`}
                      label={field.label}
                      placeholder={field.placeholder}
                      required
                      value={configValues[field.id] ?? ''}
                      onInputChange={(event: CustomEvent) => {
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

          <ModusWcDivider customClass="studio-canvas-properties-divider" />

          <section className="studio-canvas-properties-section" aria-labelledby="studio-node-status-heading">
            <h3 className="studio-canvas-properties-section-title" id="studio-node-status-heading">
              Node status
            </h3>
            <p className="studio-canvas-properties-section-copy">
              Control whether this step runs when the workflow executes.
            </p>
            <div className="studio-canvas-properties-status-actions">
              <ModusWcButton
                color={isActive ? 'primary' : 'tertiary'}
                customClass="studio-canvas-properties-activate"
                disabled={isActive}
                onButtonClick={onActivate}
                size="sm"
                variant={isActive ? 'filled' : 'outlined'}
              >
                Activate
              </ModusWcButton>
              <ModusWcButton
                color={!isActive ? 'primary' : 'tertiary'}
                customClass="studio-canvas-properties-deactivate"
                disabled={!isActive}
                onButtonClick={onDeactivate}
                size="sm"
                variant={!isActive ? 'filled' : 'outlined'}
              >
                Deactivate
              </ModusWcButton>
            </div>
            <p className="studio-canvas-properties-status-label">
              Current status: {isActive ? 'Active' : 'Inactive'}
            </p>
          </section>
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
