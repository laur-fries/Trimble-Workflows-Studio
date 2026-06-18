import { useMemo, useState } from 'react';
import {
  ModusWcAccordion,
  ModusWcButton,
  ModusWcChip,
  ModusWcCollapse,
} from '@trimble-oss/moduswebcomponents-react';
import StudioTemplateCard from './StudioTemplateCard';
import type { StudioTemplate, StudioTemplateGroup } from './data';
import { sortTemplates } from './studioTemplateCatalog';

interface StudioTemplateCatalogGroupsProps {
  groups: StudioTemplateGroup[];
  onUseTemplate: (template: StudioTemplate) => void;
}

function TemplateGroupCollapse({
  group,
  expanded,
  onExpandedChange,
  onUseTemplate,
}: {
  group: StudioTemplateGroup;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onUseTemplate: (template: StudioTemplate) => void;
}) {
  const sortedTemplates = useMemo(
    () => sortTemplates(group.templates, 'title', 'asc'),
    [group.templates],
  );

  return (
    <ModusWcCollapse
      bordered={false}
      collapseId={`studio-template-catalog-${group.id}`}
      customClass="studio-template-group-collapse"
      expanded={expanded}
      onExpandedChange={(event) => {
        const expandedState = event.detail?.expanded;
        if (typeof expandedState === 'boolean') {
          onExpandedChange(expandedState);
        }
      }}
    >
      <div slot="header" className="studio-template-group-header">
        <div className="studio-template-group-header-copy">
          <span className="studio-canvas-category-title">{group.title}</span>
          {group.subtitle ? (
            <p className="studio-template-group-header-subtitle">{group.subtitle}</p>
          ) : null}
        </div>
        <ModusWcChip
          customClass="studio-canvas-category-count"
          shape="circle"
          size="sm"
          variant="outline"
        >
          {group.templates.length}
        </ModusWcChip>
      </div>
      <div slot="content" className="studio-canvas-category-content studio-canvas-category-content--actions">
        <div className="studio-template-grid studio-template-group-content">
          {sortedTemplates.map((template) => (
            <StudioTemplateCard key={template.id} template={template} onUseTemplate={onUseTemplate} />
          ))}
        </div>
      </div>
    </ModusWcCollapse>
  );
}

export default function StudioTemplateCatalogGroups({
  groups,
  onUseTemplate,
}: StudioTemplateCatalogGroupsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group.id, true])),
  );

  const visibleGroupKey = useMemo(() => groups.map((group) => group.id).join('|'), [groups]);

  const isGroupExpanded = (groupId: string) => expandedGroups[groupId] ?? true;

  const allGroupsExpanded = useMemo(
    () => groups.length > 0 && groups.every((group) => isGroupExpanded(group.id)),
    [expandedGroups, groups],
  );

  const allGroupsCollapsed = useMemo(
    () => groups.length > 0 && groups.every((group) => !isGroupExpanded(group.id)),
    [expandedGroups, groups],
  );

  const setAllGroupsExpanded = (expanded: boolean) => {
    setExpandedGroups(Object.fromEntries(groups.map((group) => [group.id, expanded])));
  };

  return (
    <div className="studio-template-catalog-groups">
      <div className="studio-template-catalog-groups-toolbar">
        <div className="studio-workflow-action-picker-control-links">
          <ModusWcButton
            color="primary"
            customClass="studio-canvas-expand-all"
            disabled={allGroupsExpanded}
            onButtonClick={() => setAllGroupsExpanded(true)}
            size="sm"
            variant="borderless"
          >
            Expand all
          </ModusWcButton>
          <span className="studio-canvas-control-separator" aria-hidden="true">
            |
          </span>
          <ModusWcButton
            color="primary"
            customClass="studio-canvas-collapse-all"
            disabled={allGroupsCollapsed}
            onButtonClick={() => setAllGroupsExpanded(false)}
            size="sm"
            variant="borderless"
          >
            Collapse all
          </ModusWcButton>
        </div>
      </div>

      <ModusWcAccordion
        key={`studio-template-groups-${visibleGroupKey}`}
        customClass="studio-template-groups-accordion"
      >
        {groups.map((group) => (
          <TemplateGroupCollapse
            key={group.id}
            group={group}
            expanded={isGroupExpanded(group.id)}
            onExpandedChange={(expanded) =>
              setExpandedGroups((current) => ({ ...current, [group.id]: expanded }))
            }
            onUseTemplate={onUseTemplate}
          />
        ))}
      </ModusWcAccordion>
    </div>
  );
}
