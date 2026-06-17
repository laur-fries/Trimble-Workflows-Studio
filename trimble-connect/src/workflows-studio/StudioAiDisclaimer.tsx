import { createElement } from 'react';
import { ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';
import { defineCustomElement as defineModusWcLink } from '@trimble-oss/moduswebcomponents/components/modus-wc-link.js';
import StudioAiStarsIcon from './StudioAiStarsIcon';

defineModusWcLink();

export default function StudioAiDisclaimer() {
  return (
    <div className="studio-ai-disclaimer" role="note" aria-label="AI disclaimer">
      <div className="studio-ai-disclaimer-badge">
        <div className="studio-ai-disclaimer-badge-inner">
          <StudioAiStarsIcon className="studio-ai-disclaimer-badge-icon" />
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            weight="semibold"
            customClass="studio-ai-disclaimer-badge-label"
          >
            Used by AI
          </ModusWcTypography>
        </div>
      </div>

      <ModusWcTypography hierarchy="p" size="sm" customClass="studio-ai-disclaimer-copy">
        AI can make mistakes.
      </ModusWcTypography>

      {createElement(
        'modus-wc-link',
        {
          color: 'primary',
          customClass: 'studio-ai-disclaimer-link',
          href: '#acceptable-use',
          rel: 'noopener noreferrer',
          target: '_blank',
          underline: 'always',
        },
        'Acceptable Use',
      )}
    </div>
  );
}
