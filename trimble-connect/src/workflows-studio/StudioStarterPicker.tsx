import { useMemo, useRef, useState } from 'react';
import {
  ModusWcAccordion,
  ModusWcButton,
  ModusWcChip,
  ModusWcCollapse,
  ModusWcDivider,
  ModusWcIcon,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import { workflowStarterGroups, type OperationItem, type WorkflowStarterGroup } from './data';
import { setStarterDragData } from './starterDrag';

interface StudioStarterPickerProps {
  className?: string;
  includeSearch?: boolean;
  searchQuery?: string;
  selectedStarterId?: string | null;
  onSearchChange?: (query: string) => void;
  onSelectStarter?: (item: OperationItem) => void;
}

function filterStarterGroups(groups: WorkflowStarterGroup[], query: string): WorkflowStarterGroup[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(normalizedQuery)),
    }))
    .filter((group) => group.items.length > 0);
}

function StarterStepOption({
  item,
  isSelected,
  onSelect,
}: {
  item: OperationItem;
  isSelected: boolean;
  onSelect: (item: OperationItem) => void;
}) {
  const didDragRef = useRef(false);

  return (
    <button
      type="button"
      className={`studio-canvas-action-card studio-canvas-starter-option${isSelected ? ' is-selected' : ''}`}
      aria-pressed={isSelected}
      draggable
      onClick={() => {
        if (didDragRef.current) {
          didDragRef.current = false;
          return;
        }
        onSelect(item);
      }}
      onDragEnd={() => {
        didDragRef.current = false;
      }}
      onDragStart={(event) => {
        didDragRef.current = true;
        setStarterDragData(event, item.id);
      }}
    >
      <div className="studio-canvas-action-card-header">
        <span className="studio-canvas-action-card-title">{item.label}</span>
      </div>
      <div className="studio-canvas-action-card-body">
        <p className="studio-canvas-starter-option-meta">
          <ModusWcIcon decorative name={item.icon} size="sm" variant="solid" />
          Start trigger
        </p>
        <ModusWcIcon
          decorative
          name="drag_indicator"
          size="sm"
          customClass="studio-canvas-action-card-drag"
        />
      </div>
    </button>
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
  onSelectStarter?: (item: OperationItem) => void;
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
        <div className="studio-canvas-category-steps studio-canvas-starter-group-content" aria-label={`${group.label} steps`}>
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
    Object.fromEntries(workflowStarterGroups.map((group) => [group.id, true])),
  );

  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const filteredStarterGroups = useMemo(
    () => filterStarterGroups(workflowStarterGroups, searchQuery),
    [searchQuery],
  );
  const hasExpandedGroup = useMemo(
    () => filteredStarterGroups.some((group) => expandedStarterGroups[group.id]),
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

      <div className="studio-workflow-action-picker-controls">
        <ModusWcButton
          color="primary"
          customClass="studio-canvas-expand-all"
          onButtonClick={() => setAllGroupsExpanded(true)}
          size="sm"
          variant="borderless"
        >
          Expand all
        </ModusWcButton>
        <ModusWcDivider customClass="studio-canvas-control-divider" orientation="vertical" />
        <ModusWcButton
          color="tertiary"
          customClass="studio-canvas-collapse-all"
          disabled={!hasExpandedGroup}
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
            expanded={expandedStarterGroups[group.id] ?? true}
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
