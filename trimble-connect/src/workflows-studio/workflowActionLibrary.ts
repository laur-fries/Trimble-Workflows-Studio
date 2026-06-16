import type { WorkflowActionCategory, WorkflowActionContext } from './data';

export const workflowContextOptions = [
  { label: 'Project Management Context', value: 'project-management' as const },
  { label: 'Data Engineering Context', value: 'data-engineering' as const },
];

export const projectManagementActionLibrary: WorkflowActionCategory[] = [
  {
    id: 'projectsight-actions',
    label: 'ProjectSight Actions',
    context: 'project-management',
    defaultExpanded: false,
    items: [
      {
        id: 'pm-create-project-space',
        label: 'Create Project Space',
        icon: 'folder_closed',
        description:
          'Generate a new permission-based project hub natively inside ProjectSight and route collaborators to the right workspace.',
        provider: 'ProjectSight',
        specTag: 'Project setup',
        verified: true,
        version: 'v2',
      },
      {
        id: 'pm-create-rfi',
        label: 'Create RFI',
        icon: 'collaboration',
        description:
          'Create an automated RFI field routing layout and assign reviewers based on project rules.',
        provider: 'ProjectSight',
        specTag: 'RFI workflow',
        verified: true,
        version: 'v3',
      },
      {
        id: 'pm-create-issue-card',
        label: 'Create Issue Card',
        icon: 'report',
        description:
          'Log a punch list issue directly to ProjectSight tables with status, assignee, and due date fields.',
        provider: 'ProjectSight',
        specTag: 'Issue tracking',
        verified: true,
        version: 'v2',
      },
    ],
  },
  {
    id: 'communications-notifications',
    label: 'Communications & Notifications',
    context: 'project-management',
    defaultExpanded: false,
    items: [
      {
        id: 'pm-send-email',
        label: 'Send Automated Email Notification',
        icon: 'email',
        description:
          'Dispatch custom template alerts to targeted user groups when workflow events occur in your project.',
        provider: 'Trimble Connect',
        specTag: 'Email alerts',
        verified: true,
        version: 'v3',
      },
      {
        id: 'pm-slack-alert',
        label: 'Post Slack Channel Alert',
        icon: 'notifications',
        description:
          'Ingest real-time event alerts straight to Slack workspaces with formatted workflow context.',
        provider: 'Slack',
        specTag: 'Channel post',
        verified: true,
        version: 'v1',
      },
      {
        id: 'pm-teams-message',
        label: 'Send Microsoft Teams Message',
        icon: 'chat',
        description:
          'Route direct message pings to internal teams when project milestones or issues change state.',
        provider: 'Microsoft Teams',
        specTag: 'Direct message',
        verified: true,
        version: 'v1',
      },
    ],
  },
];

