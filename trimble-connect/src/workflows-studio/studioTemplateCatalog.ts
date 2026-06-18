import type { StudioTemplate, StudioTemplateGroup } from './data';


export type StudioTemplateViewMode = 'grid' | 'list';

export type StudioTemplateSortField = 'title' | 'publisher' | 'steps' | 'clones' | 'version';

export type StudioTemplateSortDirection = 'asc' | 'desc';

export function getTemplateStepCount(template: StudioTemplate): number {
  return template.stepCount ?? template.steps.length;
}

export function formatTeamClones(count: number): string {
  return count.toLocaleString();
}

export function formatTemplateMetaMetrics(template: StudioTemplate): string | null {
  const parts: string[] = [];

  if (template.stepCount > 0) {
    parts.push(`${getTemplateStepCount(template)} Steps`);
  }

  if (template.reclaimedTime) {
    parts.push(`Est. Time Saved: ${template.reclaimedTime}`);
  }

  return parts.length > 0 ? parts.join(' | ') : null;
}

export function matchesTemplateSearch(template: StudioTemplate, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return true;
  }

  const haystack = [
    template.title,
    template.description,
    template.publisher,
    template.groupTitle,
    template.version,
    template.reclaimedTime,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

export type StudioTemplateCatalogFilter = ReadonlySet<string>;

export function matchesGroupFilter(groupId: string, selectedGroupIds: StudioTemplateCatalogFilter): boolean {
  if (selectedGroupIds.size === 0) {
    return true;
  }

  return selectedGroupIds.has(groupId);
}

export function filterTemplateGroups(
  groups: StudioTemplateGroup[],
  searchQuery: string,
  selectedGroupIds: StudioTemplateCatalogFilter,
): StudioTemplateGroup[] {
  return groups
    .filter((group) => matchesGroupFilter(group.id, selectedGroupIds))
    .map((group) => ({
      ...group,
      templates: group.templates.filter((template) => matchesTemplateSearch(template, searchQuery)),
    }))
    .filter((group) => group.templates.length > 0);
}

export function flattenTemplates(groups: StudioTemplateGroup[]): StudioTemplate[] {
  return groups.flatMap((group) => group.templates);
}

export function sortTemplates(
  templates: StudioTemplate[],
  sortField: StudioTemplateSortField,
  sortDirection: StudioTemplateSortDirection,
): StudioTemplate[] {
  const direction = sortDirection === 'asc' ? 1 : -1;

  return [...templates].sort((left, right) => {
    let comparison = 0;

    switch (sortField) {
      case 'publisher':
        comparison = left.publisher.localeCompare(right.publisher);
        break;
      case 'steps':
        comparison = getTemplateStepCount(left) - getTemplateStepCount(right);
        break;
      case 'clones':
        comparison = left.teamClones - right.teamClones;
        break;
      case 'version':
        comparison = left.version.localeCompare(right.version);
        break;
      case 'title':
      default:
        comparison = left.title.localeCompare(right.title);
        break;
    }

    return comparison * direction;
  });
}
