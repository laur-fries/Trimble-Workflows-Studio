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
  'starter-bcf-topic-created': [
    {
      id: 'project',
      label: 'Project',
      placeholder: 'Select a Trimble Connect project',
    },
    {
      id: 'modelSpace',
      label: 'Model space',
      placeholder: 'Select a model space',
      helperText: 'New BCF topics in this model space will trigger the workflow.',
    },
  ],
  'starter-on-schedule': [
    {
      id: 'frequency',
      label: 'Frequency',
      placeholder: 'Select schedule frequency',
    },
    {
      id: 'runTime',
      label: 'Run time',
      placeholder: 'Select run time',
      helperText: 'The workflow runs automatically at this time.',
    },
  ],
  'starter-polling-interval': [
    {
      id: 'interval',
      label: 'Polling interval',
      placeholder: 'Every 15 minutes',
      helperText: 'How often the workflow checks for updates.',
    },
  ],
  'starter-on-demand': [
    {
      id: 'runLabel',
      label: 'Run button label',
      placeholder: 'Run workflow',
      helperText: 'Label shown on the manual run action.',
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
  'pm-create-project-space': [
    {
      id: 'projectSpace',
      label: 'Project space',
      placeholder: 'Select a ProjectSight project space',
    },
    {
      id: 'projectName',
      label: 'Project name',
      placeholder: 'Enter a project name',
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
