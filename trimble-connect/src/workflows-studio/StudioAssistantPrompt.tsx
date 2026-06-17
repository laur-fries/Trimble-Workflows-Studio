import { useEffect, useState } from 'react';
import {
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import StudioAiDisclaimer from './StudioAiDisclaimer';
import StudioAiStarsIcon from './StudioAiStarsIcon';
import StudioMagicWandIcon from './StudioMagicWandIcon';

interface StudioAssistantPromptProps {
  onCreate: (task: string) => void;
}

const ASSISTANT_INPUT_ID = 'studio-assistant-task';

export default function StudioAssistantPrompt({ onCreate }: StudioAssistantPromptProps) {
  const [task, setTask] = useState('');

  const handleSubmit = () => {
    const trimmed = task.trim();
    if (!trimmed) {
      return;
    }
    onCreate(trimmed);
  };

  useEffect(() => {
    const input = document.getElementById(ASSISTANT_INPUT_ID) as HTMLInputElement | null;
    if (!input) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();
      const trimmed = input.value.trim();
      if (trimmed) {
        onCreate(trimmed);
      }
    };

    input.addEventListener('keydown', handleKeyDown);
    return () => input.removeEventListener('keydown', handleKeyDown);
  }, [onCreate]);

  return (
    <section className="studio-assistant-hero" aria-label="Trimble Assistant">
      <div className="studio-assistant-hero-content">
        <h2 className="studio-assistant-hero-title">
          What process would you like to automate today?
        </h2>

        <div className="studio-assistant-nudge">
          <div className="studio-assistant-nudge-inner">
            <ModusWcTextInput
              bordered={false}
              customClass="studio-assistant-prompt-input"
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

            <button type="button" className="studio-assistant-generate-btn" onClick={handleSubmit}>
              <StudioAiStarsIcon className="studio-assistant-generate-btn-icon" />
              Generate workflow
            </button>
          </div>
        </div>

        <StudioAiDisclaimer />
      </div>
    </section>
  );
}
