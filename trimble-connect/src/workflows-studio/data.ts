import { projectSightOperations } from './projectSightOperations';

export type StudioWorkspaceTab = 'discover' | 'my-workflows';

export type StudioView = StudioWorkspaceTab | 'canvas';

export type StudioViewportMode = 'dashboard' | 'canvas';

export const blankWorkflowStartLabel = 'Select a trigger to begin your workflow';

export const FLOW_STARTER_SLOT_ID = 'flow-starter-slot';
export const FLOW_ACTION_SLOT_ID = 'flow-action-slot';

export type FlowCanvasSlot = 'starter' | 'action';

export interface StudioTemplate {
  id: string;
  title: string;
  description: string;
  icons: readonly string[];
  steps: string[];
}

export interface StudioTemplateGroup {
  id: string;
  title: string;
  templates: StudioTemplate[];
}

export interface OperationItem {
  id: string;
  label: string;
  icon: string;
  /** Maps to a ProjectSight API v1 record type or operation where applicable. */
  apiRecordType?: string;
}

export interface WorkflowActionItem extends OperationItem {
  description?: string;
  tags?: string[];
  /** e.g. "v3" */
  version?: string;
  verified?: boolean;
  /** e.g. "Trimble Connect" */
  provider?: string;
  /** Footer pill label, e.g. "MAX 500MB" */
  specTag?: string;
}

export type WorkflowActionContext = 'project-management' | 'data-engineering';

export interface WorkflowActionCategory {
  id: string;
  label: string;
  context: WorkflowActionContext;
  defaultExpanded?: boolean;
  items: WorkflowActionItem[];
}

export interface OperationCategory {
  id: string;
  label: string;
  items: OperationItem[];
}

export interface WorkflowCanvasNode {
  id: string;
  label: string;
  icon: string;
  isStarter?: boolean;
}

export const studioTemplateGroups: StudioTemplateGroup[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    templates: [
      {
        id: 'bcf-email-notify',
        title: 'Notify via email when a BCF topic is created',
        description:
          'When a new BCF topic is added in Trimble Connect, send an email notification to assigned project members.',
        icons: ['collaboration', 'email'],
        steps: [
          'When a BCF topic is created in Trimble Connect',
          'Collect topic details and assigned members',
          'Send an email notification to the project team',
        ],
      },
      {
        id: 'suspicious-activity-admin',
        title: 'Notify admin group of suspicious activity',
        description:
          'When suspicious activity is detected on a project, alert the admin group immediately with activity details.',
        icons: ['security', 'notifications'],
        steps: [
          'When suspicious activity is detected on a project',
          'Identify the affected project and activity details',
          'Notify the admin group with a summary and next steps',
        ],
      },
    ],
  },
  {
    id: 'create-new-group',
    title: 'Create new group',
    templates: [
      {
        id: 'connect-projectsight-link',
        title: 'Create ProjectSight project from Connect',
        description:
          'When a project is created in Trimble Connect, automatically create a matching project in ProjectSight and link them together.',
        icons: ['folder_closed', 'link'],
        steps: [
          'When a new project is created in Trimble Connect',
          'Create a matching project in ProjectSight',
          'Auto-link the Connect and ProjectSight projects',
        ],
      },
    ],
  },
];

