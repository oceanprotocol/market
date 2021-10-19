import { DDO } from '@oceanprotocol/lib'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  interface PagedAssets {
    results: DDO[]
    page: number
    totalPages: number
    totalResults: number
  }
}
