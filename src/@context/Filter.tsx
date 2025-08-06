import {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState
} from 'react'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../src/@types/aquarius/SearchQuery'

export interface Filters {
  [key: string]: string[]
}

export interface Sort {
  sort: SortTermOptions
  sortOrder: SortDirectionOptions
}

interface FilterValue {
  filters: Filters
  setFilters: (filters: Filters) => void
  ignorePurgatory: boolean
  setIgnorePurgatory: (value: boolean) => void
  sort: Sort
  setSort: (sort: Sort) => void
}

const FilterContext = createContext({} as FilterValue)

function FilterProvider({ children }: { children: ReactNode }): ReactElement {
  const [filters, setFilters] = useState<Filters>({
    accessType: [],
    serviceType: [],
    filterSet: [],
    filterTime: [],
    assetState: []
  })
  const [ignorePurgatory, setIgnorePurgatory] = useState<boolean>(true)
  const [sort, setSort] = useState<Sort>({
    sort: SortTermOptions.Created,
    sortOrder: SortDirectionOptions.Descending
  })

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <FilterContext.Provider
      value={
        {
          filters,
          setFilters,
          ignorePurgatory,
          setIgnorePurgatory,
          sort,
          setSort
        } as FilterValue
      }
    >
      {children}
    </FilterContext.Provider>
  )
}

// Helper hook to access the provider values
const useFilter = (): FilterValue => useContext(FilterContext)

export { FilterProvider, useFilter }
