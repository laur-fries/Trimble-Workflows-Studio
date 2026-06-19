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

export type StudioTemplateProductKey = 'connect' | 'projectsight';

export interface StudioTemplate {
  id: string;
  title: string;
  description: string;
  icons: readonly string[];
  /** Product icons shown in the card header, e.g. Connect → ProjectSight. */
  catalogProductFlow?: readonly StudioTemplateProductKey[];
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
    subtitle:
      'Pre-built communication frameworks designed to eliminate project blind spots by instantly routing critical system events and model updates to the right teams.',
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
        reclaimedTime: '~10 mins/run',
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
        reclaimedTime: '~10 mins/run',
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
      {
        id: 'background-conversion-complete-notify',
        title: 'Notify team when background file conversion completes',
        description:
          'Large design files can take up to 30 minutes to process into web-viewable formats. This template automatically fires an alert when background file processing is successfully finalized.',
        icons: ['refresh', 'notifications'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 0,
        reclaimedTime: '~20 mins/run',
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'Notifications & alerts',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-file-updated', 'pm-send-email'],
        steps: [
          { stepId: 'starter-file-updated', label: 'When background file conversion completes in Connect', isStarter: true },
          { stepId: 'de-read-file-connect', label: 'Collect conversion details and notify recipients' },
          { stepId: 'pm-send-email', label: 'Alert the project team that processing is finished' },
        ],
      },
      {
        id: 'workflow-failure-pipeline-alert',
        title: 'Notify pipeline manager immediately on workflow execution failure',
        description:
          'Eliminates silent background failures by triggering instant, context-rich alerts with the exact node and row parameters causing the stall.',
        icons: ['warning', 'notifications'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 0,
        reclaimedTime: '~45 mins/run',
        version: 'v1.0',
        source: 'custom',
        groupTitle: 'Notifications & alerts',
        catalogTags: ['project-specific'],
        configurationRequiredStepIds: ['starter-polling-interval', 'pm-send-email'],
        steps: [
          { stepId: 'starter-polling-interval', label: 'When a workflow execution fails or stalls', isStarter: true },
          { stepId: 'de-read-file-connect', label: 'Capture the failed node, loop, and row parameters' },
          { stepId: 'pm-send-email', label: 'Notify the pipeline manager with failure context' },
        ],
      },
    ],
  },
  {
    id: 'create-new-group',
    title: 'Create new group',
    subtitle:
      'Ready-to-use project templates optimized to eliminate cold-start friction and establish automated cross-product standardization.',
    templates: [
      {
        id: 'connect-projectsight-link',
        title: 'Create ProjectSight project from Connect',
        description:
          'When a project is created in Trimble Connect, automatically create a matching project in ProjectSight and link them together.',
        icons: ['folder_closed', 'link'],
        catalogProductFlow: ['connect', 'projectsight'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 0,
        reclaimedTime: '~10 mins/run',
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
        id: 'csv-tflx',
        title: 'Convert CSV files to TFLX',
        description:
          'Automatically convert CSV survey uploads in Connect project folders to TFLX format for FieldLink workflows.',
        icons: ['file', 'refresh'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 4820,
        reclaimedTime: '~10 mins/run',
        version: 'v1.0',
        source: 'pre-packaged',
        groupTitle: 'Trimble Connect Workflows',
        catalogTags: ['trimble'],
        configurationRequiredStepIds: ['starter-file-created', 'de-csv-tflx', 'de-write-connect'],
        steps: [
          { stepId: 'starter-file-created', label: 'When a CSV file is uploaded to Connect', isStarter: true },
          { stepId: 'de-csv-tflx', label: 'Convert CSV to TFLX' },
          { stepId: 'de-write-connect', label: 'Write converted TFLX back to Connect' },
        ],
      },
      {
        id: 'nwd-trb',
        title: 'Convert Navisworks NWD files to TRB',
        description:
          'Automatically convert Navisworks NWD models uploaded to Connect project folders into TRB packages for Trimble model viewer workflows.',
        icons: ['cube', 'file'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 2650,
        reclaimedTime: '~20 mins/run',
        version: 'v1.0',
        source: 'pre-packaged',
        groupTitle: 'Trimble Connect Workflows',
        catalogTags: ['trimble'],
        configurationRequiredStepIds: ['starter-file-created', 'de-nwd-trb', 'de-write-connect'],
        steps: [
          { stepId: 'starter-file-created', label: 'When an NWD file is uploaded to Connect', isStarter: true },
          { stepId: 'de-nwd-trb', label: 'Convert NWD to TRB' },
          { stepId: 'de-write-connect', label: 'Write converted TRB back to Connect' },
        ],
      },
      {
        id: 'merge-trb',
        title: 'Merge TRB files in project folders',
        description:
          'Combine multiple TRB model files from Connect project folders into a single master deliverable for project teams.',
        icons: ['folder_closed', 'flowchart'],
        publisher: 'Trimble',
        stepCount: 3,
        teamClones: 1890,
        reclaimedTime: '~15 mins/run',
        version: 'v1.0',
        source: 'pre-packaged',
        groupTitle: 'Trimble Connect Workflows',
        catalogTags: ['trimble'],
        configurationRequiredStepIds: ['starter-file-created', 'de-merge-trb', 'de-write-connect'],
        steps: [
          { stepId: 'starter-file-created', label: 'When TRB files are added to a Connect folder', isStarter: true },
          { stepId: 'de-merge-trb', label: 'Merge TRB files' },
          { stepId: 'de-write-connect', label: 'Write merged TRB back to Connect' },
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
        connector: 'Trimble Connect',
      },
      {
        id: 'starter-file-updated',
        label: 'When a File is Updated',
        icon: 'cloud_upload',
        connector: 'Trimble Connect',
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
