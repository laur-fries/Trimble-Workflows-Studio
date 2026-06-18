import {
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
} from '@trimble-oss/moduswebcomponents-react';
import type { StudioSavedWorkflow } from './studioSavedWorkflows';

type WorkflowMenuAction = 'edit' | 'delete';

interface StudioMyWorkflowsProps {
  workflows: StudioSavedWorkflow[];
  onBrowseTemplates: () => void;
  onSelectWorkflow: (workflow: StudioSavedWorkflow) => void;
  onWorkflowAction: (workflowId: string, action: WorkflowMenuAction) => void;
}

const workflowMenuItems: { action: WorkflowMenuAction; label: string }[] = [
  { action: 'edit', label: 'Edit' },
  { action: 'delete', label: 'Delete' },
];

function closeDropdownMenu(event: CustomEvent<{ value: string }>) {
  const menuItem = event.target as HTMLElement | null;
  const dropdown = menuItem?.closest('modus-wc-dropdown-menu') as
    | (HTMLElement & { menuVisible?: boolean })
    | null;

  if (dropdown) {
    dropdown.menuVisible = false;
  }
}

export default function StudioMyWorkflows({
  workflows,
  onBrowseTemplates,
  onSelectWorkflow,
  onWorkflowAction,
}: StudioMyWorkflowsProps) {
  if (workflows.length === 0) {
    return (
      <div className="studio-my-workflows">
        <header className="studio-workspace-page-header">
          <h1 className="studio-workspace-page-title">My workflows</h1>
        </header>

        <div className="modus-empty-state studio-my-workflows-empty">
          <div className="studio-my-workflows-empty-illustration" aria-hidden="true">
            <ModusWcIcon decorative name="flowchart" size="lg" />
          </div>
          <h2 className="studio-my-workflows-empty-title">No workflows yet</h2>
          <p className="studio-my-workflows-empty-message">
            Workflows you create or turn on will appear here.
          </p>
          <button type="button" className="studio-my-workflows-empty-link" onClick={onBrowseTemplates}>
            Browse templates in Discover
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="studio-my-workflows studio-my-workflows--list">
      <header className="studio-workspace-page-header">
        <h1 className="studio-workspace-page-title">My workflows</h1>
      </header>

      <div className="workflows-flows">
        <div className="workflows-active-flow-list">
          {workflows.map((workflow) => (
            <article key={workflow.id} className="workflows-active-flow-card">
              <button
                type="button"
                className="workflows-active-flow-card-select"
                onClick={() => onSelectWorkflow(workflow)}
              >
                <div className="workflows-active-flow-icons" aria-hidden="true">
                  {workflow.icons.map((icon) => (
                    <span key={icon} className="workflows-active-flow-icon">
                      <ModusWcIcon decorative name={icon} size="sm" />
                    </span>
                  ))}
                </div>

                <div className="workflows-active-flow-content">
                  <h2 className="workflows-active-flow-title">{workflow.title}</h2>
                  <p className="workflows-active-flow-status">
                    <span className="workflows-active-flow-status-dot" aria-hidden="true" />
                    Active
                  </p>
                </div>
              </button>

              <div
                className="workflows-active-flow-menu"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <ModusWcDropdownMenu
                  buttonVariant="borderless"
                  buttonSize="sm"
                  buttonAriaLabel={`More actions for ${workflow.title}`}
                  menuPlacement="bottom-end"
                  menuBordered
                  customClass="workflows-active-flow-menu-dropdown"
                >
                  <ModusWcIcon slot="button" decorative name="more_vertical" size="sm" />
                  <div slot="menu">
                    {workflowMenuItems.map((item) => (
                      <ModusWcMenuItem
                        key={item.action}
                        label={item.label}
                        value={item.action}
                        onItemSelect={(event) => {
                          closeDropdownMenu(event);
                          if (item.action === 'edit') {
                            onSelectWorkflow(workflow);
                            return;
                          }
                          onWorkflowAction(workflow.id, item.action);
                        }}
                      />
                    ))}
                  </div>
                </ModusWcDropdownMenu>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
