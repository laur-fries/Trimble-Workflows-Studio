import type { OperationCategory } from './data';

/**
 * Workflow actions mapped to ProjectSight API v1 record types and operations.
 * @see https://developer.trimble.com/docs/projectsight/reference/openapi/v1
 */
export const projectSightOperations: OperationCategory = {
  id: 'projectsight',
  label: 'ProjectSight',
  items: [
    { id: 'ps-create-project', label: 'Create Project', icon: 'add' },
    { id: 'ps-link-project', label: 'Link Project', icon: 'link' },
    { id: 'ps-create-rfi', label: 'Create RFI', icon: 'collaboration' },
    { id: 'ps-link-rfi', label: 'Link RFI', icon: 'link' },
    { id: 'ps-create-issue', label: 'Create Issue', icon: 'warning' },
    { id: 'ps-link-issue', label: 'Link Issue', icon: 'link' },
  ],
};
