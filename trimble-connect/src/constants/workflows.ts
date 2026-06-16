/** Standalone Trimble Workflows product (stage). */
export const TRIMBLE_WORKFLOWS_URL = 'https://workflows.stage.trimble.com';

/** Discover/templates view in Trimble Workflows. */
export const TRIMBLE_WORKFLOWS_TEMPLATES_URL = `${TRIMBLE_WORKFLOWS_URL}/discover`;

export function openTrimbleWorkflows(url: string = TRIMBLE_WORKFLOWS_URL) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
