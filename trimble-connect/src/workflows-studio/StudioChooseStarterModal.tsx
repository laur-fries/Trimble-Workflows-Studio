import { useEffect, useState } from 'react';
import { ModusWcButton, ModusWcModal } from '@trimble-oss/moduswebcomponents-react';
import type { OperationItem } from './data';
import StudioStarterPicker from './StudioStarterPicker';

export const CHOOSE_STARTER_MODAL_ID = 'studio-choose-starter-modal';

interface StudioChooseStarterModalProps {
  isOpen: boolean;
  selectedStarterId?: string | null;
  onClose: () => void;
  onSelectStarter: (item: OperationItem) => void;
}

export default function StudioChooseStarterModal({
  isOpen,
  selectedStarterId = null,
  onClose,
  onSelectStarter,
}: StudioChooseStarterModalProps) {
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  useEffect(() => {
    const dialog = document.getElementById(CHOOSE_STARTER_MODAL_ID) as HTMLDialogElement | null;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setModalSearchQuery('');
    }
  }, [isOpen]);

  const handleSelectStarter = (item: OperationItem) => {
    onSelectStarter(item);
    onClose();
  };

  return (
    <ModusWcModal modalId={CHOOSE_STARTER_MODAL_ID} aria-label="Choose a start step">
      <span slot="header">Choose a start step</span>
      <div slot="content" className="studio-choose-starter-modal-content">
        <p className="studio-choose-starter-modal-subtitle">
          Choose how to start your workflow. This event or schedule will launch your flow.
        </p>
        <StudioStarterPicker
          includeSearch
          searchQuery={modalSearchQuery}
          selectedStarterId={selectedStarterId}
          onSearchChange={setModalSearchQuery}
          onSelectStarter={handleSelectStarter}
        />
      </div>
      <div slot="footer" className="studio-choose-starter-modal-footer">
        <ModusWcButton color="tertiary" size="sm" variant="outlined" onButtonClick={onClose}>
          Cancel
        </ModusWcButton>
      </div>
    </ModusWcModal>
  );
}
