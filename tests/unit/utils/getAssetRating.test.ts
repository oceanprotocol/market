import axios, { AxiosResponse } from 'axios'
import getAssetRating, {
  GetRatingResponse
} from '../../../src/utils/getAssetRating'

jest.mock('axios')

describe('getAssetRating()', () => {
  it('success', async () => {
    const ratingResponse: GetRatingResponse = {
      comment: '',
      datePublished: '',
      vote: 5
    }

    ;(axios.get as any).mockResolvedValueOnce({
      data: [ratingResponse, ratingResponse]
    } as AxiosResponse)

    const response = await getAssetRating('0x00', '0x00')
    expect(response && response.vote).toBe(5)
  })
})
