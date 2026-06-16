import { useEffect, useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcModal,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import StudioAssistantPrompt from './StudioAssistantPrompt';
import WorkflowsPrimaryButton from '../components/WorkflowsPrimaryButton';
import { studioTemplateGroups, type StudioTemplate } from './data';

const PREVIEW_MODAL_ID = 'studio-template-preview';

interface StudioDashboardProps {
  onBack: () => void;
  onUseTemplate: (template: StudioTemplate) => void;
  onCreateNewWorkflow: () => void;
  onAssistantCreate: (task: string) => void;
}

export default function StudioDashboard({
  onBack,
  onUseTemplate,
  onCreateNewWorkflow,
  onAssistantCreate,
}: StudioDashboardProps) {
  const [previewTemplate, setPreviewTemplate] = useState<StudioTemplate | null>(null);

  useEffect(() => {
    const dialog = document.getElementById(PREVIEW_MODAL_ID) as HTMLDialogElement | null;
    if (!dialog) {
      return;
    }

    if (previewTemplate) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [previewTemplate]);

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <div className="studio-dashboard">
      <div className="studio-dashboard-intro">
        <div className="studio-dashboard-top">
          <ModusWcButton
            color="primary"
            customClass="studio-dashboard-back"
            onButtonClick={onBack}
            size="sm"
            variant="borderless"
          >
            <ModusWcIcon decorative name="caret_left" size="sm" />
            Back
          </ModusWcButton>

          <WorkflowsPrimaryButton onClick={onCreateNewWorkflow}>
            Create new workflow
          </WorkflowsPrimaryButton>
        </div>

        <StudioAssistantPrompt onCreate={onAssistantCreate} />
      </div>

      {studioTemplateGroups.map((group) => (
        <section key={group.id} className="studio-template-group" aria-label={group.title}>
          <h2 className="studio-template-group-title">{group.title}</h2>

          <div className="studio-template-grid">
            {group.templates.map((template) => (
              <article key={template.id} className="studio-template-card">
                <div className="studio-template-card-icons" aria-hidden="true">
                  {template.icons.map((icon) => (
                    <span key={icon} className="studio-template-card-icon">
                      <ModusWcIcon decorative name={icon} size="sm" />
                    </span>
                  ))}
                </div>

                <h3 className="studio-template-card-title">{template.title}</h3>
                <p className="studio-template-description">{template.description}</p>

                <div className="studio-template-card-actions">
                  <ModusWcButton
                    color="tertiary"
                    variant="outlined"
                    size="sm"
                    onButtonClick={() => setPreviewTemplate(template)}
                  >
                    Preview
                  </ModusWcButton>
                  <ModusWcButton
                    color="primary"
                    variant="outlined"
                    size="sm"
                    onButtonClick={() => onUseTemplate(template)}
                  >
                    Use
                  </ModusWcButton>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <ModusWcModal modalId={PREVIEW_MODAL_ID} aria-label="Template preview">
        {previewTemplate && (
          <>
            <span slot="header">{previewTemplate.title}</span>
            <div slot="content" className="studio-template-preview">
              <ModusWcTypography hierarchy="p" customClass="studio-template-preview-description">
                {previewTemplate.description}
              </ModusWcTypography>
              <h4 className="studio-template-preview-steps-title">Workflow steps</h4>
              <ol className="studio-template-preview-steps">
                {previewTemplate.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div slot="footer" className="studio-template-preview-footer">
              <ModusWcButton color="tertiary" variant="outlined" size="sm" onButtonClick={closePreview}>
                Close
              </ModusWcButton>
              <ModusWcButton
                color="primary"
                variant="outlined"
                size="sm"
                onButtonClick={() => {
                  onUseTemplate(previewTemplate);
                  closePreview();
                }}
              >
                Use template
              </ModusWcButton>
            </div>
          </>
        )}
      </ModusWcModal>
    </div>
  );
}
