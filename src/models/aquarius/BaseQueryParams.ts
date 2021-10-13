import { SortOptions } from '../SortAndFilters'
import { EsPaginationOptions } from './EsPaginationOptions'
import { FilterTerm } from './FilterTerm'

export interface BaseQueryParams {
  chainIds: number[]
  nestedQuery?: any
  esPaginationOptions?: EsPaginationOptions
  sortOptions?: SortOptions
  filters?: FilterTerm[]
  ignorePurgatory?: boolean
}
