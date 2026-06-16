import {
  ModusWcIcon,
  ModusWcMenu,
  ModusWcMenuItem,
} from '@trimble-oss/moduswebcomponents-react';
import type { StudioWorkspaceTab } from './data';

interface StudioSideNavProps {
  activeTab: StudioWorkspaceTab;
  expanded: boolean;
  onTabChange: (tab: StudioWorkspaceTab) => void;
}

const navItems: { id: StudioWorkspaceTab; label: string; icon: string }[] = [
  { id: 'discover', label: 'Discover', icon: 'search' },
  { id: 'my-workflows', label: 'My Workflows', icon: 'flowchart' },
];

export default function StudioSideNav({ activeTab, expanded, onTabChange }: StudioSideNavProps) {
  return (
    <aside
      aria-label="Workflows navigation"
      className={`studio-side-nav ${expanded ? 'is-expanded' : 'is-collapsed'}`}
    >
      <ModusWcMenu size="lg">
        {navItems.map((item) => (
          <ModusWcMenuItem
            key={item.id}
            aria-label={item.label}
            label={expanded ? item.label : ''}
            selected={activeTab === item.id}
            value={item.id}
            onItemSelect={(event) => onTabChange(event.detail.value as StudioWorkspaceTab)}
          >
            <ModusWcIcon slot="start-icon" decorative name={item.icon} size="sm" />
          </ModusWcMenuItem>
        ))}
      </ModusWcMenu>
    </aside>
  );
}
