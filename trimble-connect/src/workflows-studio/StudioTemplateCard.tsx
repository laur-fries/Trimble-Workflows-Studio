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

interface StudioTemplateListProps {
  templates: StudioTemplate[];
  sortDirection: 'asc' | 'desc';
  onUseTemplate: (template: StudioTemplate) => void;
  onSort: () => void;
}

export function StudioTemplateList({
  templates,
  sortDirection,
  onUseTemplate,
  onSort,
}: StudioTemplateListProps) {
  return (
    <div className="studio-template-list">
      <div className="studio-template-list-header" role="row">
        <button type="button" className="studio-template-sort-btn is-active" onClick={onSort}>
          Template
          <ModusWcIcon
            decorative
            name={sortDirection === 'asc' ? 'sort_arrow_up' : 'sort_arrow_down'}
            size="sm"
          />
        </button>
      </div>

      {templates.map((template) => {
        const metaMetrics = formatTemplateMetaMetrics(template);

        return (
          <button
            key={template.id}
            type="button"
            className="studio-template-list-row"
            role="row"
            onClick={() => onUseTemplate(template)}
          >
            <div className="studio-template-list-cell studio-template-list-cell--title">
              <p className="studio-template-list-title">{template.title}</p>
              <p className="studio-template-list-description">{template.description}</p>
              <p className="studio-template-meta-metrics">{metaMetrics}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
