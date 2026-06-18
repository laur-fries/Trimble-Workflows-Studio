import { useMemo, useRef, useState } from 'react';
import {
  ModusWcCollapse,
  ModusWcIcon,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import {
  recentlyUsedStepIds,
  type OperationItem,
  type WorkflowActionItem,
} from './data';
import StudioStarterPicker from './StudioStarterPicker';
import StudioWorkflowActionPicker from './StudioWorkflowActionPicker';
import { setActionDragData } from './starterDrag';
import { getAllWorkflowActions } from './workflowActionLibrary';

export type StepsPanelMode = 'starter' | 'actions';

interface StudioCanvasStepsPanelProps {
  panelMode?: StepsPanelMode;
  selectedActionId?: string | null;
  selectedStarterId?: string | null;
  onCollapse: () => void;
  onSelectAction?: (item: WorkflowActionItem) => void;
  onSelectStarter?: (item: OperationItem) => void;
}

function RecentlyUsedItem({
  isSelected,
  item,
  onSelect,
}: {
  isSelected: boolean;
  item: WorkflowActionItem;
  onSelect?: (item: WorkflowActionItem) => void;
}) {
  const didDragRef = useRef(false);

  return (
    <button
      type="button"
      className={`studio-canvas-recent-item${isSelected ? ' is-selected' : ''}`}
      aria-pressed={isSelected}
      draggable
      title={item.label}
      onClick={() => {
        if (didDragRef.current) {
          didDragRef.current = false;
          return;
        }
        onSelect?.(item);
      }}
      onDragEnd={() => {
        didDragRef.current = false;
      }}
      onDragStart={(event) => {
        didDragRef.current = true;
        setActionDragData(event, item.id);
      }}
    >
      <span className="studio-canvas-recent-item-label">{item.label}</span>
      <ModusWcIcon decorative name="drag_indicator" size="sm" customClass="studio-canvas-recent-drag" />
    </button>
  );
}

export default function StudioCanvasStepsPanel({
  panelMode = 'starter',
  selectedActionId = null,
  selectedStarterId = null,
  onCollapse,
  onSelectAction,
  onSelectStarter,
}: StudioCanvasStepsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyUsedExpanded, setRecentlyUsedExpanded] = useState(true);
  const isStarterMode = panelMode === 'starter';

  const allContextActions = useMemo(() => getAllWorkflowActions(), []);
  const recentlyUsed = useMemo(
    () =>
      recentlyUsedStepIds
        .map((id) => allContextActions.find((item) => item.id === id))
        .filter(Boolean) as WorkflowActionItem[],
    [allContextActions],
  );

  return (
    <aside className="studio-canvas-steps-panel" aria-label="Steps library">
      <div className="studio-canvas-steps-panel-main">
        <div className="studio-canvas-steps-panel-header">
          <ModusWcTypography hierarchy="h5" weight="semibold" customClass="studio-canvas-steps-panel-title">
            {isStarterMode ? 'Trigger' : 'Steps'}
          </ModusWcTypography>
          <p className="studio-canvas-steps-panel-subtitle">
            {isStarterMode
              ? 'Choose how to start your workflow. This event or schedule will launch your flow.'
              : 'Add the next workflow action from the library.'}
          </p>
        </div>

        <div className="studio-canvas-steps-panel-body">
          <div className="studio-canvas-steps-section studio-canvas-steps-section--search">
            <ModusWcTextInput
              bordered
              includeSearch
              placeholder={isStarterMode ? 'Search starters...' : 'Search steps...'}
              size="md"
              value={searchQuery}
              onInputChange={(event: CustomEvent) => {
                setSearchQuery(event.detail?.target?.value || '');
              }}
            />
          </div>

          {isStarterMode ? (
            <div className="studio-canvas-steps-section studio-canvas-steps-section--starters">
              <StudioStarterPicker
                searchQuery={searchQuery}
                selectedStarterId={selectedStarterId}
                onSelectStarter={onSelectStarter}
              />
            </div>
          ) : (
            <>
              <div className="studio-canvas-steps-section studio-canvas-steps-section--recent">
                <ModusWcCollapse
                  bordered={false}
                  collapseId="studio-recently-used"
                  customClass="studio-canvas-recently-used-collapse"
                  expanded={recentlyUsedExpanded}
                  onExpandedChange={(event) => setRecentlyUsedExpanded(event.detail.expanded)}
                >
                  <div slot="header" className="studio-canvas-recently-used-header">
                    <ModusWcIcon decorative name="history" size="sm" />
                    <span className="studio-canvas-recently-used-title">Recently used</span>
                  </div>
                  <div slot="content" className="studio-canvas-recently-used-list">
                    {recentlyUsed.map((item) => (
                      <RecentlyUsedItem
                        key={item.id}
                        isSelected={selectedActionId === item.id}
                        item={item}
                        onSelect={onSelectAction}
                      />
                    ))}
                  </div>
                </ModusWcCollapse>
              </div>

              <div className="studio-canvas-steps-section studio-canvas-steps-section--categories">
                <StudioWorkflowActionPicker
                  searchQuery={searchQuery}
                  selectedActionId={selectedActionId}
                  instanceId="canvas-steps-panel"
                  onSelectAction={onSelectAction}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        className="studio-canvas-steps-collapse-rail"
        aria-label="Collapse steps panel"
        onClick={onCollapse}
      >
        <ModusWcIcon decorative name="caret_left" size="sm" />
        <span className="studio-canvas-steps-collapse-label">Steps</span>
      </button>
    </aside>
  );
}
