import { LoggerInstance } from '@oceanprotocol/lib'
import { generateBaseQuery, queryMetadata } from '@utils/aquarius'
import axios, { CancelToken } from 'axios'
import { SortTermOptions } from '../../../../src/@types/aquarius/SearchQuery'

export async function getTopTags(
  chainIds: number[],
  cancelToken: CancelToken
): Promise<string[]> {
  const baseQueryParams = {
    chainIds,
    aggs: {
      topTags: {
        terms: {
          field: 'metadata.tags.keyword',
          size: 20,
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

  const query = generateBaseQuery(baseQueryParams)
  try {
    const result = await queryMetadata(query, cancelToken)
    const tagsList = result?.aggregations?.topTags?.buckets.map(
      (x: { key: string }) => x.key
    )
    return tagsList
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}
