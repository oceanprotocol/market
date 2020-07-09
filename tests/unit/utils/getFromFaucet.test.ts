import axios, { AxiosResponse } from 'axios'
import getFromFaucet from '../../../src/utils/getFromFaucet'

jest.mock('axios')

describe('getFromFaucet()', () => {
  ;(axios as any).mockResolvedValue({
    data: { success: true, message: 'hello' }
  } as AxiosResponse)

  it('can be called', async () => {
    const response = await getFromFaucet('0x0000000')
    expect(response.message).toBe('hello')
  })
})
