import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExplorerContent from './components/ExplorerContent';
import WorkflowsPanel from './components/WorkflowsPanel';
import WorkflowsStudioApp from './workflows-studio/WorkflowsStudioApp';
import './App.css';

function App() {
  const [workflowsOpen, setWorkflowsOpen] = useState(false);
  const [showWorkflowsStudio, setShowWorkflowsStudio] = useState(false);

  if (showWorkflowsStudio) {
    return <WorkflowsStudioApp onBack={() => setShowWorkflowsStudio(false)} />;
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
              setShowWorkflowsStudio(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
