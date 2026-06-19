import { Fragment } from 'react';
import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';
import type { StudioTemplate } from './data';
import StudioProductFlowArrow from './StudioProductFlowArrow';
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
  const productFlow = template.catalogProductFlow;

  return (
    <article className="studio-template-card-shell">
      <button
        type="button"
        className="studio-template-card"
        onClick={() => onUseTemplate(template)}
      >
        {productFlow ? (
          <div
            className="studio-template-card-icons studio-template-card-icons--product-flow"
            aria-hidden="true"
          >
            {productFlow.map((flowProduct, index) => (
              <Fragment key={`${flowProduct}-${index}`}>
                {index > 0 ? (
                  <span className="studio-template-card-flow-separator">
                    <StudioProductFlowArrow />
                  </span>
                ) : null}
                <span className="studio-template-card-icon studio-template-card-icon--product">
                  <StudioProductIcon
                    product={flowProduct}
                    className="studio-product-icon studio-product-icon--card-flow"
                  />
                </span>
              </Fragment>
            ))}
          </div>
        ) : template.icons.length > 0 ? (
          <div className="studio-template-card-icons" aria-hidden="true">
            {template.icons.map((icon) => (
              <span key={icon} className="studio-template-card-icon">
                <ModusWcIcon decorative name={icon} size="sm" />
              </span>
            ))}
          </div>
        ) : null}

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
