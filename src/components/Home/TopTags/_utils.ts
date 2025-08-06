import { LoggerInstance } from '@oceanprotocol/lib'
import { generateBaseQuery, queryMetadataTags } from '@utils/aquarius'
import axios, { CancelToken } from 'axios'
import { SortTermOptions } from '../../../../src/@types/aquarius/SearchQuery'

export async function getTopTags(
  chainIds: number[],
  cancelToken: CancelToken,
  size = 20
): Promise<string[]> {
  const baseQueryParams = {
    chainIds,
    query: {
      bool: {
        filter: [
          { terms: { chainId: chainIds } },
          { exists: { field: 'indexedMetadata.stats.orders' } },
          { exists: { field: 'metadata.tags' } }
        ]
      }
    },
    aggs: {
      topTags: {
        terms: {
          field: 'metadata.tags.keyword',
          size,
          order: { totalSales: 'desc' }
        },
        aggs: {
          totalSales: {
            sum: {
              field: SortTermOptions.Orders
            }
          }
        }
      }
    },
    esPaginationOptions: { from: 0, size: 0 }
  } as BaseQueryParams

  try {
    const query = generateBaseQuery(baseQueryParams)
    const result = await queryMetadataTags(query, cancelToken)

    const tagsList = result?.tags || []

    if (tagsList.length === 0) {
      LoggerInstance.warn('No tags found in aggregation results')
    }

    return tagsList
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log('Query canceled:', error.message)
    } else {
      LoggerInstance.error('Error fetching top tags:', error.message)
    }
    return []
  }
}
