import { useEffect, useState } from 'react';
import { StudioHeader } from './StudioShell';
import StudioSideNav from './StudioSideNav';
import StudioDashboard from './StudioDashboard';
import StudioMyWorkflows from './StudioMyWorkflows';
import StudioActivity from './StudioActivity';
import StudioCanvas, { type StudioCanvasMode } from './StudioCanvas';
import {
  studioTemplateGroups,
  type StudioTemplate,
  type StudioView,
  type StudioViewportMode,
  type StudioWorkspaceTab,
} from './data';
import {
  generateWorkflow,
  type WorkflowGenerationPhase,
  type WorkflowModel,
} from './workflowGenerator';
import type { PanelWorkflowCanvasPayload } from './panelWorkflowBridge';
import {
  findSavedWorkflowTemplate,
  type StudioSavedWorkflow,
} from './studioSavedWorkflows';
import './WorkflowsStudio.css';

const SAVED_WORKFLOWS_STORAGE_KEY = 'workflows-studio.saved-workflows';

function readSavedWorkflowsFromStorage(): StudioSavedWorkflow[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SAVED_WORKFLOWS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as StudioSavedWorkflow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface WorkflowsStudioAppProps {
  onBack: () => void;
  initialMode?: StudioViewportMode;
  panelWorkflow?: PanelWorkflowCanvasPayload | null;
}

export default function WorkflowsStudioApp({
  onBack,
  initialMode = 'dashboard',
  panelWorkflow = null,
}: WorkflowsStudioAppProps) {
  const [sideNavExpanded, setSideNavExpanded] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<StudioWorkspaceTab>('discover');
  const [view, setView] = useState<StudioView>(
    panelWorkflow || initialMode === 'canvas' ? 'canvas' : 'discover',
  );
  const [selectedTemplate, setSelectedTemplate] = useState<StudioTemplate | null>(null);
  const [canvasMode, setCanvasMode] = useState<StudioCanvasMode>('edit');
  const [highlightStartNode, setHighlightStartNode] = useState(
    !panelWorkflow && initialMode === 'canvas',
  );
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowModel | null>(null);
  const [importedPanelWorkflow, setImportedPanelWorkflow] = useState<PanelWorkflowCanvasPayload | null>(
    panelWorkflow,
  );
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<WorkflowGenerationPhase | null>(null);
  const [savedWorkflows, setSavedWorkflows] = useState<StudioSavedWorkflow[]>(() =>
    readSavedWorkflowsFromStorage(),
  );
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [restoredWorkflow, setRestoredWorkflow] = useState<StudioSavedWorkflow | null>(null);

  useEffect(() => {
    window.localStorage.setItem(SAVED_WORKFLOWS_STORAGE_KEY, JSON.stringify(savedWorkflows));
  }, [savedWorkflows]);

  const resetCanvasSession = () => {
    setSelectedTemplate(null);
    setCanvasMode('edit');
    setHighlightStartNode(false);
    setAssistantPrompt('');
    setGeneratedWorkflow(null);
    setImportedPanelWorkflow(null);
    setEditingWorkflowId(null);
    setRestoredWorkflow(null);
  };

  const handleWorkspaceTabChange = (tab: StudioWorkspaceTab) => {
    setWorkspaceTab(tab);
    setView(tab);
    resetCanvasSession();
  };

  const handleCreateNewWorkflow = () => {
    resetCanvasSession();
    setHighlightStartNode(true);
    setView('canvas');
  };

  const handleGenerateSuccess = (model: WorkflowModel) => {
    resetCanvasSession();
    setGeneratedWorkflow(model);
    setAssistantPrompt(model.prompt);
    setView('canvas');
  };

  const handleAssistantCreate = async (task: string) => {
    setIsGeneratingWorkflow(true);
    setGenerationPhase('thinking');

    try {
      const model = await generateWorkflow(task, setGenerationPhase);
      handleGenerateSuccess(model);
    } finally {
      setIsGeneratingWorkflow(false);
      setGenerationPhase(null);
    }
  };

  const handleRefineAssistantPrompt = async (refinement: string) => {
    setIsGeneratingWorkflow(true);
    setGenerationPhase('thinking');

    try {
      const model = await generateWorkflow(refinement, setGenerationPhase);
      handleGenerateSuccess(model);
    } finally {
      setIsGeneratingWorkflow(false);
      setGenerationPhase(null);
    }
  };

  const handleUseTemplate = (template: StudioTemplate) => {
    resetCanvasSession();
    setSelectedTemplate(template);
    setCanvasMode('cloned');
    setView('canvas');
  };

  const handleSaveWorkflow = (workflow: StudioSavedWorkflow) => {
    setSavedWorkflows((current) => {
      const existingIndex = current.findIndex((entry) => entry.id === workflow.id);

      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = workflow;
        return next;
      }

      return [workflow, ...current];
    });

    resetCanvasSession();
    setWorkspaceTab('my-workflows');
    setView('my-workflows');
  };

  const handleSelectSavedWorkflow = (workflow: StudioSavedWorkflow) => {
    resetCanvasSession();
    setEditingWorkflowId(workflow.id);
    setRestoredWorkflow(workflow);
    setSelectedTemplate(findSavedWorkflowTemplate(workflow.templateId, studioTemplateGroups));
    setCanvasMode('edit');
    setView('canvas');
  };

  const handleDeleteSavedWorkflow = (workflowId: string) => {
    setSavedWorkflows((current) => current.filter((workflow) => workflow.id !== workflowId));
  };

  const handleBackFromCanvas = () => {
    resetCanvasSession();
    setView('discover');
    setWorkspaceTab('discover');
  };

  const renderContent = () => {
    if (view === 'canvas') {
      return (
        <StudioCanvas
          template={selectedTemplate}
          generatedWorkflow={generatedWorkflow}
          panelWorkflow={importedPanelWorkflow}
          restoredWorkflow={restoredWorkflow}
          savedWorkflowId={editingWorkflowId}
          highlightStartNode={highlightStartNode}
          assistantPrompt={assistantPrompt}
          assistantGeneratedAt={generatedWorkflow?.generatedAt ?? null}
          canvasMode={canvasMode}
          onBack={handleBackFromCanvas}
          onRefineAssistantPrompt={handleRefineAssistantPrompt}
          onSaveWorkflow={handleSaveWorkflow}
        />
      );
    }

    if (view === 'my-workflows') {
      return (
        <StudioMyWorkflows
          workflows={savedWorkflows}
          onBrowseTemplates={() => handleWorkspaceTabChange('discover')}
          onSelectWorkflow={handleSelectSavedWorkflow}
          onWorkflowAction={(workflowId, action) => {
            if (action === 'delete') {
              handleDeleteSavedWorkflow(workflowId);
            }
          }}
        />
      );
    }

    if (view === 'activity') {
      return <StudioActivity />;
    }

    return (
      <StudioDashboard
        onBack={onBack}
        onUseTemplate={handleUseTemplate}
        onCreateNewWorkflow={handleCreateNewWorkflow}
        onAssistantCreate={handleAssistantCreate}
        isGeneratingWorkflow={isGeneratingWorkflow}
        generationPhase={generationPhase}
      />
    );
  };

  return (
    <div className="workflows-studio-app">
      <div className="workflows-studio-main">
        <StudioHeader
          menuOpen={sideNavExpanded}
          onMenuToggle={() => setSideNavExpanded((open) => !open)}
        />
        <main className="workflows-studio-viewport">
          <div className="studio-workspace">
            <StudioSideNav
              activeTab={workspaceTab}
              expanded={sideNavExpanded}
              onTabChange={handleWorkspaceTabChange}
            />
            <div
              className={`studio-workspace-content ${view === 'canvas' ? 'studio-workspace-content--canvas' : ''}`}
            >
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
