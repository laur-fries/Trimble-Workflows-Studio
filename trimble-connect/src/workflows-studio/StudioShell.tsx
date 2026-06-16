import { ModusWcButton, ModusWcIcon, ModusWcNavbar } from '@trimble-oss/moduswebcomponents-react';

const studioNavbarVisibility = {
  ai: false,
  apps: false,
  help: true,
  logo: false,
  mainMenu: false,
  notifications: false,
  search: false,
  searchInput: false,
  user: true,
};

const studioUserCard = {
  avatarAlt: 'User',
  avatarSrc: '',
  email: 'user@trimble.com',
  name: 'User',
};

interface StudioHeaderProps {
  menuOpen?: boolean;
  onMenuToggle?: () => void;
}

export function StudioHeader({ menuOpen = false, onMenuToggle }: StudioHeaderProps) {
  return (
    <ModusWcNavbar
      customClass="studio-navbar"
      userCard={studioUserCard}
      visibility={studioNavbarVisibility}
    >
      <div slot="start" className="studio-navbar-start">
        {onMenuToggle && (
          <ModusWcButton
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            color="tertiary"
            customClass="studio-navbar-menu"
            onButtonClick={onMenuToggle}
            shape="square"
            size="sm"
            variant="borderless"
          >
            <ModusWcIcon decorative name="menu" size="sm" variant="solid" />
          </ModusWcButton>
        )}
        <img
          src="/trimble-workflows-logo.png"
          alt="Trimble Workflows"
          className="studio-navbar-logo"
        />
      </div>
    </ModusWcNavbar>
  );
}
