import { useMemo, useState } from 'react';
import { ModusWcButton, ModusWcIcon, ModusWcSelect, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

const activityFilterOptions = [
  { label: 'All types', value: 'all' },
  { label: 'Complete', value: 'complete' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Had issues', value: 'had_issues' },
] as const;

type ActivityFilter = (typeof activityFilterOptions)[number]['value'];

function formatLastUpdated(date: Date) {
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `Last updated: today, ${time}.`;
}

export default function ActivityTab() {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  const lastUpdatedLabel = useMemo(() => formatLastUpdated(lastUpdated), [lastUpdated]);

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  return (
    <div className="workflows-activity">
      <div className="workflows-activity-toolbar">
        <div className="workflows-activity-filter">
          <ModusWcSelect
            bordered
            size="sm"
            value={activityFilter}
            options={[...activityFilterOptions]}
            inputId="workflows-activity-filter"
            onInputChange={(event: CustomEvent) => {
              const value = event.detail?.target?.value || 'all';
              setActivityFilter(value as ActivityFilter);
            }}
          />
        </div>

        <ModusWcButton
          color="tertiary"
          variant="outlined"
          size="sm"
          customClass="workflows-activity-refresh"
          aria-label="Refresh activity"
          onButtonClick={handleRefresh}
        >
          <ModusWcIcon decorative name="refresh" size="sm" />
          Refresh
        </ModusWcButton>
      </div>

      <div className="workflows-activity-meta">
        <p className="workflows-activity-updated">{lastUpdatedLabel}</p>
        <p className="workflows-activity-retention">Data available for 40 days</p>
      </div>

      <div className="workflows-activity-body">
        <section className="modus-empty-state workflows-empty-state" aria-labelledby="activity-empty-state-title">
          <div className="workflows-empty-state-illustration workflows-empty-state-illustration--activity" aria-hidden="true">
            <ModusWcIcon decorative name="history" size="lg" variant="solid" />
          </div>

          <ModusWcTypography hierarchy="h3" weight="semibold" customClass="workflows-empty-state-title">
            <span id="activity-empty-state-title">No activity</span>
          </ModusWcTypography>

          <ModusWcTypography hierarchy="p" size="sm" customClass="workflows-empty-state-description">
            When workflows run, you see what they did here
          </ModusWcTypography>
        </section>
      </div>
    </div>
  );
}
