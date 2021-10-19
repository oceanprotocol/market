interface EsPaginationOptions {
  from?: number
  size?: number
}

interface BaseQueryParams {
  chainIds: number[]
  nestedQuery?: any
  esPaginationOptions?: EsPaginationOptions
  sortOptions?: SortOptions
  filters?: FilterTerm[]
  ignorePurgatory?: boolean
}
