export interface StudioStepConfigField {
  id: string;
  label: string;
  placeholder: string;
  helperText?: string;
}

const starterFieldsById: Record<string, StudioStepConfigField[]> = {
  'starter-file-created': [
    {
      id: 'project',
      label: 'Project',
      placeholder: 'Select a Trimble Connect project',
    },
    {
      id: 'watchFolder',
      label: 'Watch folder',
      placeholder: 'Select a folder',
      helperText: 'New files in this folder will trigger the workflow.',
    },
  ],
  'starter-file-updated': [
    {
      id: 'project',
      label: 'Project',
      placeholder: 'Select a Trimble Connect project',
    },
    {
      id: 'watchFolder',
      label: 'Watch folder',
      placeholder: 'Select a folder',
      helperText: 'Updated files in this folder will trigger the workflow.',
    },
  ],
  'starter-clash-detection': [
    {
      id: 'project',
      label: 'Project',
      placeholder: 'Select a Trimble Connect project',
    },
  ],
  'starter-rfi-created': [
    {
      id: 'projectSpace',
      label: 'Project space',
      placeholder: 'Select a ProjectSight project space',
    },
  ],
  'starter-issue-status': [
    {
      id: 'projectSpace',
      label: 'Project space',
      placeholder: 'Select a ProjectSight project space',
    },
    {
      id: 'status',
      label: 'Status',
      placeholder: 'Select a status',
      helperText: 'Trigger when an issue moves to this status.',
    },
  ],
};

const actionFieldsById: Record<string, StudioStepConfigField[]> = {
  'de-read-file-connect': [
    {
      id: 'sourceFile',
      label: 'Source file',
      placeholder: 'Select a file in Trimble Connect',
    },
  ],
  'de-read-folder-connect': [
    {
      id: 'sourceFolder',
      label: 'Source folder',
      placeholder: 'Select a folder in Trimble Connect',
    },
  ],
  'de-write-connect': [
    {
      id: 'destinationFolder',
      label: 'Destination folder',
      placeholder: 'Select a folder in Trimble Connect',
      helperText: 'Output files will be saved to this folder.',
    },
  ],
  'pm-create-rfi': [
    {
      id: 'projectSpace',
      label: 'Project space',
      placeholder: 'Select a ProjectSight project space',
    },
    {
      id: 'assignee',
      label: 'Default assignee',
      placeholder: 'Select a team member',
    },
  ],
  'pm-send-email': [
    {
      id: 'recipients',
      label: 'Recipients',
      placeholder: 'Enter email addresses',
      helperText: 'Separate multiple addresses with commas.',
    },
    {
      id: 'subject',
      label: 'Subject',
      placeholder: 'Email subject line',
    },
  ],
};

export function getStudioStepConfigFields(
  stepId: string,
  isStarter: boolean,
): StudioStepConfigField[] {
  if (isStarter) {
    return starterFieldsById[stepId] ?? [];
  }

  return actionFieldsById[stepId] ?? [];
}
