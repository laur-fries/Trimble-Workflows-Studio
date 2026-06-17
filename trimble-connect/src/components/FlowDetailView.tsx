import { useEffect, useRef, useState } from 'react';
import { ModusWcButton, ModusWcIcon, ModusWcTextInput } from '@trimble-oss/moduswebcomponents-react';
import WorkflowsPrimaryButton from './WorkflowsPrimaryButton';
import type { StepId } from './flowStepConfig';

export interface FlowStep {
  label: string;
  icon: string;
}

export interface DiscoverFlow {
  id: string;
  category: string;
  title: string;
  icons: readonly string[];
  starter: FlowStep;
  actions: FlowStep[];
}

interface FlowDetailViewProps {
  flow: DiscoverFlow;
  title: string;
  onTitleChange: (title: string) => void;
  onStepSelect: (stepId: StepId) => void;
  invalidStepIds: Set<StepId>;
}

function FlowStepCard({
  stepId,
  icon,
  label,
  onSelect,
  hasError,
}: {
  stepId: StepId;
  icon: string;
  label: string;
  onSelect: (stepId: StepId) => void;
  hasError: boolean;
}) {
  return (
    <div className="workflows-flow-step-wrap">
      <button
        type="button"
        className={`workflows-flow-step ${hasError ? 'has-error' : ''}`}
        onClick={() => onSelect(stepId)}
      >
        <span className="workflows-flow-step-icon">
          <ModusWcIcon decorative name={icon} size="sm" />
        </span>
        <p className="workflows-flow-step-label">{label}</p>
        <ModusWcIcon decorative name="caret_right" size="sm" customClass="workflows-flow-step-chevron" />
      </button>
      {hasError && <p className="workflows-flow-step-error">This step is not fully configured</p>}
    </div>
  );
}

export default function FlowDetailView({
  flow,
  title,
  onTitleChange,
  onStepSelect,
  invalidStepIds,
}: FlowDetailViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const titleInputRef = useRef<HTMLModusWcTextInputElement>(null);

  useEffect(() => {
    if (!isEditingTitle) {
      setDraftTitle(title);
    }
  }, [title, isEditingTitle]);

  useEffect(() => {
    if (!isEditingTitle) {
      return;
    }

    const input = titleInputRef.current?.shadowRoot?.querySelector('input');
    if (!input) {
      return;
    }

    input.focus();
    input.select();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        input.blur();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setDraftTitle(title);
        setIsEditingTitle(false);
      }
    };

    input.addEventListener('keydown', handleKeyDown);
    return () => input.removeEventListener('keydown', handleKeyDown);
  }, [isEditingTitle, title]);

  const startEditingTitle = () => {
    setDraftTitle(title);
    setIsEditingTitle(true);
  };

  const commitTitle = () => {
    const trimmedTitle = draftTitle.trim();
    if (trimmedTitle) {
      onTitleChange(trimmedTitle);
    } else {
      setDraftTitle(title);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="workflows-flow-detail">
      <div className="workflows-flow-title-row">
        {isEditingTitle ? (
          <div className="workflows-flow-title-input">
            <ModusWcTextInput
              ref={titleInputRef}
              bordered={false}
              size="lg"
              value={draftTitle}
              inputId={`workflow-title-${flow.id}`}
              onInputChange={(event: CustomEvent) => {
                const value = event.detail?.target?.value || '';
                setDraftTitle(value);
              }}
              onInputBlur={commitTitle}
            />
          </div>
        ) : (
          <>
            <h3 className="workflows-flow-title">{title}</h3>
            <button
              type="button"
              className="workflows-panel-icon-btn"
              aria-label="Edit workflow name"
              onClick={startEditingTitle}
            >
              <ModusWcIcon decorative name="pencil" size="sm" />
            </button>
          </>
        )}
      </div>

      <section className="workflows-flow-section">
        <h4 className="workflows-flow-section-label">Starter</h4>
        <FlowStepCard
          stepId="starter"
          icon={flow.starter.icon}
          label={flow.starter.label}
          onSelect={onStepSelect}
          hasError={invalidStepIds.has('starter')}
        />
      </section>

      <section className="workflows-flow-section">
        <h4 className="workflows-flow-section-label">Actions</h4>
        <div className="workflows-flow-actions">
          {flow.actions.map((action, index) => {
            const stepId = `action-${index}` as StepId;
            return (
              <div key={action.label} className="workflows-flow-action-item">
                {index > 0 && <span className="workflows-flow-connector" aria-hidden="true" />}
                <FlowStepCard
                  stepId={stepId}
                  icon={action.icon}
                  label={action.label}
                  onSelect={onStepSelect}
                  hasError={invalidStepIds.has(stepId)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

interface FlowDetailFooterProps {
  onTurnOn: () => void;
  isLoading?: boolean;
  isActive?: boolean;
}

export function FlowDetailFooter({ onTurnOn, isLoading = false, isActive = false }: FlowDetailFooterProps) {
  return (
    <footer className="workflows-flow-detail-footer">
      <ModusWcButton color="primary" variant="borderless" size="sm">
        <ModusWcIcon decorative name="launch" size="sm" />
        Edit in Trimble Workflows
      </ModusWcButton>
      {!isActive && (
        <WorkflowsPrimaryButton fullWidth loading={isLoading} loadingLabel="Turning on…" onClick={onTurnOn}>
          Turn on
        </WorkflowsPrimaryButton>
      )}
    </footer>
  );
}
