import { useEffect, useMemo, useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcModal,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import type { StudioTemplate, StudioTemplateStep } from './data';
import { getStudioStepConfigFields } from './stepConfigFields';

export const TEMPLATE_PREVIEW_MODAL_ID = 'studio-template-preview-modal';

interface StudioTemplatePreviewModalProps {
  isOpen: boolean;
  template: StudioTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: StudioTemplate) => void;
}

function resolveStepIcon(step: StudioTemplateStep, index: number): string {
  return step.icon ?? (step.isStarter || index === 0 ? 'play_circle' : 'flowchart');
}

export default function StudioTemplatePreviewModal({
  isOpen,
  template,
  onClose,
  onUseTemplate,
}: StudioTemplatePreviewModalProps) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  useEffect(() => {
    const dialog = document.getElementById(TEMPLATE_PREVIEW_MODAL_ID) as HTMLDialogElement | null;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!template?.steps.length) {
      setSelectedStepId(null);
      return;
    }

    setSelectedStepId(template.steps[0].stepId);
  }, [template?.id, template?.steps]);

  const selectedStep = useMemo(
    () => template?.steps.find((step) => step.stepId === selectedStepId) ?? null,
    [selectedStepId, template?.steps],
  );

  const selectedStepIndex = useMemo(
    () => template?.steps.findIndex((step) => step.stepId === selectedStepId) ?? -1,
    [selectedStepId, template?.steps],
  );

  const configFields = useMemo(() => {
    if (!selectedStep) {
      return [];
    }

    return getStudioStepConfigFields(
      selectedStep.stepId,
      Boolean(selectedStep.isStarter ?? selectedStepIndex === 0),
    );
  }, [selectedStep, selectedStepIndex]);

  const requiresConfiguration = (stepId: string) =>
    template?.configurationRequiredStepIds?.includes(stepId) ?? false;

  if (!template) {
    return null;
  }

  return (
    <ModusWcModal modalId={TEMPLATE_PREVIEW_MODAL_ID} aria-label={`Preview ${template.title}`}>
      <span slot="header">{template.title}</span>
      <div slot="content" className="studio-template-preview-modal-content">
        <p className="studio-template-preview-modal-lead">
          Read-only blueprint preview. Review each step and required configuration targets before cloning.
        </p>

        <div className="studio-template-preview-modal-body">
          <section className="studio-template-preview-canvas" aria-label="Workflow blueprint steps">
            <div className="studio-template-preview-canvas-banner">
              <ModusWcIcon decorative name="visibility" size="sm" />
              <p>Read-only preview. Workflow configurations are locked.</p>
            </div>

            <div className="studio-canvas-node-stack studio-template-preview-node-stack">
              {template.steps.map((step, index) => {
                const isStarter = step.isStarter ?? index === 0;
                const isSelected = selectedStepId === step.stepId;
                const showConfigTag = requiresConfiguration(step.stepId);

                return (
                  <div key={step.stepId} className="studio-canvas-node-item">
                    {index > 0 && <span className="studio-canvas-node-connector" aria-hidden="true" />}
                    <button
                      type="button"
                      className={`studio-canvas-node ${isStarter ? 'is-starter' : ''}${
                        isSelected ? ' is-node-selected' : ''
                      }`}
                      onClick={() => setSelectedStepId(step.stepId)}
                    >
                      {isStarter ? (
                        <ModusWcIcon decorative name={resolveStepIcon(step, index)} size="sm" variant="solid" />
                      ) : (
                        <span className="studio-canvas-node-index">{index + 1}</span>
                      )}
                      <div className="studio-canvas-node-copy">
                        <p>{step.label}</p>
                        {showConfigTag ? (
                          <span className="studio-config-required-tag">Configuration Required</span>
                        ) : null}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="studio-template-preview-properties" aria-label="Step configuration preview">
            {selectedStep ? (
              <>
                <ModusWcTypography hierarchy="h6" weight="semibold" customClass="studio-template-preview-properties-title">
                  {selectedStep.label}
                </ModusWcTypography>
                <p className="studio-template-preview-properties-type">
                  {(selectedStep.isStarter ?? selectedStepIndex === 0) ? 'Start trigger' : 'Workflow action'}
                </p>

                {configFields.length > 0 ? (
                  <div className="studio-template-preview-config-fields">
                    {configFields.map((field) => (
                      <div key={field.id} className="studio-template-preview-config-field">
                        <span className="studio-template-preview-config-label">{field.label}</span>
                        <div className="studio-template-preview-config-value">
                          <span className="studio-template-preview-config-placeholder">{field.placeholder}</span>
                          {requiresConfiguration(selectedStep.stepId) ? (
                            <span className="studio-config-required-tag">Configuration Required</span>
                          ) : null}
                        </div>
                        {field.helperText ? (
                          <p className="studio-template-preview-config-helper">{field.helperText}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="studio-template-preview-properties-empty">
                    No additional configuration is required for this step.
                  </p>
                )}
              </>
            ) : null}
          </aside>
        </div>
      </div>
      <div slot="footer" className="studio-template-preview-modal-footer">
        <ModusWcButton color="tertiary" size="sm" variant="outlined" onButtonClick={onClose}>
          Close
        </ModusWcButton>
        <ModusWcButton
          color="primary"
          size="sm"
          variant="filled"
          onButtonClick={() => onUseTemplate(template)}
        >
          Use this template
        </ModusWcButton>
      </div>
    </ModusWcModal>
  );
}
