export enum SortDirectionOptions {
  Ascending = 'asc',
  Descending = 'desc'
}

// todo update this
export enum SortTermOptions {
  Created = 'indexedMetadata.event.block',
  Relevance = '_score',
  Orders = 'indexedMetadata.stats.orders',
  Allocated = 'indexedMetadata.stats.allocated',
  Price = 'indexedMetadata.stats.prices.price',
  Sales = 'indexedMetadata.events.block'
}

// Note: could not figure out how to get `enum` to be ambiant
// as final compiled js won't have it then.
// Only export/import works for that, so this file is NOT .d.ts file ending
// and gets imported in components.

export enum FilterByTypeOptions {
  Data = 'dataset'
}

export enum FilterByAccessOptions {
  Download = 'access'
}

declare global {
  interface SortOptions {
    sortBy: SortTermOptions
    sortDirection?: SortDirectionOptions
  }

  export interface FilterTerm {
    term?: {
      [field: string]: string | number | boolean | number[] | string[]
    }
    range?: {
      [field: string]: {
        gt?: number
        gte?: number
        lt?: number
        lte?: number
      }
    }
  }

  type Filters = FilterByTypeOptions | FilterByAccessOptions

  interface SearchQuery {
    // index?: string
    from?: number
    size?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any
    sort?: { [jsonPath: string]: SortDirectionOptions }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aggs?: any
  }
}
