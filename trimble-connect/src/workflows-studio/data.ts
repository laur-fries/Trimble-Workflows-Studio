import { projectSightOperations } from './projectSightOperations';

export type StudioWorkspaceTab = 'discover' | 'my-workflows' | 'activity';

export type StudioView = StudioWorkspaceTab | 'canvas';

export type StudioViewportMode = 'dashboard' | 'canvas';

export const blankWorkflowStartLabel = 'Select a trigger to begin your workflow';

export const FLOW_STARTER_SLOT_ID = 'flow-starter-slot';
export const FLOW_ACTION_SLOT_ID = 'flow-action-slot';
export const FLOW_ADD_ACTION_STEP_ID = 'add-action-step';

export type FlowCanvasSlot = 'starter' | 'action';

export interface StudioTemplateStep {
  stepId: string;
  label: string;
  icon?: string;
  isStarter?: boolean;
}

export type StudioTemplateSource = 'pre-packaged' | 'custom' | 'shared';

export type StudioTemplateCatalogTag = 'trimble' | 'project-specific';

export interface StudioTemplate {
  id: string;
  title: string;
  description: string;
  icons: readonly string[];
  steps: StudioTemplateStep[];
  publisher: string;
  stepCount: number;
  teamClones: number;
  reclaimedTime?: string;
  version: string;
  source: StudioTemplateSource;
  groupTitle: string;
  catalogTags: StudioTemplateCatalogTag[];
  configurationRequiredStepIds?: string[];
}

