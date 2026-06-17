import { useState } from 'react';
import { StudioHeader } from './StudioShell';
import StudioSideNav from './StudioSideNav';
import StudioDashboard from './StudioDashboard';
import StudioMyWorkflows from './StudioMyWorkflows';
import StudioCanvas, { type StudioCanvasMode } from './StudioCanvas';
import type { StudioTemplate, StudioView, StudioViewportMode, StudioWorkspaceTab } from './data';
import {
  generateWorkflow,
  type WorkflowGenerationPhase,
  type WorkflowModel,
} from './workflowGenerator';
import './WorkflowsStudio.css';

interface WorkflowsStudioAppProps {
  onBack: () => void;
  initialMode?: StudioViewportMode;
}

export default function WorkflowsStudioApp({ onBack, initialMode = 'dashboard' }: WorkflowsStudioAppProps) {
  const [sideNavExpanded, setSideNavExpanded] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<StudioWorkspaceTab>('discover');
  const [view, setView] = useState<StudioView>(initialMode === 'canvas' ? 'canvas' : 'discover');
  const [selectedTemplate, setSelectedTemplate] = useState<StudioTemplate | null>(null);
  const [canvasMode, setCanvasMode] = useState<StudioCanvasMode>('edit');
  const [highlightStartNode, setHighlightStartNode] = useState(initialMode === 'canvas');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowModel | null>(null);
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<WorkflowGenerationPhase | null>(null);

  const handleWorkspaceTabChange = (tab: StudioWorkspaceTab) => {
    setWorkspaceTab(tab);
    setView(tab);
    setSelectedTemplate(null);
    setCanvasMode('edit');
    setHighlightStartNode(false);
    setAssistantPrompt('');
    setGeneratedWorkflow(null);
  };

  const handleCreateNewWorkflow = () => {
    setSelectedTemplate(null);
    setAssistantPrompt('');
    setGeneratedWorkflow(null);
    setHighlightStartNode(true);
    setCanvasMode('edit');
    setView('canvas');
  };

  const handleGenerateSuccess = (model: WorkflowModel) => {
    setGeneratedWorkflow(model);
    setSelectedTemplate(null);
    setAssistantPrompt(model.prompt);
    setHighlightStartNode(false);
    setCanvasMode('edit');
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

  const handleUseTemplate = (template: StudioTemplate) => {
    setSelectedTemplate(template);
    setAssistantPrompt('');
    setGeneratedWorkflow(null);
    setHighlightStartNode(false);
    setCanvasMode('edit');
    setView('canvas');
  };

  const handleBackFromCanvas = () => {
    setView('discover');
    setWorkspaceTab('discover');
    setSelectedTemplate(null);
    setCanvasMode('edit');
    setHighlightStartNode(false);
    setAssistantPrompt('');
    setGeneratedWorkflow(null);
  };

  const renderContent = () => {
    if (view === 'canvas') {
      return (
        <StudioCanvas
          template={selectedTemplate}
          generatedWorkflow={generatedWorkflow}
          highlightStartNode={highlightStartNode}
          assistantPrompt={assistantPrompt}
          canvasMode={canvasMode}
          onBack={handleBackFromCanvas}
        />
      );
    }

    if (view === 'my-workflows') {
      return <StudioMyWorkflows onBrowseTemplates={() => handleWorkspaceTabChange('discover')} />;
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
