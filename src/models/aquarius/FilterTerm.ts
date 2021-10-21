export interface FilterTerm {
  [property: string]: {
    [property: string]: string | number | boolean | number[] | string[]
  }
}
