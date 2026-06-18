import { useMemo, useRef, useState } from 'react';
import {
  ModusWcAccordion,
  ModusWcButton,
  ModusWcChip,
  ModusWcCollapse,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import type { WorkflowActionCategory, WorkflowActionItem } from './data';
import StudioProductIcon from './StudioProductIcon';
import { resolveActionProduct } from './studioProductIcons';
import { setActionDragData } from './starterDrag';
import {
  getGroupedWorkflowActionCategories,
  workflowGroupByOptions,
  type WorkflowGroupBy,
} from './workflowActionLibrary';

interface StudioWorkflowActionPickerProps {
  className?: string;
  includeSearch?: boolean;
  instanceId?: string;
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
          item.category,
          item.fileType,
          item.action,
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

function closeDropdownMenu(event: CustomEvent<{ value: string }>) {
  const menuItem = event.target as HTMLElement | null;
  const dropdown = menuItem?.closest('modus-wc-dropdown-menu') as
    | (HTMLElement & { menuVisible?: boolean })
    | null;
  if (dropdown) {
    dropdown.menuVisible = false;
  }
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
  const product = resolveActionProduct(item);
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
        {product ? <StudioProductIcon product={product} /> : null}
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
  collapseId,
  expanded,
  selectedActionId,
  onExpandedChange,
  onSelectAction,
}: {
  category: WorkflowActionCategory;
  collapseId: string;
  expanded: boolean;
  selectedActionId?: string | null;
  onExpandedChange: (expanded: boolean) => void;
  onSelectAction?: (item: WorkflowActionItem) => void;
}) {
  return (
    <ModusWcCollapse
      bordered={false}
      collapseId={collapseId}
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
  instanceId = 'default',
  searchQuery: controlledSearchQuery,
  selectedActionId = null,
  onSearchChange,
  onSelectAction,
}: StudioWorkflowActionPickerProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<WorkflowGroupBy>('category');
  const selectedGroupLabel =
    workflowGroupByOptions.find((option) => option.value === groupBy)?.label ?? 'Category';
  const groupedCategories = useMemo(
    () => getGroupedWorkflowActionCategories(groupBy),
    [groupBy],
  );
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() =>
    createDefaultExpandedState(getGroupedWorkflowActionCategories('category')),
  );

  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const filteredCategories = useMemo(
    () => filterActionCategories(groupedCategories, searchQuery),
    [groupedCategories, searchQuery],
  );
  const hasExpandedCategory = useMemo(
    () => filteredCategories.some((category) => expandedCategories[category.id]),
    [expandedCategories, filteredCategories],
  );

  const handleGroupBySelect = (nextGroupBy: WorkflowGroupBy) => {
    if (nextGroupBy === groupBy) {
      return;
    }

    setGroupBy(nextGroupBy);
    setExpandedCategories(
      Object.fromEntries(
        getGroupedWorkflowActionCategories(nextGroupBy).map((category) => [category.id, false]),
      ),
    );
  };

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
        <div className="studio-workflow-action-picker-control-links">
          <ModusWcButton
            color="primary"
            customClass="studio-canvas-expand-all"
            onButtonClick={() => setAllCategoriesExpanded(true)}
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
            disabled={!hasExpandedCategory}
            onButtonClick={() => setAllCategoriesExpanded(false)}
            size="sm"
            variant="borderless"
          >
            Collapse all
          </ModusWcButton>
        </div>

        <div className="studio-canvas-group-by-dropdown">
          <ModusWcDropdownMenu
            buttonVariant="outlined"
            buttonSize="sm"
            buttonAriaLabel="Group workflow steps"
            menuPlacement="bottom-start"
            menuBordered
            customClass="studio-canvas-group-by-menu"
          >
            <span slot="button" className="studio-canvas-group-by-button">
              Group by: {selectedGroupLabel}
              <ModusWcIcon decorative name="caret_down" size="sm" />
            </span>
            <div slot="menu">
              {workflowGroupByOptions.map((option) => (
                <ModusWcMenuItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  onItemSelect={(event) => {
                    closeDropdownMenu(event);
                    if (option.value !== groupBy) {
                      handleGroupBySelect(option.value);
                    }
                  }}
                />
              ))}
            </div>
          </ModusWcDropdownMenu>
        </div>
      </div>

      <ModusWcAccordion
        key={`studio-action-groups-${instanceId}-${groupBy}`}
        customClass="studio-canvas-categories-accordion"
      >
        {filteredCategories.map((category) => (
          <ActionCategoryCollapse
            key={category.id}
            category={category}
            collapseId={`studio-action-category-${instanceId}-${category.id}`}
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
