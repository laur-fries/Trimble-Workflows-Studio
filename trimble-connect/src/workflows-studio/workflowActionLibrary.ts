import type { WorkflowActionCategory, WorkflowActionContext, WorkflowActionItem } from './data';

export const workflowGroupByOptions = [
  { label: 'Trimble product', value: 'provider' },
  { label: 'Category', value: 'category' },
  { label: 'File Type', value: 'fileType' },
  { label: 'Action', value: 'action' },
] as const;

export type WorkflowGroupBy = (typeof workflowGroupByOptions)[number]['value'];

export function isWorkflowGroupBy(value: string): value is WorkflowGroupBy {
  return workflowGroupByOptions.some((option) => option.value === value);
}

/** GA Beta Operation Library — master step catalog for canvas grouping. */
export const gaBetaOperationLibrary: WorkflowActionItem[] = [
  {
    id: 'de-read-file-connect',
    label: 'Read File From Trimble Connect',
    icon: 'file',
    description:
      'Read files from Trimble Connect folders and pass them to downstream workflow steps for processing or conversion.',
    provider: 'Trimble Connect',
    category: 'Integration & Orchestration',
    fileType: 'Neutral',
    action: 'Read / Get',
    specTag: 'MAX 500MB',
    verified: true,
    version: 'v3',
  },
  {
    id: 'de-write-connect',
    label: 'Write to Trimble Connect',
    icon: 'cloud_upload',
    description:
      'Upload processed files to a Trimble Connect destination folder when the workflow completes.',
    provider: 'Trimble Connect',
    category: 'Integration & Orchestration',
    fileType: 'Neutral',
    action: 'Write / Push',
    specTag: 'MAX 500MB',
    verified: true,
    version: 'v3',
  },
  {
    id: 'de-csv-tflx',
    label: 'CSV to TFLX Converter',
    icon: 'refresh',
    description:
      'Convert CSV survey data into TFLX format for FieldLink and downstream model workflows.',
    provider: 'Trimble FieldLink',
    category: 'Data Conversion & Format Translation',
    fileType: 'Survey Layouts & Points (CSV, TFLX)',
    action: 'Convert / Translate',
    specTag: 'CSV input',
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
    category: 'Data Conversion & Format Translation',
    fileType: '3D Models & BIM (NWD, TRB, IFC)',
    action: 'Convert / Translate',
    specTag: 'Model convert',
    verified: true,
    version: 'v2',
  },
  {
    id: 'de-merge-trb',
    label: 'Merge TRB Files',
    icon: 'flowchart',
    description:
      'Combine multi-trade design and as-built models into a master viewer deliverable for project teams.',
    provider: 'Trimble Connect',
    category: 'Data Conversion & Format Translation',
    fileType: '3D Models & BIM (NWD, TRB, IFC)',
    action: 'Merge / Combine',
    specTag: 'Multi-file',
    verified: true,
    version: 'v2',
  },
  {
    id: 'de-reproject-coordinates',
    label: 'Reproject Coordinates',
    icon: 'location',
    description:
      'Reproject spatial coordinates between CRS definitions using FME-powered geometry transforms.',
    provider: 'FME (Safe Software)',
    category: 'Geometry & Spatial Transformation',
    fileType: 'Geospatial & GIS Data',
    action: 'Transform / Modify',
    specTag: 'Spatial',
    verified: true,
    version: 'v1',
  },
  {
    id: 'de-geometry-filter',
    label: 'Geometry Filter',
    icon: 'filter',
    description:
      'Filter geometry features by spatial rules, including 3D bounds, before passing data to later steps.',
    provider: 'FME (Safe Software)',
    category: 'Spatial Analysis & Filtering',
    fileType: '3D Models & BIM (NWD, TRB, IFC)',
    action: 'Filter / Validate',
    specTag: '3D filter',
    verified: true,
    version: 'v3',
  },
  {
    id: 'pm-create-project-space',
    label: 'Create Project inside ProjectSight',
    icon: 'folder_closed',
    description:
      'Generate a new permission-based project hub natively inside ProjectSight and route collaborators to the right workspace.',
    provider: 'ProjectSight',
    category: 'Project Management & Coordination',
    fileType: 'Neutral',
    action: 'Create / Link',
    specTag: 'Project setup',
    verified: true,
    version: 'v2',
  },
  {
    id: 'pm-create-rfi',
    label: 'Create RFI inside ProjectSight',
    icon: 'collaboration',
    description:
      'Create an automated RFI field routing layout and assign reviewers based on project rules.',
    provider: 'ProjectSight',
    category: 'Project Management & Coordination',
    fileType: 'Neutral',
    action: 'Create / Link',
    specTag: 'RFI workflow',
    verified: true,
    version: 'v3',
  },
  {
    id: 'pm-create-issue-card',
    label: 'Create Issue inside ProjectSight',
    icon: 'report',
    description:
      'Log a punch list issue directly to ProjectSight tables with status, assignee, and due date fields.',
    provider: 'ProjectSight',
    category: 'Project Management & Coordination',
    fileType: 'Neutral',
    action: 'Create / Link',
    specTag: 'Issue tracking',
    verified: true,
    version: 'v2',
  },
  {
    id: 'pm-send-email',
    label: 'Send Email Notification',
    icon: 'email',
    description:
      'Send an email or formatted notification to project team members when a workflow event occurs.',
    provider: 'Notifications',
    category: 'Notifications & Alerts',
    fileType: 'Neutral',
    action: 'Notify / Alert',
    specTag: 'Email',
    verified: true,
    version: 'v2',
  },
  {
    id: 'pm-log-vista',
    label: 'Log Entry to Vista',
    icon: 'history',
    description:
      'Write workflow results and audit events to Vista for downstream ERP and field reporting.',
    provider: 'Vista',
    category: 'Integration & Orchestration',
    fileType: 'Neutral',
    action: 'Write / Push',
    specTag: 'ERP log',
    verified: true,
    version: 'v1',
  },
];

