import type { DiscoverFlow } from '../components/FlowDetailView';

export const discoverFlows: DiscoverFlow[] = [
  {
    id: 'csv-tflx',
    category: 'File conversion',
    title: 'Convert CSV files to TFLX',
    icons: ['file', 'refresh'],
    starter: {
      label: 'Step 1: Read from Trimble Connect',
      icon: 'folder_closed',
    },
    actions: [
      {
        label: 'Step 2: Convert CSV to TFLX',
        icon: 'refresh',
      },
      {
        label: 'Step 3: Write to Trimble Connect',
        icon: 'cloud_upload',
      },
    ],
  },
  {
    id: 'nwd-trb',
    category: 'Model processing',
    title: 'Convert Navisworks NWD files to TRB',
    icons: ['cube', 'file'],
    starter: {
      label: 'Step 1: Read from Trimble Connect',
      icon: 'folder_closed',
    },
    actions: [
      {
        label: 'Step 2: Convert NWD to TRB',
        icon: 'cube',
      },
      {
        label: 'Step 3: Write to Trimble Connect',
        icon: 'cloud_upload',
      },
    ],
  },
  {
    id: 'merge-trb',
    category: 'File management',
    title: 'Merge TRB files in project folders',
    icons: ['folder_closed', 'flowchart'],
    starter: {
      label: 'Step 1: Read from Trimble Connect',
      icon: 'folder_closed',
    },
    actions: [
      {
        label: 'Step 2: Merge TRB files',
        icon: 'flowchart',
      },
      {
        label: 'Step 3: Write to Trimble Connect',
        icon: 'cloud_upload',
      },
    ],
  },
];
