export const STARTER_DRAG_MIME = 'application/x-studio-starter-id';
export const ACTION_DRAG_MIME = 'application/x-studio-action-id';

type DragEventWithTransfer = {
  dataTransfer: DataTransfer | null;
};

export function setStarterDragData(event: DragEventWithTransfer, starterId: string) {
  if (!event.dataTransfer) {
    return;
  }

  event.dataTransfer.setData(STARTER_DRAG_MIME, starterId);
  event.dataTransfer.effectAllowed = 'copy';
}

export function readStarterDragId(event: DragEventWithTransfer): string | null {
  const id = event.dataTransfer?.getData(STARTER_DRAG_MIME);
  return id || null;
}

export function setActionDragData(event: DragEventWithTransfer, actionId: string) {
  if (!event.dataTransfer) {
    return;
  }

  event.dataTransfer.setData(ACTION_DRAG_MIME, actionId);
  event.dataTransfer.effectAllowed = 'copy';
}

export function readActionDragId(event: DragEventWithTransfer): string | null {
  const id = event.dataTransfer?.getData(ACTION_DRAG_MIME);
  return id || null;
}

function dragTypesInclude(event: DragEventWithTransfer, mimeType: string): boolean {
  const types = event.dataTransfer?.types;
  if (!types) {
    return false;
  }

  return Array.from(types).includes(mimeType);
}

export function isStarterDrag(event: DragEventWithTransfer): boolean {
  return dragTypesInclude(event, STARTER_DRAG_MIME);
}

export function isActionDrag(event: DragEventWithTransfer): boolean {
  return dragTypesInclude(event, ACTION_DRAG_MIME);
}
