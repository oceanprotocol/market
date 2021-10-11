export enum SortDirectionOptions {
  Ascending = 'asc',
  Descending = 'desc'
}

export enum SortTermOptions {
  Created = 'created',
  Relevance = '_score'
}

export enum FilterByTypeOptions {
  Data = 'dataset',
  Algorithm = 'algorithm'
}

export enum FilterByAccessOptions {
  Download = 'access',
  Compute = 'compute'
}

export interface SortOptions {
  sortBy: SortTermOptions
  sortDirection?: SortDirectionOptions
}

export type Filters = FilterByTypeOptions | FilterByAccessOptions
