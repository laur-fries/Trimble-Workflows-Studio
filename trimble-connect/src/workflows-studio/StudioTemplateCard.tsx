import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';
import type { StudioTemplate } from './data';
import { formatTemplateMetaMetrics } from './studioTemplateCatalog';

interface StudioTemplateCardProps {
  template: StudioTemplate;
  onUseTemplate: (template: StudioTemplate) => void;
}

export default function StudioTemplateCard({ template, onUseTemplate }: StudioTemplateCardProps) {
  const metaMetrics = formatTemplateMetaMetrics(template);

  return (
    <article className="studio-template-card-shell">
      <button
        type="button"
        className="studio-template-card"
        onClick={() => onUseTemplate(template)}
      >
        <div className="studio-template-card-icons" aria-hidden="true">
          {template.icons.map((icon) => (
            <span key={icon} className="studio-template-card-icon">
              <ModusWcIcon decorative name={icon} size="sm" />
            </span>
          ))}
        </div>

        <h3 className="studio-template-card-title">{template.title}</h3>
        <p className="studio-template-description">{template.description}</p>
        <p className="studio-template-meta-metrics">{metaMetrics}</p>
      </button>
    </article>
  );
}
