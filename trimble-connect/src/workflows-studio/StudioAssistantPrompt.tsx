import { useEffect, useState } from 'react';
import {
  ModusWcLoader,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import StudioAiDisclaimer from './StudioAiDisclaimer';
import StudioAiStarsIcon from './StudioAiStarsIcon';
import StudioAssistantHeroFingerprint from './StudioAssistantHeroFingerprint';
import StudioMagicWandIcon from './StudioMagicWandIcon';
import {
  getWorkflowGenerationPhaseLabel,
  getWorkflowGenerationPhaseProgress,
  getWorkflowGenerationPhaseStatus,
  WORKFLOW_SAMPLE_PROMPT,
  type WorkflowGenerationPhase,
} from './workflowGenerator';

interface StudioAssistantPromptProps {
  generationPhase?: WorkflowGenerationPhase | null;
  isGenerating?: boolean;
  onCreate: (task: string) => void | Promise<void>;
}

const ASSISTANT_INPUT_ID = 'studio-assistant-task';

export default function StudioAssistantPrompt({
  generationPhase = null,
  isGenerating = false,
  onCreate,
}: StudioAssistantPromptProps) {
  const [task, setTask] = useState('');
  const [displayedStatus, setDisplayedStatus] = useState('');

  const handleSubmit = async () => {
    const trimmed = task.trim();
    if (!trimmed || isGenerating) {
      return;
    }

    await onCreate(trimmed);
  };

  const handleUseSamplePrompt = () => {
    if (isGenerating) {
      return;
    }

    setTask(WORKFLOW_SAMPLE_PROMPT);
    requestAnimationFrame(() => {
      const input = document.getElementById(ASSISTANT_INPUT_ID) as HTMLInputElement | null;
      input?.focus();
    });
  };

  useEffect(() => {
    if (!isGenerating || !generationPhase) {
      setDisplayedStatus('');
      return;
    }

    setDisplayedStatus(getWorkflowGenerationPhaseStatus(generationPhase));
  }, [generationPhase, isGenerating]);

  useEffect(() => {
    const input = document.getElementById(ASSISTANT_INPUT_ID) as HTMLInputElement | null;
    if (!input) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || isGenerating) {
        return;
      }

      event.preventDefault();
      const trimmed = input.value.trim();
      if (trimmed) {
        void onCreate(trimmed);
      }
    };

    input.addEventListener('keydown', handleKeyDown);
    return () => input.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating, onCreate]);

  const buttonLabel = isGenerating && generationPhase
    ? getWorkflowGenerationPhaseLabel(generationPhase)
    : 'Generate workflow';

  const progressPercent = isGenerating && generationPhase
    ? getWorkflowGenerationPhaseProgress(generationPhase)
    : 0;

  return (
    <section className="studio-assistant-hero" aria-label="Trimble Assistant">
      <div className="studio-assistant-hero-content">
        <StudioAssistantHeroFingerprint side="left" />
        <StudioAssistantHeroFingerprint side="right" />

        <div className="studio-assistant-hero-content-inner">
        <h2 className="studio-assistant-hero-title">
          What process would you like to automate today?
        </h2>

        <div className={`studio-assistant-nudge${isGenerating ? ' is-generating' : ''}`}>
          <div className={`studio-assistant-nudge-inner${isGenerating ? ' is-generating' : ''}`}>
            <ModusWcTextInput
              bordered={false}
              customClass="studio-assistant-prompt-input"
              disabled={isGenerating}
              enterkeyhint="go"
              inputId={ASSISTANT_INPUT_ID}
              placeholder="Describe a task to automate"
              size="md"
              value={task}
              onInputChange={(event: CustomEvent) => {
                setTask(event.detail?.target?.value || '');
              }}
            >
              <span slot="custom-icon" className="studio-assistant-prompt-icon-wrap">
                <StudioMagicWandIcon className="studio-assistant-prompt-icon" />
              </span>
            </ModusWcTextInput>

            <button
              type="button"
              className={`studio-assistant-generate-btn${isGenerating ? ' is-generating' : ''}`}
              disabled={isGenerating}
              aria-busy={isGenerating}
              aria-live="polite"
              onClick={() => {
                void handleSubmit();
              }}
            >
              {isGenerating ? (
                <ModusWcLoader
                  variant="spinner"
                  size="sm"
                  color="neutral"
                  customClass="studio-assistant-generate-btn-loader"
                />
              ) : (
                <StudioAiStarsIcon className="studio-assistant-generate-btn-icon" />
              )}
              {buttonLabel}
            </button>
          </div>

          {isGenerating ? (
            <div className="studio-assistant-generating-panel" aria-live="polite">
              <div className="studio-assistant-generating-progress-track" aria-hidden="true">
                <div
                  className="studio-assistant-generating-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="studio-assistant-generating-status">{displayedStatus}</p>
            </div>
          ) : null}
        </div>

        <StudioAiDisclaimer />

        {!isGenerating ? (
          <div className="studio-assistant-sample-prompt">
            <button
              type="button"
              className="studio-assistant-sample-prompt-btn"
              onClick={handleUseSamplePrompt}
            >
              Try with sample prompt
            </button>
          </div>
        ) : null}
        </div>
      </div>
    </section>
  );
}