function toGroupId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getGroupLabel(item: WorkflowActionItem, groupBy: WorkflowGroupBy): string {
  switch (groupBy) {
    case 'provider':
      return item.provider ?? 'Other';
    case 'category':
      return item.category ?? 'Other';
    case 'fileType':
      return item.fileType ?? 'Other';
    case 'action':
      return item.action ?? 'Other';
    default:
      return 'Other';
  }
}

function inferContext(item: WorkflowActionItem): WorkflowActionContext {
  return item.id.startsWith('pm-') ? 'project-management' : 'data-engineering';
}

export function groupWorkflowActions(
  items: WorkflowActionItem[],
  groupBy: WorkflowGroupBy,
): WorkflowActionCategory[] {
  const groups = new Map<string, WorkflowActionItem[]>();

  for (const item of items) {
    const label = getGroupLabel(item, groupBy);
    const existing = groups.get(label);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(label, [item]);
    }
  }

  return Array.from(groups.entries())
    .sort(([labelA], [labelB]) => labelA.localeCompare(labelB))
    .map(([label, groupItems]) => ({
      id: `${groupBy}-${toGroupId(label)}`,
      label,
      context: groupItems[0] ? inferContext(groupItems[0]) : 'data-engineering',
      defaultExpanded: false,
      items: groupItems,
    }));
}

export function getAllWorkflowActions(): WorkflowActionItem[] {
  return gaBetaOperationLibrary;
}

export function getGroupedWorkflowActionCategories(
  groupBy: WorkflowGroupBy = 'category',
): WorkflowActionCategory[] {
  return groupWorkflowActions(gaBetaOperationLibrary, groupBy);
}

export function getAllWorkflowActionCategories(): WorkflowActionCategory[] {
  return getGroupedWorkflowActionCategories('category');
}

export function flattenWorkflowActions(_context?: WorkflowActionContext): WorkflowActionItem[] {
  return gaBetaOperationLibrary;
}

export function findWorkflowActionById(id: string) {
  return gaBetaOperationLibrary.find((item) => item.id === id);
}
