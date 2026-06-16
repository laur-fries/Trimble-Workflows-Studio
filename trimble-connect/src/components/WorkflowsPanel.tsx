import { useEffect, useMemo, useRef, useState } from 'react';
import { ModusWcButton, ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';
import ActivityTab from './ActivityTab';
import FlowDetailView, { FlowDetailFooter } from './FlowDetailView';
import FlowStepConfigView from './FlowStepConfigView';
import FlowSuccessView, { FlowSuccessFooter } from './FlowSuccessView';
import FlowsTab, { type FlowMenuAction } from './FlowsTab';
import WorkflowsPrimaryButton from './WorkflowsPrimaryButton';
import { discoverFlows } from '../data/discoverFlows';
import {
  getFlowSteps,
  getNextStepId,
  getUnconfiguredStepIds,
  isStepConfigured,
  type StepId,
} from './flowStepConfig';
import type { DiscoverFlow } from './FlowDetailView';

type WorkflowsTab = 'discover' | 'flows' | 'activity';

interface WorkflowsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudio: () => void;
}

const tabs: { id: WorkflowsTab; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'flows', label: 'Flows' },
  { id: 'activity', label: 'Activity' },
];

type FlowStepValues = Record<string, Record<string, string>>;
type FlowActivationState = 'idle' | 'loading' | 'success';

const TURN_ON_DELAY_MS = 2000;

