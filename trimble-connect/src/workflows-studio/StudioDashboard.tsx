import { useEffect, useMemo, useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';
import StudioAssistantPrompt from './StudioAssistantPrompt';
import WorkflowsPrimaryButton from '../components/WorkflowsPrimaryButton';
import StudioTemplateCategoryFilter from './StudioTemplateCategoryFilter';
import StudioTemplateCatalogGroups from './StudioTemplateCatalogGroups';
import { studioTemplateGroups, type StudioTemplate } from './data';
import type { WorkflowGenerationPhase } from './workflowGenerator';
import { filterTemplateGroups } from './studioTemplateCatalog';

interface StudioDashboardProps {
  onBack: () => void;
  onUseTemplate: (template: StudioTemplate) => void;
  onCreateNewWorkflow: () => void;
  onAssistantCreate: (task: string) => void | Promise<void>;
  isGeneratingWorkflow?: boolean;
  generationPhase?: WorkflowGenerationPhase | null;
}

const categoryOptions = studioTemplateGroups.map((group) => ({
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(studioTemplateGroups.map((group) => [group.id, true])),
  );

  const filteredTemplateGroups = useMemo(
    () => filterTemplateGroups(studioTemplateGroups, templateSearchQuery, selectedGroupIds),
    [selectedGroupIds, templateSearchQuery],
  );

  useEffect(() => {
    setExpandedGroups((current) =>
      Object.fromEntries(
        filteredTemplateGroups.map((group) => [group.id, current[group.id] ?? true]),
      ),
    );
  }, [filteredTemplateGroups]);

  const isGroupExpanded = (groupId: string) => expandedGroups[groupId] ?? true;

  const allGroupsExpanded = useMemo(
    () =>
      filteredTemplateGroups.length > 0 &&
      filteredTemplateGroups.every((group) => isGroupExpanded(group.id)),
    [expandedGroups, filteredTemplateGroups],
  );

  const allGroupsCollapsed = useMemo(
    () =>
      filteredTemplateGroups.length > 0 &&
      filteredTemplateGroups.every((group) => !isGroupExpanded(group.id)),
    [expandedGroups, filteredTemplateGroups],
  );

  const setAllGroupsExpanded = (expanded: boolean) => {
    setExpandedGroups(
      Object.fromEntries(filteredTemplateGroups.map((group) => [group.id, expanded])),
    );
  };

  const catalogGroupsKey = useMemo(() => {
    if (selectedGroupIds.size === 0) {
      return 'all';
    }

    return Array.from(selectedGroupIds).sort().join('|');
  }, [selectedGroupIds]);

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
            <h1 className="studio-workspace-page-title">Workflow Builder</h1>
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
          <div className="studio-template-catalog-header-main">
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

            <StudioTemplateCategoryFilter
              categories={categoryOptions}
              selectedCategoryIds={selectedGroupIds}
              onSelectedCategoryIdsChange={setSelectedGroupIds}
            />
          </div>

          {filteredTemplateGroups.length > 0 ? (
            <div className="studio-template-catalog-header-controls">
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
          ) : null}
        </div>

        {filteredTemplateGroups.length === 0 ? (
          <p className="studio-template-empty-results">No templates match your search.</p>
        ) : (
          <StudioTemplateCatalogGroups
            key={catalogGroupsKey}
            groups={filteredTemplateGroups}
            expandedGroups={expandedGroups}
            onExpandedGroupsChange={setExpandedGroups}
            onUseTemplate={onUseTemplate}
          />
        )}
      </section>
    </div>
  );
}
