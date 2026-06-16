import { ModusWcIcon, ModusWcTextInput } from '@trimble-oss/moduswebcomponents-react';
import type { FlowStepDefinition } from './flowStepConfig';

interface FlowStepConfigViewProps {
  step: FlowStepDefinition;
  values: Record<string, string>;
  showFieldErrors: boolean;
  onFieldChange: (fieldId: string, value: string) => void;
}

export default function FlowStepConfigView({
  step,
  values,
  showFieldErrors,
  onFieldChange,
}: FlowStepConfigViewProps) {

  return (
    <div className="workflows-step-config">
      <div className="workflows-step-config-heading">
        <span className="workflows-step-config-icon">
          <ModusWcIcon decorative name={step.icon} size="md" />
        </span>
        <h3 className="workflows-step-config-title">{step.shortTitle}</h3>
      </div>

      <p className="workflows-step-config-description">{step.description}</p>

      {step.fields.length > 0 ? (
        <div className="workflows-step-config-fields">
          {step.fields.map((field) => {
            const value = values[field.id] ?? '';
            const hasError = showFieldErrors && !value.trim();

            return (
              <div key={field.id} className="workflows-step-config-field">
                <ModusWcTextInput
                  label={field.label}
                  placeholder={field.placeholder}
                  value={value}
                  required
                  inputId={`step-field-${step.id}-${field.id}`}
                  feedback={
                    hasError
                      ? { level: 'error', message: 'This step is not fully configured' }
                      : undefined
                  }
                  onInputChange={(event: CustomEvent) => {
                    const nextValue = event.detail?.target?.value || '';
                    onFieldChange(field.id, nextValue);
                  }}
                />
                {field.helperText && !hasError && (
                  <p className="workflows-step-config-helper">{field.helperText}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="workflows-step-config-empty">No additional configuration is required for this step.</p>
      )}
    </div>
  );
}