export interface StudioTemplateGroup {
  id: string;
  title: string;
  subtitle: string;
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
  /** Operation Library grouping — e.g. "Integration & Orchestration" */
  category?: string;
  /** Operation Library grouping — e.g. "Neutral" */
  fileType?: string;
  /** Operation Library grouping — e.g. "Read / Get" */
  action?: string;
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
    id: 'notifications-alerts',
    title: 'Notifications & alerts',
    subtitle: 'Pre-packaged notification templates ready to configure for your projects.',
    templates: [
      {
        id: 'bcf-email-notify',
        title: 'Notify via email when a BCF topic is created',
        description:
          'When a new BCF topic is added in Trimble Connect, send an email notification to assigned project members.',
        icons: ['collaboration', 'email'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 0,
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'Notifications & alerts',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-bcf-topic-created', 'pm-send-email'],
        steps: [
          { stepId: 'starter-bcf-topic-created', label: 'When a BCF topic is created in Trimble Connect', isStarter: true },
          { stepId: 'de-read-file-connect', label: 'Collect topic details and assigned members' },
          { stepId: 'pm-send-email', label: 'Send an email notification to the project team' },
        ],
      },
      {
        id: 'suspicious-activity-admin',
        title: 'Notify admin group of suspicious activity',
        description:
          'When suspicious activity is detected on a project, alert the admin group immediately with activity details.',
        icons: ['security', 'notifications'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 0,
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'Notifications & alerts',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-polling-interval', 'pm-send-email'],
        steps: [
          { stepId: 'starter-polling-interval', label: 'When suspicious activity is detected on a project', isStarter: true },
          { stepId: 'de-read-file-connect', label: 'Identify the affected project and activity details' },
          { stepId: 'pm-send-email', label: 'Notify the admin group with a summary and next steps' },
        ],
      },
    ],
  },
  {
    id: 'create-new-group',
    title: 'Create new group',
    subtitle: 'Pre-packaged onboarding templates ready to configure for new project setup.',
    templates: [
      {
        id: 'connect-projectsight-link',
        title: 'Create ProjectSight project from Connect',
        description:
          'When a project is created in Trimble Connect, automatically create a matching project in ProjectSight and link them together.',
        icons: ['folder_closed', 'link'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 0,
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'Create new group',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-file-created', 'pm-create-project-space'],
        steps: [
          { stepId: 'starter-file-created', label: 'When a new project is created in Trimble Connect', isStarter: true },
          { stepId: 'pm-create-project-space', label: 'Create a matching project in ProjectSight' },
          { stepId: 'de-write-connect', label: 'Auto-link the Connect and ProjectSight projects' },
        ],
      },
    ],
  },
  {
    id: 'connect-model-deliverables',
    title: 'Trimble Connect Workflows',
    subtitle: 'Pre-packaged Connect automation templates ready to configure for model and deliverable workflows.',
    templates: [
      {
        id: 'automated-field-points-ingest',
        title: 'Automated Field Points Ingest (CSV ➔ TFLX)',
        description:
          'Catches trade partner layouts dropped into Connect project folders, handles coordinate references, and outputs georeferenced FieldLink points.',
        icons: ['file', 'location'],
        publisher: 'Trimble',
        stepCount: 2,
        teamClones: 3104,
        reclaimedTime: '~1.5 hours/run',
        version: 'v1.0',
        source: 'pre-packaged',
        groupTitle: 'Trimble Connect Workflows',
        catalogTags: ['trimble'],
        configurationRequiredStepIds: ['starter-file-created', 'de-csv-tflx'],
        steps: [
          { stepId: 'starter-file-created', label: 'When a trade partner CSV layout drops in Connect', isStarter: true },
          { stepId: 'de-csv-tflx', label: 'Georeference and output FieldLink TFLX points' },
        ],
      },
      {
        id: 'coordinated-model-slice-composer',
        title: 'Coordinated Model Slice Composer',
        description:
          'Automatically merges raw subcontractor as-built TFLX files with design NWD-derived TRB model slices for immediate SiteVision viewer walk verifications.',
        icons: ['cube', 'layers'],
        publisher: 'Trimble',
        stepCount: 5,
        teamClones: 412,
        reclaimedTime: '~7 hours/run',
        version: 'v1.0',
        source: 'pre-packaged',
        groupTitle: 'Trimble Connect Workflows',
        catalogTags: ['trimble'],
        configurationRequiredStepIds: [
          'starter-file-created',
          'de-read-file-connect',
          'de-nwd-trb',
          'de-merge-trb',
          'de-write-connect',
        ],
        steps: [
          { stepId: 'starter-file-created', label: 'When subcontractor as-built TFLX arrives in Connect', isStarter: true },
          { stepId: 'de-read-file-connect', label: 'Read as-built TFLX source package' },
          { stepId: 'de-nwd-trb', label: 'Convert design NWD slices to TRB viewer format' },
          { stepId: 'de-merge-trb', label: 'Merge as-built TFLX with design TRB slices' },
          { stepId: 'de-write-connect', label: 'Publish composed model for SiteVision walks' },
        ],
      },
    ],
  },
  {
    id: 'projectsight-coordination',
    title: 'ProjectSight Workflows',
    subtitle: 'Pre-packaged ProjectSight coordination templates ready to configure for issue and field workflows.',
    templates: [
      {
        id: 'model-clash-to-projectsight-issue',
        title: '3D Model Clash to tracked ProjectSight Issue',
        description:
          'Watches your 3D coordination model environment for newly logged BCF topics, instantly spinning up tracked Issue ledger cards natively inside ProjectSight.',
        icons: ['collaboration', 'warning'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 1840,
        reclaimedTime: 'Instant Sync',
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'ProjectSight Workflows',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-bcf-topic-created', 'pm-create-rfi'],
        steps: [
          { stepId: 'starter-bcf-topic-created', label: 'When a new BCF clash topic is logged in Connect', isStarter: true },
          { stepId: 'pm-create-rfi', label: 'Create tracked Issue ledger card in ProjectSight' },
          { stepId: 'de-write-connect', label: 'Sync coordination metadata back to Connect' },
        ],
      },
      {
        id: 'field-violation-change-router',
        title: 'Field Violation Change Management Router',
        description:
          'Automatically flags formatting and elevation missing parameters inside contractor logs, generating drafted information requests for engineer triage.',
        icons: ['check', 'flowchart'],
        publisher: 'Trimble',
        stepCount: 4,
        teamClones: 94,
        reclaimedTime: '~45 mins/run',
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'ProjectSight Workflows',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-file-updated', 'de-geometry-filter', 'pm-create-rfi'],
        steps: [
          { stepId: 'starter-file-updated', label: 'When a contractor field log is uploaded', isStarter: true },
          { stepId: 'de-read-file-connect', label: 'Inspect log formatting and elevation parameters' },
          { stepId: 'de-geometry-filter', label: 'Flag missing or invalid field violation data' },
          { stepId: 'pm-create-rfi', label: 'Generate drafted information request for engineer triage' },
        ],
      },
      {
        id: 'rfi-status-change-broadcast',
        title: 'RFI Status Change Broadcast',
        description:
          'Listens for any critical RFI transition updates inside ProjectSight and pushes a beautifully formatted asset card message to project Slack or Teams channels.',
        icons: ['notifications', 'email'],
        publisher: 'Trimble',
        stepCount: 2,
        teamClones: 512,
        reclaimedTime: 'Instant Notification',
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'ProjectSight Workflows',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-polling-interval', 'pm-send-email'],
        steps: [
          { stepId: 'starter-polling-interval', label: 'When a critical RFI status changes in ProjectSight', isStarter: true },
          { stepId: 'pm-send-email', label: 'Push formatted asset card to Slack or Teams' },
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
  'de-csv-tflx',
];

export interface WorkflowStarterItem extends OperationItem {
  /** Connector source shown as "via …" on trigger cards. */
  connector?: string;
}

export interface WorkflowStarterGroup {
  id: string;
  label: string;
  defaultExpanded?: boolean;
  items: WorkflowStarterItem[];
}

export const workflowStarterGroups: WorkflowStarterGroup[] = [
  {
    id: 'automated-events',
    label: 'Automated Events',
    defaultExpanded: true,
    items: [
      {
        id: 'starter-file-created',
        label: 'When a File is Created',
        icon: 'file',
        connector: 'Trimble Connect or ACC Docs',
      },
      {
        id: 'starter-file-updated',
        label: 'When a File is Updated',
        icon: 'cloud_upload',
        connector: 'Trimble Connect or ACC Docs',
      },
      {
        id: 'starter-bcf-topic-created',
        label: 'When a BCF Topic is Created',
        icon: 'collaboration',
        connector: 'Trimble Connect Model Space',
      },
    ],
  },
  {
    id: 'schedules-polling',
    label: 'Schedules & Polling',
    defaultExpanded: true,
    items: [
      {
        id: 'starter-on-schedule',
        label: 'On a Calendar Schedule',
        icon: 'calendar',
        connector: 'Processing Framework Cron Engine',
      },
      {
        id: 'starter-polling-interval',
        label: 'Interval Data Polling',
        icon: 'refresh',
        connector: 'App Xchange Polling Engine',
      },
    ],
  },
  {
    id: 'manual-control',
    label: 'Manual Control',
    defaultExpanded: true,
    items: [
      {
        id: 'starter-on-demand',
        label: 'On-Demand Execution',
        icon: 'play_circle',
        connector: 'Global Workspace Run Controls',
      },
    ],
  },
];

export const workflowStarterSteps: WorkflowStarterItem[] = workflowStarterGroups.flatMap(
  (group) => group.items,
);

export function findWorkflowStarterById(id: string): WorkflowStarterItem | undefined {
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
