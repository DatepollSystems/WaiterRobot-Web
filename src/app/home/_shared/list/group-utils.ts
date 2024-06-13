export function removeGroup(columnsToDisplay: string[]): string[] {
  const index = columnsToDisplay.indexOf('group');
  if (index !== -1) {
    columnsToDisplay.splice(index, 1);
  }
  return columnsToDisplay;
}

export function addGroupIfMissing(columnsToDisplay: string[]): string[] {
  const index = columnsToDisplay.indexOf('group');
  if (index === -1) {
    columnsToDisplay.splice(1, 0, 'group');
  }
  return columnsToDisplay;
}
