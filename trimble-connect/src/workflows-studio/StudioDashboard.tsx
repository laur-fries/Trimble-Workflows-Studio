import { useMemo, useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import StudioAssistantPrompt from './StudioAssistantPrompt';
import WorkflowsPrimaryButton from '../components/WorkflowsPrimaryButton';
import StudioTemplateCard, { StudioTemplateList } from './StudioTemplateCard';
import { studioTemplateGroups, type StudioTemplate } from './data';
import type { WorkflowGenerationPhase } from './workflowGenerator';
import {
  filterTemplateGroups,
  flattenTemplates,
  sortTemplates,
  type StudioTemplateSortDirection,
  type StudioTemplateViewMode,
} from './studioTemplateCatalog';

interface StudioDashboardProps {
  onBack: () => void;
  onUseTemplate: (template: StudioTemplate) => void;
  onCreateNewWorkflow: () => void;
  onAssistantCreate: (task: string) => void | Promise<void>;
  isGeneratingWorkflow?: boolean;
  generationPhase?: WorkflowGenerationPhase | null;
}

const catalogTabs = studioTemplateGroups.map((group) => ({
  id: group.id,
  label: group.title,
}));

export default function StudioDashboard({
  onBack,
  onUseTemplate,
  onCreateNewWorkflow,
  onAssistantCreate,
  isGeneratingWorkflow = false,
  generationPhase = null,
}: StudioDashboardProps) {
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(() => new Set());
  const [viewMode, setViewMode] = useState<StudioTemplateViewMode>('grid');
  const [sortDirection, setSortDirection] = useState<StudioTemplateSortDirection>('asc');

  const filteredTemplateGroups = useMemo(
    () => filterTemplateGroups(studioTemplateGroups, templateSearchQuery, selectedGroupIds),
    [selectedGroupIds, templateSearchQuery],
  );

  const toggleGroupFilter = (groupId: string) => {
    setSelectedGroupIds((current) => {
      const next = new Set(current);

      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }

      return next;
    });
  };

  const sortedListTemplates = useMemo(
    () => sortTemplates(flattenTemplates(filteredTemplateGroups), 'title', sortDirection),
    [filteredTemplateGroups, sortDirection],
  );

  const handleSort = () => {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="studio-dashboard">
      <header className="studio-dashboard-header">
        <div className="studio-dashboard-toolbar">
          <ModusWcButton
            color="primary"
            customClass="studio-dashboard-back"
            onButtonClick={onBack}
            size="sm"
            variant="borderless"
          >
            <ModusWcIcon decorative name="caret_left" size="sm" />
            Back
          </ModusWcButton>

          <WorkflowsPrimaryButton onClick={onCreateNewWorkflow}>
            <ModusWcIcon decorative name="add" size="sm" />
            Create new workflow
          </WorkflowsPrimaryButton>
        </div>

        <div className="studio-dashboard-page-title">
          <h1 className="studio-dashboard-title">Welcome to Workflows</h1>
        </div>
      </header>

      <div className="studio-dashboard-content">
        <StudioAssistantPrompt
          generationPhase={generationPhase}
          isGenerating={isGeneratingWorkflow}
          onCreate={onAssistantCreate}
        />
      </div>

      <section className="studio-template-catalog" aria-label="Template catalog">
        <div className="studio-template-catalog-header">
          <div className="studio-template-toolbar-search">
            <ModusWcTextInput
              bordered
              includeSearch
              placeholder="Search templates..."
              size="md"
              value={templateSearchQuery}
              onInputChange={(event: CustomEvent) => {
                setTemplateSearchQuery(event.detail?.target?.value || '');
              }}
            />
          </div>

          <div className="studio-template-catalog-tabs" role="group" aria-label="Template groups">
            {catalogTabs.map((tab) => {
              const isSelected = selectedGroupIds.has(tab.id);

              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`studio-template-catalog-tab${isSelected ? ' is-active' : ''}`}
                  onClick={() => toggleGroupFilter(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="studio-template-view-toggle" role="group" aria-label="Template view mode">
            <ModusWcButton
              aria-label="Card grid view"
              aria-pressed={viewMode === 'grid'}
              color={viewMode === 'grid' ? 'primary' : 'tertiary'}
              customClass="studio-template-view-btn"
              shape="square"
              size="sm"
              variant={viewMode === 'grid' ? 'filled' : 'outlined'}
              onButtonClick={() => setViewMode('grid')}
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
              onButtonClick={() => setViewMode('list')}
            >
              <ModusWcIcon decorative name="view_list" size="sm" />
            </ModusWcButton>
          </div>
        </div>

        {filteredTemplateGroups.length === 0 ? (
          <p className="studio-template-empty-results">No templates match your search.</p>
        ) : viewMode === 'list' ? (
          <StudioTemplateList
            templates={sortedListTemplates}
            sortDirection={sortDirection}
            onUseTemplate={onUseTemplate}
            onSort={handleSort}
          />
        ) : (
          filteredTemplateGroups.map((group) => (
            <section key={group.id} className="studio-template-group" aria-label={group.title}>
              <div className="studio-template-group-heading">
                <h2 className="studio-template-group-title">{group.title}</h2>
                {group.subtitle ? (
                  <p className="studio-template-group-subtitle">{group.subtitle}</p>
                ) : null}
              </div>

              <div className="studio-template-grid">
                {group.templates.map((template) => (
                  <StudioTemplateCard
                    key={template.id}
                    template={template}
                    onUseTemplate={onUseTemplate}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </section>
    </div>
  );
}