export const canvasStepLibrary: OperationCategory[] = [
  {
    id: '3d-point-cloud',
    label: '3D & Point Cloud',
    items: [
      { id: 'point-cloud-reader', label: 'Point cloud reader', icon: 'cube' },
      { id: 'mesh-generator', label: 'Mesh generator', icon: 'cube' },
      { id: 'surface-modeler', label: 'Surface modeler', icon: 'layers' },
      { id: 'tile-exporter', label: 'Tile exporter', icon: 'export' },
      { id: 'cloud-clipper', label: 'Cloud clipper', icon: 'content_cut' },
    ],
  },
  {
    id: 'coordinates-spatial',
    label: 'Coordinates & spatial',
    items: [
      { id: 'reprojector', label: 'Reprojector', icon: 'location' },
      { id: 'bounds-filter', label: 'Bounds filter', icon: 'crop' },
      { id: 'coordinate-extractor', label: 'Coordinate extractor', icon: 'my_location' },
      { id: 'spatial-relation', label: 'Spatial relation', icon: 'compare' },
    ],
  },
  {
    id: 'data-attributes',
    label: 'Data & attributes',
    items: [
      { id: 'attribute-creator', label: 'Attribute creator', icon: 'add' },
      { id: 'attribute-manager', label: 'Attribute manager', icon: 'settings' },
      { id: 'deaggregator', label: 'Deaggregator', icon: 'flowchart' },
      { id: 'list-exploder', label: 'List exploder', icon: 'list' },
      { id: 'statistics-calculator', label: 'Statistics calculator', icon: 'calculate' },
    ],
  },
  {
    id: 'format-specific',
    label: 'Format-specific',
    items: [
      { id: 'csv-reader', label: 'CSV reader', icon: 'file' },
      { id: 'csv-writer', label: 'CSV writer', icon: 'file' },
      { id: 'json-reader', label: 'JSON reader', icon: 'code' },
      { id: 'json-writer', label: 'JSON writer', icon: 'code' },
      { id: 'xml-reader', label: 'XML reader', icon: 'file' },
      { id: 'xml-writer', label: 'XML writer', icon: 'file' },
    ],
  },
  {
    id: 'geometries',
    label: 'Geometries',
    items: [
      { id: 'geometry-filter', label: 'Geometry filter', icon: 'filter' },
      { id: 'geometry-coercer', label: 'Geometry coercer', icon: 'shapes' },
      { id: 'line-on-line', label: 'Line on line', icon: 'timeline' },
      { id: 'polygon-on-polygon', label: 'Polygon on polygon', icon: 'pentagon' },
    ],
  },
  {
    id: 'system-connectivity',
    label: 'System & connectivity',
    items: [
      { id: 'read-acc', label: 'Read from ACC', icon: 'cloud_download' },
      { id: 'upload-connect', label: 'Upload to Connect', icon: 'cloud_upload' },
      { id: 'webhook-trigger', label: 'Webhook trigger', icon: 'wifi' },
    ],
  },
];

export const recentlyUsedStepIds = [
  'de-read-file-connect',
  'de-geometry-filter',
  'de-write-connect',
  'pm-create-rfi',
  'pm-send-email',
];

export interface WorkflowStarterGroup {
  id: string;
  label: string;
  items: OperationItem[];
}

export const workflowStarterGroups: WorkflowStarterGroup[] = [
  {
    id: 'trimble-connect',
    label: 'Trimble Connect Triggers',
    items: [
      { id: 'starter-file-created', label: 'When a File is Created', icon: 'file' },
      { id: 'starter-file-updated', label: 'When a File is Updated', icon: 'cloud_upload' },
      { id: 'starter-clash-detection', label: 'Clash Detection Completed', icon: 'warning' },
    ],
  },
  {
    id: 'projectsight',
    label: 'ProjectSight Triggers',
    items: [
      { id: 'starter-rfi-created', label: 'When an RFI is Created', icon: 'collaboration' },
      { id: 'starter-issue-status', label: 'When an Issue changes Status', icon: 'change_history' },
    ],
  },
];

export const workflowStarterSteps: OperationItem[] = workflowStarterGroups.flatMap(
  (group) => group.items,
);

export function findWorkflowStarterById(id: string): OperationItem | undefined {
  return workflowStarterSteps.find((item) => item.id === id);
}

export const operationLibrary: OperationCategory[] = [
  {
    id: 'integration',
    label: 'Integration & Triggers',
    items: [
      { id: 'read-file', label: 'Read File', icon: 'file' },
      { id: 'read-folder', label: 'Read Folder', icon: 'folder_closed' },
      { id: 'write-connect', label: 'Write to Connect', icon: 'cloud_upload' },
    ],
  },
  projectSightOperations,
  {
    id: 'conversion',
    label: 'Conversion Toolkit',
    items: [
      { id: 'csv-tflx', label: 'CSV to TFLX', icon: 'refresh' },
      { id: 'nwd-trb', label: 'NWD to TRB', icon: 'cube' },
      { id: 'merge-trb', label: 'Merge TRB Files', icon: 'flowchart' },
    ],
  },
];

export const defaultCanvasSteps = [
  'When a new NWD file arrives in ACC Docs',
  'Convert the model to TRB format',
  'Merge TRB with current survey data',
  'Write the updated package to Trimble Connect',
];
