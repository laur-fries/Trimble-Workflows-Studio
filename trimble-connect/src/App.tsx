import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExplorerContent from './components/ExplorerContent';
import WorkflowsPanel from './components/WorkflowsPanel';
import WorkflowsStudioApp from './workflows-studio/WorkflowsStudioApp';
import type { PanelWorkflowCanvasPayload } from './workflows-studio/panelWorkflowBridge';
import './App.css';

function App() {
  const [workflowsOpen, setWorkflowsOpen] = useState(false);
  const [showWorkflowsStudio, setShowWorkflowsStudio] = useState(false);
  const [panelWorkflowPayload, setPanelWorkflowPayload] = useState<PanelWorkflowCanvasPayload | null>(null);

  if (showWorkflowsStudio) {
    return (
      <WorkflowsStudioApp
        panelWorkflow={panelWorkflowPayload}
        onBack={() => {
          setShowWorkflowsStudio(false);
          setPanelWorkflowPayload(null);
        }}
      />
    );
  }

  return (
    <div className="app-layout">
      <Navbar
        workflowsOpen={workflowsOpen}
        onToggleWorkflows={() => setWorkflowsOpen((open) => !open)}
      />
      <div className="app-body">
        <Sidebar />
        <div className="main-workspace">
          <ExplorerContent />
          <WorkflowsPanel
            isOpen={workflowsOpen}
            onClose={() => setWorkflowsOpen(false)}
            onOpenStudio={() => {
              setWorkflowsOpen(false);
              setPanelWorkflowPayload(null);
              setShowWorkflowsStudio(true);
            }}
            onEditFlowInStudio={(payload) => {
              setWorkflowsOpen(false);
              setPanelWorkflowPayload(payload);
              setShowWorkflowsStudio(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
