import {
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
} from '@trimble-oss/moduswebcomponents-react';
import type { DiscoverFlow } from './FlowDetailView';
import FlowsEmptyState from './FlowsEmptyState';

export type FlowMenuAction = 'edit' | 'duplicate' | 'activity' | 'turn-off' | 'delete';

interface FlowsTabProps {
  flows: DiscoverFlow[];
  activeFlowIds: string[];
  getFlowTitle: (flow: DiscoverFlow, instanceId?: string) => string;
  onBrowseTemplates: () => void;
  onFlowAction: (instanceId: string, action: FlowMenuAction) => void;
}

const flowMenuItems: { action: FlowMenuAction; label: string }[] = [
  { action: 'edit', label: 'Edit' },
  { action: 'duplicate', label: 'Duplicate' },
  { action: 'activity', label: 'Activity' },
  { action: 'turn-off', label: 'Turn Off' },
  { action: 'delete', label: 'Delete' },
];

function getFlowForInstance(flows: DiscoverFlow[], instanceId: string) {
  const flowId = instanceId.split('::')[0];
  return flows.find((flow) => flow.id === flowId) ?? null;
}

function closeDropdownMenu(event: CustomEvent<{ value: string }>) {
  const menuItem = event.target as HTMLElement | null;
  const dropdown = menuItem?.closest('modus-wc-dropdown-menu') as
    | (HTMLElement & { menuVisible?: boolean })
    | null;
  if (dropdown) {
    dropdown.menuVisible = false;
  }
}

export default function FlowsTab({
  flows,
  activeFlowIds,
  getFlowTitle,
  onBrowseTemplates,
  onFlowAction,
}: FlowsTabProps) {
  const activeFlows = activeFlowIds
    .map((instanceId) => {
      const flow = getFlowForInstance(flows, instanceId);
      return flow ? { instanceId, flow } : null;
    })
    .filter((entry): entry is { instanceId: string; flow: DiscoverFlow } => entry !== null);

  if (activeFlows.length === 0) {
    return (
      <div className="workflows-flows">
        <FlowsEmptyState onBrowseTemplates={onBrowseTemplates} />
      </div>
    );
  }

  return (
    <div className="workflows-flows">
      <div className="workflows-active-flow-list">
        {activeFlows.map(({ instanceId, flow }) => (
          <article key={instanceId} className="workflows-active-flow-card">
            <div className="workflows-active-flow-icons" aria-hidden="true">
              {flow.icons.map((icon) => (
                <span key={icon} className="workflows-active-flow-icon">
                  <ModusWcIcon decorative name={icon} size="sm" />
                </span>
              ))}
            </div>

            <div className="workflows-active-flow-content">
              <h3 className="workflows-active-flow-title">{getFlowTitle(flow, instanceId)}</h3>
              <p className="workflows-active-flow-status">
                <span className="workflows-active-flow-status-dot" aria-hidden="true" />
                Active
              </p>
            </div>

            <ModusWcDropdownMenu
              buttonVariant="borderless"
              buttonSize="sm"
              buttonAriaLabel={`More actions for ${getFlowTitle(flow, instanceId)}`}
              menuPlacement="bottom-end"
              menuBordered
              customClass="workflows-active-flow-menu-dropdown"
            >
              <ModusWcIcon slot="button" decorative name="more_vertical" size="sm" />
              <div slot="menu">
                {flowMenuItems.map((item) => (
                  <ModusWcMenuItem
                    key={item.action}
                    label={item.label}
                    value={item.action}
                    onItemSelect={(event) => {
                      closeDropdownMenu(event);
                      onFlowAction(instanceId, item.action);
                    }}
                  />
                ))}
              </div>
            </ModusWcDropdownMenu>
          </article>
        ))}
      </div>
    </div>
  );
}
