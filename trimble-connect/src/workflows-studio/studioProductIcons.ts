import type { WorkflowActionItem, WorkflowStarterItem } from './data';

export type StudioProductKey = 'connect' | 'projectsight';

export function resolveActionProduct(item: Pick<WorkflowActionItem, 'id' | 'provider'>): StudioProductKey | null {
  if (item.provider === 'ProjectSight') {
    return 'projectsight';
  }

  if (item.provider === 'Trimble Connect') {
    return 'connect';
  }

  if (item.id.includes('connect')) {
    return 'connect';
  }

  if (item.id.startsWith('pm-') || item.id.startsWith('ps-')) {
    return 'projectsight';
  }

  return null;
}

const CONNECT_TEMPLATE_GROUP_IDS = new Set([
  'connect-model-deliverables',
  'create-new-group',
  'notifications-alerts',
]);

const PROJECTSIGHT_TEMPLATE_GROUP_IDS = new Set(['projectsight-coordination']);

export function resolveTemplateGroupProduct(groupId: string): StudioProductKey | null {
  if (CONNECT_TEMPLATE_GROUP_IDS.has(groupId)) {
    return 'connect';
  }

  if (PROJECTSIGHT_TEMPLATE_GROUP_IDS.has(groupId)) {
    return 'projectsight';
  }

  return null;
}

export function resolveStarterProduct(
  item: Pick<WorkflowStarterItem, 'id' | 'connector' | 'label'>,
): StudioProductKey | null {
  const haystack = `${item.connector ?? ''} ${item.label}`.toLowerCase();

  if (haystack.includes('projectsight')) {
    return 'projectsight';
  }

  if (
    haystack.includes('connect') ||
    haystack.includes('acc docs') ||
    haystack.includes('bcf') ||
    item.id.startsWith('starter-file') ||
    item.id.startsWith('starter-bcf')
  ) {
    return 'connect';
  }

  return null;
}