export default function WorkflowsPanel({ isOpen, onClose, onOpenStudio }: WorkflowsPanelProps) {
  const [activeTab, setActiveTab] = useState<WorkflowsTab>('discover');
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<StepId | null>(null);
  const [flowTitleOverrides, setFlowTitleOverrides] = useState<Record<string, string>>({});
  const [flowStepValues, setFlowStepValues] = useState<Record<string, FlowStepValues>>({});
  const [invalidStepIds, setInvalidStepIds] = useState<Set<StepId>>(new Set());
  const [showStepFieldErrors, setShowStepFieldErrors] = useState(false);
  const [flowActivationState, setFlowActivationState] = useState<FlowActivationState>('idle');
  const [activeFlowIds, setActiveFlowIds] = useState<string[]>([]);
  const turnOnTimeoutRef = useRef<number | null>(null);

  const getFlowTitle = (flow: DiscoverFlow, instanceId?: string) => {
    const baseTitle = flowTitleOverrides[flow.id] ?? flow.title;
    if (instanceId?.includes('::copy')) {
      return `${baseTitle} (Copy)`;
    }
    return baseTitle;
  };

  const selectedFlow = discoverFlows.find((flow) => flow.id === selectedFlowId) ?? null;
  const showFlowDetail = activeTab === 'discover' && selectedFlow !== null;
  const showFlowSuccess = showFlowDetail && flowActivationState === 'success';
  const showStepConfig = showFlowDetail && selectedStepId !== null && flowActivationState !== 'success';
  const showFlowOverview = showFlowDetail && selectedStepId === null && flowActivationState !== 'success';
  const showPanelTabs = !showFlowDetail || showFlowSuccess;

  const flowSteps = useMemo(
    () => (selectedFlow ? getFlowSteps(selectedFlow) : []),
    [selectedFlow],
  );

  const activeStep = flowSteps.find((step) => step.id === selectedStepId) ?? null;
  const activeStepValues = selectedFlowId && selectedStepId
    ? flowStepValues[selectedFlowId]?.[selectedStepId] ?? {}
    : {};

  useEffect(() => {
    return () => {
      if (turnOnTimeoutRef.current !== null) {
        window.clearTimeout(turnOnTimeoutRef.current);
      }
    };
  }, []);

  const resetFlowActivation = () => {
    if (turnOnTimeoutRef.current !== null) {
      window.clearTimeout(turnOnTimeoutRef.current);
      turnOnTimeoutRef.current = null;
    }
    setFlowActivationState('idle');
  };

  const handleViewInFlows = () => {
    resetFlowActivation();
    setSelectedFlowId(null);
    setSelectedStepId(null);
    setShowStepFieldErrors(false);
    setActiveTab('flows');
  };

  const handleTabChange = (tab: WorkflowsTab) => {
    setActiveTab(tab);
    setSelectedFlowId(null);
    setSelectedStepId(null);
    setShowStepFieldErrors(false);
    resetFlowActivation();
  };

  const handleFlowAction = (instanceId: string, action: FlowMenuAction) => {
    const flowId = instanceId.split('::')[0];

    switch (action) {
      case 'edit':
        setActiveTab('discover');
        setSelectedFlowId(flowId);
        setSelectedStepId(null);
        setShowStepFieldErrors(false);
        setInvalidStepIds(new Set());
        resetFlowActivation();
        break;
      case 'duplicate':
        setActiveFlowIds((current) => [...current, `${flowId}::copy-${Date.now()}`]);
        break;
      case 'activity':
        setActiveTab('activity');
        break;
      case 'turn-off':
        setActiveFlowIds((current) => current.filter((id) => id !== instanceId));
        break;
      case 'delete':
        setActiveFlowIds((current) => current.filter((id) => id !== instanceId));
        if (!instanceId.includes('::copy')) {
          setFlowTitleOverrides((current) => {
            const next = { ...current };
            delete next[flowId];
            return next;
          });
          setFlowStepValues((current) => {
            const next = { ...current };
            delete next[flowId];
            return next;
          });
        }
        break;
      default:
        break;
    }
  };

  const handleBackFromFlow = () => {
    setSelectedFlowId(null);
    setSelectedStepId(null);
    setShowStepFieldErrors(false);
    setInvalidStepIds(new Set());
    resetFlowActivation();
  };

  const handleBackFromStep = () => {
    setSelectedStepId(null);
    setShowStepFieldErrors(false);
  };

  const handleStepFieldChange = (fieldId: string, value: string) => {
    if (!selectedFlowId || !selectedStepId) {
      return;
    }

    setFlowStepValues((current) => ({
      ...current,
      [selectedFlowId]: {
        ...current[selectedFlowId],
        [selectedStepId]: {
          ...current[selectedFlowId]?.[selectedStepId],
          [fieldId]: value,
        },
      },
    }));

    if (activeStep && isStepConfigured(activeStep, { ...activeStepValues, [fieldId]: value })) {
      setInvalidStepIds((current) => {
        const next = new Set(current);
        next.delete(selectedStepId);
        return next;
      });
    }
  };

  const handleNextStep = () => {
    if (!selectedFlowId || !selectedStepId || !activeStep) {
      return;
    }

    if (activeStep.fields.length > 0 && !isStepConfigured(activeStep, activeStepValues)) {
      setShowStepFieldErrors(true);
      setInvalidStepIds((current) => new Set(current).add(selectedStepId));
      return;
    }

    setShowStepFieldErrors(false);
    const nextStepId = getNextStepId(flowSteps, selectedStepId);
    if (nextStepId) {
      setSelectedStepId(nextStepId);
      return;
    }

    setSelectedStepId(null);
  };

  const handleTurnOn = () => {
    if (!selectedFlowId || flowActivationState === 'loading') {
      return;
    }

    const stepValues = flowStepValues[selectedFlowId] ?? {};
    const unconfigured = getUnconfiguredStepIds(flowSteps, stepValues);
    if (unconfigured.length > 0) {
      setInvalidStepIds(new Set(unconfigured));
      return;
    }

    setInvalidStepIds(new Set());
    setFlowActivationState('loading');

    turnOnTimeoutRef.current = window.setTimeout(() => {
      if (selectedFlowId) {
        setActiveFlowIds((current) =>
          current.includes(selectedFlowId) ? current : [...current, selectedFlowId],
        );
      }
      setFlowActivationState('success');
      turnOnTimeoutRef.current = null;
    }, TURN_ON_DELAY_MS);
  };

  const panelHeader = showFlowSuccess ? (
    <header className="workflows-panel-header">
      <h2 className="workflows-panel-title">Workflows</h2>
      <div className="workflows-panel-header-actions">
        <button type="button" className="workflows-panel-icon-btn" aria-label="Workflows help">
          <ModusWcIcon decorative name="help" size="sm" />
        </button>
        <button type="button" className="workflows-panel-icon-btn" aria-label="Close Workflows panel" onClick={onClose}>
          <ModusWcIcon decorative name="close" size="sm" />
        </button>
      </div>
    </header>
  ) : showStepConfig && activeStep ? (
    <header className="workflows-panel-header">
      <button type="button" className="workflows-flow-back workflows-panel-title" onClick={handleBackFromStep}>
        <ModusWcIcon decorative name="caret_left" size="sm" />
        Step {activeStep.stepNumber}
      </button>
      <div className="workflows-panel-header-actions">
        <button type="button" className="workflows-panel-icon-btn" aria-label="Workflows help">
          <ModusWcIcon decorative name="help" size="sm" />
        </button>
        <button type="button" className="workflows-panel-icon-btn" aria-label="Close Workflows panel" onClick={onClose}>
          <ModusWcIcon decorative name="close" size="sm" />
        </button>
      </div>
    </header>
  ) : showFlowDetail ? (
    <header className="workflows-panel-header">
      <button type="button" className="workflows-flow-back workflows-panel-title" onClick={handleBackFromFlow}>
        <ModusWcIcon decorative name="caret_left" size="sm" />
        Workflows
      </button>
      <div className="workflows-panel-header-actions">
        <button type="button" className="workflows-panel-icon-btn" aria-label="Workflows help">
          <ModusWcIcon decorative name="help" size="sm" />
        </button>
        <button type="button" className="workflows-panel-icon-btn" aria-label="Close Workflows panel" onClick={onClose}>
          <ModusWcIcon decorative name="close" size="sm" />
        </button>
      </div>
    </header>
  ) : (
    <header className="workflows-panel-header">
      <h2 className="workflows-panel-title">Workflows</h2>
      <div className="workflows-panel-header-actions">
        <button type="button" className="workflows-panel-icon-btn" aria-label="Workflows help">
          <ModusWcIcon decorative name="help" size="sm" />
        </button>
        <button type="button" className="workflows-panel-icon-btn" aria-label="Close Workflows panel" onClick={onClose}>
          <ModusWcIcon decorative name="close" size="sm" />
        </button>
      </div>
    </header>
  );

  return (
    <aside
      className={`workflows-panel ${isOpen ? 'is-open' : ''}`}
      aria-hidden={!isOpen}
      aria-label="Workflows panel"
    >
      <div className="workflows-panel-inner">
        {panelHeader}

        {!showPanelTabs ? null : (
          <nav className="workflows-tabs" aria-label="Workflows views">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`workflows-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        <div className="workflows-panel-content">
          {showFlowSuccess && selectedFlow && (
            <FlowSuccessView title={getFlowTitle(selectedFlow)} onViewInFlows={handleViewInFlows} />
          )}

          {showStepConfig && activeStep && (
            <FlowStepConfigView
              step={activeStep}
              values={activeStepValues}
              showFieldErrors={showStepFieldErrors}
              onFieldChange={handleStepFieldChange}
            />
          )}

          {showFlowOverview && selectedFlow && (
            <FlowDetailView
              flow={selectedFlow}
              title={getFlowTitle(selectedFlow)}
              onTitleChange={(title) => {
                setFlowTitleOverrides((current) => ({ ...current, [selectedFlow.id]: title }));
              }}
              onStepSelect={(stepId) => {
                setSelectedStepId(stepId);
                setShowStepFieldErrors(false);
              }}
              invalidStepIds={invalidStepIds}
            />
          )}

          {!showFlowDetail && activeTab === 'discover' && (
            <div className="workflows-discover">
              <div className="workflows-section-header">
                <h3 className="workflows-section-title">For Trimble Connect</h3>
                <button type="button" className="workflows-section-link" onClick={onOpenStudio}>
                  View more
                  <ModusWcIcon decorative name="caret_right" size="sm" />
                </button>
              </div>

              <div className="workflows-card-list">
                {discoverFlows.map((flow) => (
                  <article
                    key={flow.id}
                    className="workflows-card"
                    onClick={() => {
                      setSelectedFlowId(flow.id);
                      setSelectedStepId(null);
                      setShowStepFieldErrors(false);
                      setInvalidStepIds(new Set());
                      resetFlowActivation();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedFlowId(flow.id);
                        setSelectedStepId(null);
                        setShowStepFieldErrors(false);
                        setInvalidStepIds(new Set());
                        resetFlowActivation();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <p className="workflows-card-category">{flow.category}</p>
                    <h4 className="workflows-card-title">{getFlowTitle(flow)}</h4>
                    <div className="workflows-card-icons">
                      {flow.icons.map((icon) => (
                        <span key={icon} className="workflows-card-icon">
                          <ModusWcIcon decorative name={icon} size="sm" />
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {!showFlowDetail && activeTab === 'flows' && (
            <FlowsTab
              flows={discoverFlows}
              activeFlowIds={activeFlowIds}
              getFlowTitle={getFlowTitle}
              onBrowseTemplates={() => setActiveTab('discover')}
              onFlowAction={handleFlowAction}
            />
          )}

          {!showFlowDetail && activeTab === 'activity' && <ActivityTab />}
        </div>

        {showFlowSuccess ? (
          <FlowSuccessFooter onOpenStudio={onOpenStudio} />
        ) : showFlowOverview ? (
          <FlowDetailFooter onTurnOn={handleTurnOn} isLoading={flowActivationState === 'loading'} />
        ) : showStepConfig && activeStep ? (
          <footer className="workflows-flow-detail-footer workflows-step-config-panel-footer">
            <WorkflowsPrimaryButton fullWidth onClick={handleNextStep}>
              {getNextStepId(flowSteps, activeStep.id) !== null ? 'Next step' : 'Done'}
            </WorkflowsPrimaryButton>
          </footer>
        ) : !showStepConfig ? (
          <footer className="workflows-panel-footer">
            <ModusWcButton
              color="primary"
              variant="borderless"
              size="sm"
              onButtonClick={onOpenStudio}
            >
              <ModusWcIcon decorative name="launch" size="sm" />
              Do more in Trimble Workflows
            </ModusWcButton>
          </footer>
        ) : null}
      </div>
    </aside>
  );
}
