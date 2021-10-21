import { DDO } from '@oceanprotocol/lib'

export interface PagedAssets {
  results: DDO[]
  page: number
  totalPages: number
  totalResults: number
}
