import { useState } from 'react';
import { StudioHeader } from './StudioShell';
import StudioSideNav from './StudioSideNav';
import StudioDashboard from './StudioDashboard';
import StudioMyWorkflows from './StudioMyWorkflows';
import StudioCanvas, { type StudioCanvasMode } from './StudioCanvas';
import type { StudioTemplate, StudioView, StudioViewportMode, StudioWorkspaceTab } from './data';
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

  const handleWorkspaceTabChange = (tab: StudioWorkspaceTab) => {
    setWorkspaceTab(tab);
    setView(tab);
    setSelectedTemplate(null);
    setCanvasMode('edit');
    setHighlightStartNode(false);
    setAssistantPrompt('');
  };

  const handleCreateNewWorkflow = () => {
    setSelectedTemplate(null);
    setAssistantPrompt('');
    setHighlightStartNode(true);
    setCanvasMode('edit');
    setView('canvas');
  };

  const handleAssistantCreate = (task: string) => {
    setSelectedTemplate(null);
    setAssistantPrompt(task);
    setHighlightStartNode(true);
    setCanvasMode('edit');
    setView('canvas');
  };

  const handleUseTemplate = (template: StudioTemplate) => {
    setSelectedTemplate(template);
    setAssistantPrompt('');
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
  };

  const renderContent = () => {
    if (view === 'canvas') {
      return (
        <StudioCanvas
          template={selectedTemplate}
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
