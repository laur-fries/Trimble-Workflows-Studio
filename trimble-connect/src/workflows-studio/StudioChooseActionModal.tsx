import { useEffect, useState } from 'react';
import { ModusWcButton, ModusWcModal } from '@trimble-oss/moduswebcomponents-react';
import type { WorkflowActionItem } from './data';
import StudioWorkflowActionPicker from './StudioWorkflowActionPicker';

export const CHOOSE_ACTION_MODAL_ID = 'studio-choose-action-modal';

interface StudioChooseActionModalProps {
  isOpen: boolean;
  selectedActionId?: string | null;
  onClose: () => void;
  onSelectAction: (item: WorkflowActionItem) => void;
}

export default function StudioChooseActionModal({
  isOpen,
  selectedActionId = null,
  onClose,
  onSelectAction,
}: StudioChooseActionModalProps) {
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  useEffect(() => {
    const dialog = document.getElementById(CHOOSE_ACTION_MODAL_ID) as HTMLDialogElement | null;
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

  const handleSelectAction = (item: WorkflowActionItem) => {
    onSelectAction(item);
    onClose();
  };

  return (
    <ModusWcModal modalId={CHOOSE_ACTION_MODAL_ID} aria-label="Choose a workflow step">
      <span slot="header">Choose a step</span>
      <div slot="content" className="studio-choose-starter-modal-content">
        <p className="studio-choose-starter-modal-subtitle">
          Add the next workflow action from the library.
        </p>
        <StudioWorkflowActionPicker
          includeSearch
          searchQuery={modalSearchQuery}
          selectedActionId={selectedActionId}
          onSearchChange={setModalSearchQuery}
          onSelectAction={handleSelectAction}
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
