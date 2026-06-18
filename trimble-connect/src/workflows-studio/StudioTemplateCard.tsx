import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';
import type { StudioTemplate } from './data';
import StudioProductIcon from './StudioProductIcon';
import { formatTemplateMetaMetrics } from './studioTemplateCatalog';
import { resolveTemplateGroupProduct } from './studioProductIcons';

interface StudioTemplateCardProps {
  groupId: string;
  template: StudioTemplate;
  onUseTemplate: (template: StudioTemplate) => void;
}

export default function StudioTemplateCard({ groupId, template, onUseTemplate }: StudioTemplateCardProps) {
  const metaMetrics = formatTemplateMetaMetrics(template);
  const product = resolveTemplateGroupProduct(groupId);

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

        <div className="studio-template-card-heading">
          {product ? (
            <StudioProductIcon
              product={product}
              className="studio-product-icon studio-product-icon--compact"
            />
          ) : null}
          <h3 className="studio-template-card-title">{template.title}</h3>
        </div>
        <p className="studio-template-description">{template.description}</p>
        <p className="studio-template-meta-metrics">{metaMetrics}</p>
      </button>
    </article>
  );
}
