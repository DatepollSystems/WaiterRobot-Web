export type GenericGroupBinType = {
  type: 'ITEM' | 'GROUP';
  groupId?: number;
  groupName?: string;
  name: string;
};

export function sortBinTypes(a: GenericGroupBinType, b: GenericGroupBinType): number {
  // Compare groups and items by type first
  if (a.type !== b.type) {
    return a.type === 'GROUP' ? -1 : 1; // Groups come before items
  }

  // If both are groups or both are items, sort by name
  const nameComparison = a.name.localeCompare(b.name);
  if (nameComparison !== 0) {
    return nameComparison;
  }

  // If names are the same and both are items, sort by groupId
  if (a.type === 'ITEM' && b.type === 'ITEM') {
    return (a.groupId ?? 0) - (b.groupId ?? 0);
  }

  return 0;
}
