import { ModusWcButton, ModusWcIcon } from '@trimble-oss/moduswebcomponents-react';

interface TriageDrawerProps {
  onClose: () => void;
}

export default function TriageDrawer({ onClose }: TriageDrawerProps) {
  return (
    <div className="triage-drawer" role="dialog" aria-labelledby="triage-drawer-title">
      <div className="triage-drawer-header">
        <div className="triage-drawer-title-row">
          <ModusWcIcon decorative={false} name="warning" size="md" aria-label="Warning" />
          <h2 id="triage-drawer-title" className="triage-drawer-title">
            Resilience Layer: Execution Triage Cockpit
          </h2>
        </div>
        <button type="button" className="triage-drawer-close" onClick={onClose} aria-label="Close triage drawer">
          <ModusWcIcon decorative name="close" size="sm" />
        </button>
      </div>

      <div className="triage-drawer-body">
        <p className="triage-drawer-label">Plain-Language Error Translation</p>
        <div className="triage-drawer-error-box">
          <strong>Step Error:</strong> The FieldLink binary conversion framework crashed on row 14 of
          your source file spreadsheet because the required coordinate system heading parameter
          [Northing] was left blank or formatted with invalid character strings.
        </div>
      </div>

      <div className="triage-drawer-footer">
        <ModusWcButton color="primary" variant="filled" size="md" customClass="replay-step-btn">
          <ModusWcIcon decorative name="refresh" size="sm" />
          Replay Broken Step
        </ModusWcButton>
      </div>
    </div>
  );
}
