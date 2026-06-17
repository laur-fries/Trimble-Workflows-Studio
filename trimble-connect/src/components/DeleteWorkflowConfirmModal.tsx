import { ModusWcButton } from '@trimble-oss/moduswebcomponents-react';
import WorkflowsPrimaryButton from './WorkflowsPrimaryButton';

interface DeleteWorkflowConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteWorkflowConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: DeleteWorkflowConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="workflows-delete-overlay" role="presentation">
      <div
        className="workflows-delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="workflows-delete-title"
        aria-describedby="workflows-delete-body"
      >
        <h2 id="workflows-delete-title" className="workflows-delete-modal-title">
          Delete workflow?
        </h2>
        <p id="workflows-delete-body" className="workflows-delete-modal-body">
          This action will remove this workflow and immediately stop any work in progress. Deletion
          cannot be undone.
        </p>
        <div className="workflows-delete-modal-actions">
          <ModusWcButton color="primary" variant="borderless" size="sm" onButtonClick={onCancel}>
            Cancel
          </ModusWcButton>
          <WorkflowsPrimaryButton onClick={onConfirm}>Delete</WorkflowsPrimaryButton>
        </div>
      </div>
    </div>
  );
}
