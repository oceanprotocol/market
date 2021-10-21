import { SortDirectionOptions } from '../SortAndFilters'
export interface SearchQuery {
  from?: number
  size?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
  sort?: { [jsonPath: string]: SortDirectionOptions }
}
