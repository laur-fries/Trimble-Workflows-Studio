import { useRef, useState } from 'react';
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';
import WorkflowsPrimaryButton from '../components/WorkflowsPrimaryButton';

interface StudioAssistantPromptProps {
  onCreate: (task: string) => void;
}

export default function StudioAssistantPrompt({ onCreate }: StudioAssistantPromptProps) {
  const [task, setTask] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = task.trim();
    if (!trimmed) {
      return;
    }
    onCreate(trimmed);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <section className="studio-assistant-hero" aria-label="Trimble Assistant">
      <div className="studio-assistant-hero-content">
        <h2 className="studio-assistant-hero-title">
          Automate your work with{' '}
          <span className="studio-assistant-hero-title-accent">Trimble Workflows</span>
        </h2>
        <p className="studio-assistant-hero-subtitle">
          Describe a task for Trimble Assistant to help you build a workflow.
        </p>

        <div className="studio-assistant-nudge">
          <div
            className="studio-assistant-nudge-inner"
            onClick={(event) => {
              const target = event.target as HTMLElement;
              if (!target.closest('button')) {
                focusInput();
              }
            }}
          >
            <span className="studio-assistant-nudge-icon" aria-hidden="true">
              <ModusWcIcon decorative name="ai_stars" size="md" variant="solid" />
            </span>

            <input
              ref={inputRef}
              type="text"
              className="studio-assistant-nudge-input"
              placeholder="Describe a task for Trimble Assistant"
              aria-label="Describe a task for Trimble Assistant"
              value={task}
              onChange={(event) => setTask(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />

            <WorkflowsPrimaryButton onClick={handleSubmit} disabled={!task.trim()}>
              <ModusWcIcon decorative name="ai_stars" size="sm" variant="solid" />
              Create
            </WorkflowsPrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
