import { useMemo, useRef, useState } from 'react';
import {
  ModusWcAccordion,
  ModusWcButton,
  ModusWcChip,
  ModusWcCollapse,
  ModusWcIcon,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import {
  workflowStarterGroups,
  type WorkflowStarterGroup,
  type WorkflowStarterItem,
} from './data';
import { setStarterDragData } from './starterDrag';

interface StudioStarterPickerProps {
  className?: string;
  includeSearch?: boolean;
  searchQuery?: string;
  selectedStarterId?: string | null;
  onSearchChange?: (query: string) => void;
  onSelectStarter?: (item: WorkflowStarterItem) => void;
}

function filterStarterGroups(groups: WorkflowStarterGroup[], query: string): WorkflowStarterGroup[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const haystack = [item.label, item.connector, group.label]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    }))
    .filter((group) => group.items.length > 0);
}

function StarterStepOption({
  item,
  isSelected,
  onSelect,
}: {
  item: WorkflowStarterItem;
  isSelected: boolean;
  onSelect: (item: WorkflowStarterItem) => void;
}) {
  const didDragRef = useRef(false);

  return (
    <div
      className={`studio-canvas-action-card studio-canvas-starter-option${isSelected ? ' is-selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      draggable
      onClick={() => {
        if (didDragRef.current) {
          didDragRef.current = false;
          return;
        }
        onSelect(item);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
      onDragEnd={() => {
        didDragRef.current = false;
      }}
      onDragStart={(event) => {
        didDragRef.current = true;
        setStarterDragData(event, item.id);
      }}
    >
      <div className="studio-canvas-starter-option-header">
        <span className="studio-canvas-starter-option-icon" aria-hidden="true">
          <ModusWcIcon decorative name={item.icon} size="sm" variant="solid" />
        </span>
        <span className="studio-canvas-action-card-title">{item.label}</span>
      </div>

      {item.connector && (
        <p className="studio-canvas-starter-option-via">via {item.connector}</p>
      )}

      <div className="studio-canvas-action-card-body studio-canvas-starter-option-drag-row">
        <ModusWcIcon
          decorative
          name="drag_indicator"
          size="sm"
          customClass="studio-canvas-action-card-drag"
        />
      </div>
    </div>
  );
}

function StarterGroupCollapse({
  group,
  expanded,
  selectedStarterId,
  onExpandedChange,
  onSelectStarter,
}: {
  group: WorkflowStarterGroup;
  expanded: boolean;
  selectedStarterId?: string | null;
  onExpandedChange: (expanded: boolean) => void;
  onSelectStarter?: (item: WorkflowStarterItem) => void;
}) {
  return (
    <ModusWcCollapse
      bordered={false}
      collapseId={`studio-starter-group-${group.id}`}
      customClass="studio-canvas-starter-group-collapse"
      expanded={expanded}
      onExpandedChange={(event) => onExpandedChange(event.detail.expanded)}
    >
      <div slot="header" className="studio-canvas-category-header">
        <span className="studio-canvas-category-title">{group.label}</span>
        <ModusWcChip
          customClass="studio-canvas-category-count"
          shape="circle"
          size="sm"
          variant="outline"
        >
          {group.items.length}
        </ModusWcChip>
      </div>
      <div slot="content" className="studio-canvas-category-content studio-canvas-category-content--actions">
        <div
          className="studio-canvas-category-steps studio-canvas-starter-group-content"
          aria-label={`${group.label} triggers`}
        >
          {group.items.map((item) => (
            <StarterStepOption
              key={item.id}
              item={item}
              isSelected={selectedStarterId === item.id}
              onSelect={(starter) => onSelectStarter?.(starter)}
            />
          ))}
        </div>
      </div>
    </ModusWcCollapse>
  );
}

export default function StudioStarterPicker({
  className = '',
  includeSearch = false,
  searchQuery: controlledSearchQuery,
  selectedStarterId = null,
  onSearchChange,
  onSelectStarter,
}: StudioStarterPickerProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [expandedStarterGroups, setExpandedStarterGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      workflowStarterGroups.map((group) => [group.id, group.defaultExpanded ?? true]),
    ),
  );

  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const filteredStarterGroups = useMemo(
    () => filterStarterGroups(workflowStarterGroups, searchQuery),
    [searchQuery],
  );

  const isStarterGroupExpanded = (group: WorkflowStarterGroup) =>
    expandedStarterGroups[group.id] ?? group.defaultExpanded ?? true;

  const allStarterGroupsExpanded = useMemo(
    () =>
      filteredStarterGroups.length > 0 &&
      filteredStarterGroups.every((group) => isStarterGroupExpanded(group)),
    [expandedStarterGroups, filteredStarterGroups],
  );

  const allStarterGroupsCollapsed = useMemo(
    () =>
      filteredStarterGroups.length > 0 &&
      filteredStarterGroups.every((group) => !isStarterGroupExpanded(group)),
    [expandedStarterGroups, filteredStarterGroups],
  );

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
      return;
    }
    setInternalSearchQuery(query);
  };

  const setAllGroupsExpanded = (expanded: boolean) => {
    setExpandedStarterGroups(
      Object.fromEntries(filteredStarterGroups.map((group) => [group.id, expanded])),
    );
  };

  return (
    <div className={`studio-starter-picker${className ? ` ${className}` : ''}`}>
      {includeSearch && (
        <div className="studio-starter-picker-search">
          <ModusWcTextInput
            bordered
            includeSearch
            placeholder="Search starters..."
            size="md"
            value={searchQuery}
            onInputChange={(event: CustomEvent) => {
              handleSearchChange(event.detail?.target?.value || '');
            }}
          />
        </div>
      )}

      <div className="studio-workflow-action-picker-control-links">
        <ModusWcButton
          color="primary"
          customClass="studio-canvas-expand-all"
          disabled={allStarterGroupsExpanded}
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
          disabled={allStarterGroupsCollapsed}
          onButtonClick={() => setAllGroupsExpanded(false)}
          size="sm"
          variant="borderless"
        >
          Collapse all
        </ModusWcButton>
      </div>

      <ModusWcAccordion customClass="studio-canvas-starter-groups-accordion">
        {filteredStarterGroups.map((group) => (
          <StarterGroupCollapse
            key={group.id}
            group={group}
            expanded={expandedStarterGroups[group.id] ?? group.defaultExpanded ?? true}
            selectedStarterId={selectedStarterId}
            onExpandedChange={(expanded) =>
              setExpandedStarterGroups((current) => ({ ...current, [group.id]: expanded }))
            }
            onSelectStarter={onSelectStarter}
          />
        ))}
      </ModusWcAccordion>
    </div>
  );
}
