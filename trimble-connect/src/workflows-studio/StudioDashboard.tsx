import { useMemo, useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import StudioAssistantPrompt from './StudioAssistantPrompt';
import WorkflowsPrimaryButton from '../components/WorkflowsPrimaryButton';
import StudioTemplateCatalogGroups from './StudioTemplateCatalogGroups';
import { studioTemplateGroups, type StudioTemplate } from './data';
import type { WorkflowGenerationPhase } from './workflowGenerator';
import {
  filterTemplateGroups,
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

  const handleSort = () => {
    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="studio-dashboard">
      <header className="studio-dashboard-header">
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

        <div className="studio-dashboard-page-header">
          <div className="studio-dashboard-page-title">
            <h1 className="studio-workspace-page-title">Workflow Studio</h1>
            <p className="studio-dashboard-subtitle">
              Start from a verified template or build a custom workflow tailored to your needs.
            </p>
          </div>

          <div className="studio-dashboard-primary-action">
            <WorkflowsPrimaryButton onClick={onCreateNewWorkflow}>
              <ModusWcIcon decorative name="add" size="sm" />
              Create workflow
            </WorkflowsPrimaryButton>
          </div>
        </div>
      </header>

      <section className="studio-dashboard-custom-entry" aria-label="Custom workflow creation">
        <StudioAssistantPrompt
          generationPhase={generationPhase}
          isGenerating={isGeneratingWorkflow}
          onCreate={onAssistantCreate}
        />
      </section>

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
        </div>

        {filteredTemplateGroups.length === 0 ? (
          <p className="studio-template-empty-results">No templates match your search.</p>
        ) : (
          <StudioTemplateCatalogGroups
            groups={filteredTemplateGroups}
            viewMode={viewMode}
            sortDirection={sortDirection}
            onSort={handleSort}
            onUseTemplate={onUseTemplate}
            onViewModeChange={setViewMode}
          />
        )}
      </section>
    </div>
  );
}
