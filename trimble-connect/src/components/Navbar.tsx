import { ModusWcNavbar, ModusWcButton, ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

const navbarVisibility = {
  ai: true,
  apps: true,
  help: true,
  mainMenu: true,
  notifications: false,
  search: true,
  searchInput: false,
  user: true,
};

const userCard = {
  avatarAlt: 'User',
  avatarSrc: '',
  email: 'user@trimble.com',
  name: 'User',
};

interface NavbarProps {
  workflowsOpen: boolean;
  onToggleWorkflows: () => void;
}

export default function Navbar({ workflowsOpen, onToggleWorkflows }: NavbarProps) {
  return (
    <ModusWcNavbar
      visibility={navbarVisibility}
      userCard={userCard}
      style={{ zIndex: 10 }}
    >
      <div slot="start" className="navbar-start">
        <img
          src="/trimbleconnect_header.svg"
          alt="Trimble Connect"
          className="navbar-connect-logo"
        />
        <span className="navbar-divider" aria-hidden="true" />
        <span className="navbar-workspace-label">
          Workflows (Stage) ▾
        </span>
      </div>

      <div slot="end" className="navbar-workflows-toggle-wrap">
        <ModusWcButton
          color="primary"
          variant="borderless"
          shape="square"
          size="sm"
          customClass="workflows-toggle"
          pressed={workflowsOpen}
          aria-label="Toggle Workflows panel"
          aria-pressed={workflowsOpen}
          onButtonClick={onToggleWorkflows}
        >
          <ModusWcIcon decorative name="flowchart" size="sm" variant="solid" />
        </ModusWcButton>
      </div>
    </ModusWcNavbar>
  );
}
