export enum SortDirectionOptions {
  Ascending = 'asc',
  Descending = 'desc'
}

export enum SortTermOptions {
  Created = 'nft.created',
  Relevance = '_score',
  Stats = 'stats.orders'
}

// Note: could not figure out how to get `enum` to be ambiant
// as final compiled js won't have it then.
// Only export/import works for that, so this file is NOT .d.ts file ending
// and gets imported in components.

export enum FilterByTypeOptions {
  Data = 'dataset',
  Algorithm = 'algorithm'
}

export enum FilterByAccessOptions {
  Download = 'access',
  Compute = 'compute'
}

declare global {
  interface SortOptions {
    sortBy: SortTermOptions
    sortDirection?: SortDirectionOptions
  }

  interface FilterTerm {
    [property: string]: {
      [property: string]: string | number | boolean | number[] | string[]
    }
  }

  type Filters = FilterByTypeOptions | FilterByAccessOptions

  interface SearchQuery {
    from?: number
    size?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any
    sort?: { [jsonPath: string]: SortDirectionOptions }
    aggs?: any
  }
}