export const dataEngineeringActionLibrary: WorkflowActionCategory[] = [
  {
    id: 'connect-cde-tools',
    label: 'Trimble Connect CDE Tools',
    context: 'data-engineering',
    defaultExpanded: false,
    items: [
      {
        id: 'de-read-file-connect',
        label: 'Read File From Trimble Connect',
        icon: 'file',
        description:
          'Read files from Trimble Connect folders and pass them to downstream workflow steps for processing or conversion.',
        provider: 'Trimble Connect',
        specTag: 'MAX 500MB',
        tags: ['Integration', 'Connectivity', 'Connect', 'Read'],
        verified: true,
        version: 'v3',
      },
      {
        id: 'de-read-folder-connect',
        label: 'Read Folder From Trimble Connect',
        icon: 'folder_closed',
        description:
          'Ingest bulk directory folder paths from Trimble Connect and enumerate files for batch workflow operations.',
        provider: 'Trimble Connect',
        specTag: 'Folder ingest',
        tags: ['Ingest bulk directory folder paths'],
        verified: true,
        version: 'v2',
      },
      {
        id: 'de-write-connect',
        label: 'Write to Trimble Connect',
        icon: 'cloud_upload',
        description:
          'Upload processed files to a Trimble Connect destination folder when the workflow completes.',
        provider: 'Trimble Connect',
        specTag: 'MAX 500MB',
        tags: ['Integration', 'Connectivity', 'Connect', 'Write'],
        verified: true,
        version: 'v3',
      },
    ],
  },
  {
    id: 'format-conversion',
    label: 'Format Conversion & Translation',
    context: 'data-engineering',
    defaultExpanded: false,
    items: [
      {
        id: 'de-csv-tflx',
        label: 'CSV to TFLX Converter',
        icon: 'refresh',
        description:
          'Convert CSV survey data into TFLX format for FieldLink and downstream model workflows.',
        provider: 'Trimble Connect',
        specTag: 'CSV input',
        tags: ['Conversion', 'CSV', 'TFLX', 'FieldLink'],
        verified: true,
        version: 'v2',
      },
      {
        id: 'de-nwd-trb',
        label: 'NWD to TRB Converter',
        icon: 'cube',
        description:
          'Translate Navisworks NWD models into TRB packages for Trimble model viewer workflows.',
        provider: 'Trimble Connect',
        specTag: 'Model convert',
        tags: ['Conversion', 'NWD', 'TRB', 'Model Assimilation'],
        verified: true,
        version: 'v2',
      },
      {
        id: 'de-tflx-trb',
        label: 'TFLX to TRB Converter',
        icon: 'refresh',
        description:
          'Convert TFLX field data packages into TRB deliverables for merged model publishing.',
        provider: 'Trimble Connect',
        specTag: 'TFLX input',
        tags: ['Conversion', 'TFLX', 'TRB'],
        verified: true,
        version: 'v1',
      },
      {
        id: 'de-merge-trb',
        label: 'Merge TRB Files',
        icon: 'flowchart',
        description:
          'Combine multi-trade design and as-built models into a master viewer deliverable for project teams.',
        provider: 'Trimble Connect',
        specTag: 'Multi-file',
        tags: ['Combines multi-trade design and as-built models into a master viewer deliverable'],
        verified: true,
        version: 'v2',
      },
    ],
  },
  {
    id: 'spatial-analysis',
    label: 'Spatial Analysis & Geometry',
    context: 'data-engineering',
    defaultExpanded: false,
    items: [
      {
        id: 'de-reproject-coordinates',
        label: 'Reproject Coordinates',
        icon: 'location',
        description:
          'Reproject spatial coordinates between CRS definitions using FME-powered geometry transforms.',
        provider: 'Trimble Connect',
        specTag: 'Spatial',
        tags: ['Spatial', 'Coordinates', 'Reproject', 'FME'],
        verified: true,
        version: 'v1',
      },
      {
        id: 'de-geometry-filter',
        label: 'Geometry Filter (Includes 3D)',
        icon: 'filter',
        description:
          'Filter geometry features by spatial rules, including 3D bounds, before passing data to later steps.',
        provider: 'Trimble Connect',
        specTag: '3D filter',
        tags: ['Analysis', 'Spatial', 'Geometry', 'Filter', '3D'],
        verified: true,
        version: 'v3',
      },
    ],
  },
];

export const workflowActionLibraryByContext: Record<WorkflowActionContext, WorkflowActionCategory[]> = {
  'project-management': projectManagementActionLibrary,
  'data-engineering': dataEngineeringActionLibrary,
};

export function getWorkflowActionCategories(context: WorkflowActionContext): WorkflowActionCategory[] {
  return workflowActionLibraryByContext[context];
}

export function getAllWorkflowActionCategories(): WorkflowActionCategory[] {
  return [
    ...workflowActionLibraryByContext['project-management'],
    ...workflowActionLibraryByContext['data-engineering'],
  ];
}

export function flattenWorkflowActions(context: WorkflowActionContext) {
  return getWorkflowActionCategories(context).flatMap((category) => category.items);
}

export function findWorkflowActionById(id: string) {
  return [
    ...flattenWorkflowActions('project-management'),
    ...flattenWorkflowActions('data-engineering'),
  ].find((item) => item.id === id);
}
