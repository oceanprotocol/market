import axios, { AxiosResponse } from 'axios'

export async function fetchData(url: string): Promise<AxiosResponse['data']> {
  try {
    const response = await axios(url)

    if (response.status !== 200) {
      return console.error('Non-200 response: ' + response.status)
    }

    return response.data
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}
