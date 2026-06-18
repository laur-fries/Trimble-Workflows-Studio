import { useEffect, useMemo, useState } from 'react';
import {
  ModusWcAccordion,
  ModusWcButton,
  ModusWcChip,
  ModusWcCollapse,
  ModusWcIcon,
} from '@trimble-oss/moduswebcomponents-react';
import StudioTemplateCard from './StudioTemplateCard';
import type { StudioTemplate, StudioTemplateGroup } from './data';
import { formatTemplateMetaMetrics, sortTemplates, type StudioTemplateSortDirection, type StudioTemplateViewMode } from './studioTemplateCatalog';

interface StudioTemplateCatalogGroupsProps {
  groups: StudioTemplateGroup[];
  viewMode: StudioTemplateViewMode;
  sortDirection: StudioTemplateSortDirection;
  onSort: () => void;
  onUseTemplate: (template: StudioTemplate) => void;
  onViewModeChange: (viewMode: StudioTemplateViewMode) => void;
}

function TemplateGroupCollapse({
  group,
  expanded,
  viewMode,
  sortDirection,
  onExpandedChange,
  onUseTemplate,
}: {
  group: StudioTemplateGroup;
  expanded: boolean;
  viewMode: StudioTemplateViewMode;
  sortDirection: StudioTemplateSortDirection;
  onExpandedChange: (expanded: boolean) => void;
  onUseTemplate: (template: StudioTemplate) => void;
}) {
  const sortedTemplates = useMemo(
    () => sortTemplates(group.templates, 'title', sortDirection),
    [group.templates, sortDirection],
  );

  return (
    <ModusWcCollapse
      bordered={false}
      collapseId={`studio-template-group-${group.id}`}
      customClass="studio-template-group-collapse"
      expanded={expanded}
      onExpandedChange={(event) => onExpandedChange(event.detail.expanded)}
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
        {viewMode === 'grid' ? (
          <div className="studio-template-grid studio-template-group-content">
            {sortedTemplates.map((template) => (
              <StudioTemplateCard key={template.id} template={template} onUseTemplate={onUseTemplate} />
            ))}
          </div>
        ) : (
          <div className="studio-template-group-list" aria-label={`${group.title} templates`}>
            {sortedTemplates.map((template) => {
              const metaMetrics = formatTemplateMetaMetrics(template);

              return (
                <button
                  key={template.id}
                  type="button"
                  className="studio-template-list-row studio-template-list-row--grouped"
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
        )}
      </div>
    </ModusWcCollapse>
  );
}

export default function StudioTemplateCatalogGroups({
  groups,
  viewMode,
  sortDirection,
  onSort,
  onUseTemplate,
  onViewModeChange,
}: StudioTemplateCatalogGroupsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group.id, true])),
  );

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

  useEffect(() => {
    setExpandedGroups((current) => {
      const next = { ...current };

      groups.forEach((group) => {
        if (!(group.id in next)) {
          next[group.id] = true;
        }
      });

      return next;
    });
  }, [groups]);

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

        <div className="studio-template-catalog-groups-toolbar-end">
          {viewMode === 'list' ? (
            <button type="button" className="studio-template-sort-btn is-active" onClick={onSort}>
              Template
              <ModusWcIcon
                decorative
                name={sortDirection === 'asc' ? 'sort_arrow_up' : 'sort_arrow_down'}
                size="sm"
              />
            </button>
          ) : null}

          <div className="studio-template-view-toggle" role="group" aria-label="Template view mode">
            <ModusWcButton
              aria-label="Card grid view"
              aria-pressed={viewMode === 'grid'}
              color={viewMode === 'grid' ? 'primary' : 'tertiary'}
              customClass="studio-template-view-btn"
              shape="square"
              size="sm"
              variant={viewMode === 'grid' ? 'filled' : 'outlined'}
              onButtonClick={() => onViewModeChange('grid')}
            >
              <ModusWcIcon decorative name="view_grid" size="sm" />
            </ModusWcButton>
            <ModusWcButton
              aria-label="Sortable list view"
              aria-pressed={viewMode === 'list'}
              color={viewMode === 'list' ? 'primary' : 'tertiary'}
              customClass="studio-template-view-btn"
              shape="square"
              size="sm"
              variant={viewMode === 'list' ? 'filled' : 'outlined'}
              onButtonClick={() => onViewModeChange('list')}
            >
              <ModusWcIcon decorative name="view_list" size="sm" />
            </ModusWcButton>
          </div>
        </div>
      </div>

      <ModusWcAccordion customClass="studio-template-groups-accordion">
        {groups.map((group) => (
          <TemplateGroupCollapse
            key={group.id}
            group={group}
            expanded={isGroupExpanded(group.id)}
            viewMode={viewMode}
            sortDirection={sortDirection}
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
