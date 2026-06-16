import { ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  indent?: boolean;
  badge?: boolean;
  expandable?: boolean;
}

interface NavSection {
  title?: string;
  expandable?: boolean;
  expanded?: boolean;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: 'Data',
    expandable: true,
    expanded: true,
    items: [
      { icon: 'folder_closed', label: 'Explorer', active: true, indent: true },
      { icon: 'view_list', label: 'Views', indent: true },
      { icon: 'tag', label: 'Releases', indent: true },
    ],
  },
  {
    items: [
      { icon: 'history', label: 'Activity' },
      { icon: 'comment', label: 'BCF Topics' },
      { icon: 'flowchart', label: 'Workflows' },
    ],
  },
  {
    items: [
      { icon: 'check_circle', label: 'ToDo', badge: true },
      { icon: 'people_group', label: 'Team' },
      { icon: 'list_shapes', label: 'Property Set Libraries' },
    ],
  },
  {
    items: [
      { icon: 'settings', label: 'Settings', expandable: true },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-back">
        <ModusWcIcon decorative name="arrow_left" size="sm" variant="solid" />
        <span>All Projects</span>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="sidebar-section">
          {section.title && (
            <div className="sidebar-section-header">
              <span>{section.title}</span>
              {section.expandable && (
                <ModusWcIcon
                  decorative
                  name={section.expanded ? 'caret_up' : 'caret_down'}
                  size="sm"
                  variant="solid"
                />
              )}
            </div>
          )}
          {section.items.map((item, iIdx) => (
            <div
              key={iIdx}
              className={`sidebar-item ${item.active ? 'active' : ''} ${item.indent ? 'indented' : ''}`}
            >
              <ModusWcIcon decorative name={item.icon} size="sm" variant="solid" />
              <span className="sidebar-item-label">{item.label}</span>
              {item.badge && <span className="sidebar-badge" />}
              {item.expandable && <ModusWcIcon decorative name="caret_down" size="sm" variant="solid" />}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
