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
import type { WorkflowActionCategory, WorkflowActionItem } from './data';
import { setActionDragData } from './starterDrag';
import { getAllWorkflowActionCategories } from './workflowActionLibrary';

interface StudioWorkflowActionPickerProps {
  className?: string;
  includeSearch?: boolean;
  searchQuery?: string;
  selectedActionId?: string | null;
  onSearchChange?: (query: string) => void;
  onSelectAction?: (item: WorkflowActionItem) => void;
}

function filterActionCategories(
  categories: WorkflowActionCategory[],
  query: string,
): WorkflowActionCategory[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return categories;
  }

  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const haystack = [
          item.label,
          item.description,
          item.provider,
          item.specTag,
          item.version,
          ...(item.tags ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    }))
    .filter((category) => category.items.length > 0);
}

function createDefaultExpandedState(categories: WorkflowActionCategory[]) {
  return Object.fromEntries(
    categories.map((category) => [category.id, category.defaultExpanded ?? false]),
  );
}

function ActionLibraryItem({
  item,
  isSelected,
  onSelect,
}: {
  item: WorkflowActionItem;
  isSelected: boolean;
  onSelect: (item: WorkflowActionItem) => void;
}) {
  const didDragRef = useRef(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const description = item.description ?? item.tags?.join(' · ') ?? '';
  const descriptionPreviewLimit = 110;
  const canExpandDescription = description.length > descriptionPreviewLimit;
  const visibleDescription =
    descriptionExpanded || !canExpandDescription
      ? description
      : `${description.slice(0, descriptionPreviewLimit).trim()}...`;

  return (
    <div
      className={`studio-canvas-action-card${isSelected ? ' is-selected' : ''}`}
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
        setActionDragData(event, item.id);
      }}
    >
      <div className="studio-canvas-action-card-header">
        <span className="studio-canvas-action-card-title">{item.label}</span>
      </div>

      {item.provider && (
        <p className="studio-canvas-action-card-provider">
          by{' '}
          <span className="studio-canvas-action-card-provider-brand">
            <ModusWcIcon decorative name={item.icon} size="sm" variant="solid" />
            {item.provider}
          </span>
        </p>
      )}

      {description && (
        <div className="studio-canvas-action-card-body">
          <p className="studio-canvas-action-card-description">
            {visibleDescription}
            {canExpandDescription && !descriptionExpanded && (
              <button
                type="button"
                className="studio-canvas-action-card-show-more"
                onClick={(event) => {
                  event.stopPropagation();
                  setDescriptionExpanded(true);
                }}
              >
                Show more...
              </button>
            )}
          </p>
          <ModusWcIcon
            decorative
            name="drag_indicator"
            size="sm"
            customClass="studio-canvas-action-card-drag"
          />
        </div>
      )}

      {item.specTag && (
        <div className="studio-canvas-action-card-footer">
          <span className="studio-canvas-action-card-spec-tag">{item.specTag}</span>
        </div>
      )}
    </div>
  );
}

function ActionCategoryCollapse({
  category,
  expanded,
  selectedActionId,
  onExpandedChange,
  onSelectAction,
}: {
  category: WorkflowActionCategory;
  expanded: boolean;
  selectedActionId?: string | null;
  onExpandedChange: (expanded: boolean) => void;
  onSelectAction?: (item: WorkflowActionItem) => void;
}) {
  return (
    <ModusWcCollapse
      bordered={false}
      collapseId={`studio-action-category-${category.id}`}
      customClass="studio-canvas-category-collapse"
      expanded={expanded}
      onExpandedChange={(event) => onExpandedChange(event.detail.expanded)}
    >
      <div slot="header" className="studio-canvas-category-header">
        <span className="studio-canvas-category-title">{category.label}</span>
        <ModusWcChip
          customClass="studio-canvas-category-count"
          shape="circle"
          size="sm"
          variant="outline"
        >
          {category.items.length}
        </ModusWcChip>
      </div>
      <div slot="content" className="studio-canvas-category-content studio-canvas-category-content--actions">
        <div className="studio-canvas-category-steps" aria-label={`${category.label} steps`}>
          {category.items.map((item) => (
            <ActionLibraryItem
              key={item.id}
              item={item}
              isSelected={selectedActionId === item.id}
              onSelect={(action) => onSelectAction?.(action)}
            />
          ))}
        </div>
      </div>
    </ModusWcCollapse>
  );
}

export default function StudioWorkflowActionPicker({
  className = '',
  includeSearch = false,
  searchQuery: controlledSearchQuery,
  selectedActionId = null,
  onSearchChange,
  onSelectAction,
}: StudioWorkflowActionPickerProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const allActionCategories = useMemo(() => getAllWorkflowActionCategories(), []);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() =>
    createDefaultExpandedState(getAllWorkflowActionCategories()),
  );

  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const filteredCategories = useMemo(
    () => filterActionCategories(allActionCategories, searchQuery),
    [allActionCategories, searchQuery],
  );
  const hasExpandedCategory = useMemo(
    () => filteredCategories.some((category) => expandedCategories[category.id]),
    [expandedCategories, filteredCategories],
  );

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
      return;
    }
    setInternalSearchQuery(query);
  };

  const setAllCategoriesExpanded = (expanded: boolean) => {
    setExpandedCategories(
      Object.fromEntries(filteredCategories.map((category) => [category.id, expanded])),
    );
  };

  return (
    <div className={`studio-workflow-action-picker${className ? ` ${className}` : ''}`}>
      {includeSearch && (
        <div className="studio-workflow-action-picker-search">
          <ModusWcTextInput
            bordered
            includeSearch
            placeholder="Search steps..."
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
          onButtonClick={() => setAllCategoriesExpanded(true)}
          size="sm"
          variant="borderless"
        >
          Expand all
        </ModusWcButton>
        <ModusWcDivider customClass="studio-canvas-control-divider" orientation="vertical" />
        <ModusWcButton
          color="tertiary"
          customClass="studio-canvas-collapse-all"
          disabled={!hasExpandedCategory}
          onButtonClick={() => setAllCategoriesExpanded(false)}
          size="sm"
          variant="borderless"
        >
          Collapse all
        </ModusWcButton>
      </div>

      <ModusWcAccordion customClass="studio-canvas-categories-accordion">
        {filteredCategories.map((category) => (
          <ActionCategoryCollapse
            key={category.id}
            category={category}
            expanded={expandedCategories[category.id] ?? false}
            selectedActionId={selectedActionId}
            onExpandedChange={(expanded) =>
              setExpandedCategories((current) => ({ ...current, [category.id]: expanded }))
            }
            onSelectAction={onSelectAction}
          />
        ))}
      </ModusWcAccordion>
    </div>
  );
}
