import axios, { AxiosResponse } from 'axios'

export async function fetchData(url: string): Promise<AxiosResponse['data']> {
  console.log('fetchData axios', url)
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

export async function fetchAllData(urls: string[]) {
  const signalRequests = urls.map((url) => axios.get(url))
  try {
    return await Promise.all(signalRequests).then(
      axios.spread((...allData) => {
        console.log({ allData })
        return allData
      })
    )
  } catch (error) {
    console.error('Error parsing json: ', error)
  }
}
