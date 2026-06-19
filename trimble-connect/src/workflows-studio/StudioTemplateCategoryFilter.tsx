import { useMemo, useState } from 'react';
import {
  ModusWcButton,
  ModusWcCheckbox,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';

export interface StudioTemplateCategoryOption {
  id: string;
  label: string;
}

interface StudioTemplateCategoryFilterProps {
  categories: StudioTemplateCategoryOption[];
  selectedCategoryIds: Set<string>;
  onSelectedCategoryIdsChange: (selectedCategoryIds: Set<string>) => void;
}

function formatCategoryButtonLabel(
  selectedCategoryIds: Set<string>,
  categories: StudioTemplateCategoryOption[],
): string {
  if (selectedCategoryIds.size === 0) {
    return 'Category: All';
  }

  if (selectedCategoryIds.size === 1) {
    const selectedId = [...selectedCategoryIds][0];
    const category = categories.find((entry) => entry.id === selectedId);
    return `Category: ${category?.label ?? 'Selected'}`;
  }

  return `Category: ${selectedCategoryIds.size} selected`;
}

export default function StudioTemplateCategoryFilter({
  categories,
  selectedCategoryIds,
  onSelectedCategoryIdsChange,
}: StudioTemplateCategoryFilterProps) {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCategories = useMemo(() => {
    const terms = filterQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      return categories;
    }

    return categories.filter((category) => {
      const haystack = category.label.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [categories, filterQuery]);

  const buttonLabel = formatCategoryButtonLabel(selectedCategoryIds, categories);

  const toggleCategory = (categoryId: string, checked: boolean) => {
    onSelectedCategoryIdsChange(
      (() => {
        const next = new Set(selectedCategoryIds);
        if (checked) {
          next.add(categoryId);
        } else {
          next.delete(categoryId);
        }
        return next;
      })(),
    );
  };

  const clearCategories = () => {
    onSelectedCategoryIdsChange(new Set());
  };

  return (
    <div className="studio-template-category-filter">
      <ModusWcDropdownMenu
        buttonAriaLabel="Filter template categories"
        buttonSize="sm"
        buttonVariant="outlined"
        customClass="studio-template-category-filter-menu-host"
        menuBordered
        menuPlacement="bottom-start"
        menuSize="md"
      >
        <span slot="button" className="studio-template-category-filter-button">
          {buttonLabel}
          <ModusWcIcon decorative name="caret_down" size="sm" />
        </span>
        <div slot="menu" className="studio-template-category-filter-menu">
          <div
            className="studio-template-category-filter-search"
            onClick={(event) => event.stopPropagation()}
          >
            <ModusWcTextInput
              bordered
              includeSearch
              placeholder="Filter categories..."
              size="sm"
              value={filterQuery}
              onInputChange={(event: CustomEvent) => {
                setFilterQuery(event.detail?.target?.value || '');
              }}
            />
          </div>

          <div
            className="studio-template-category-filter-options"
            role="group"
            aria-label="Template categories"
          >
            {filteredCategories.length === 0 ? (
              <p className="studio-template-category-filter-empty">No categories match your search.</p>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="studio-template-category-filter-option"
                  onClick={(event) => event.stopPropagation()}
                >
                  <ModusWcCheckbox
                    label={category.label}
                    size="sm"
                    value={selectedCategoryIds.has(category.id)}
                    onInputChange={(event: CustomEvent) => {
                      const checked = Boolean(
                        (event.detail?.target as HTMLInputElement | undefined)?.checked,
                      );
                      toggleCategory(category.id, checked);
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {selectedCategoryIds.size > 0 ? (
            <div className="studio-template-category-filter-footer">
              <ModusWcButton
                color="primary"
                onButtonClick={clearCategories}
                size="sm"
                variant="borderless"
              >
                Clear selection
              </ModusWcButton>
            </div>
          ) : null}
        </div>
      </ModusWcDropdownMenu>
    </div>
  );
}
