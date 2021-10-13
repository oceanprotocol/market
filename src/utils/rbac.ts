import fetch from 'cross-fetch'
import appConfig from '../../app.config'

export default async function rbacRequest(
  eventType: string,
  address: string,
  signal?: AbortSignal
): Promise<boolean | 'ERROR'> {
  const url = appConfig.rbacUrl
  if (url === '') {
    return true
  } else {
    const data = {
      component: 'market',
      eventType,
      authService: 'address',
      credentials: {
        address
      }
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        signal: signal
      })
      return await response.json()
    } catch (error) {
      console.error('Error parsing json: ' + error.message)
      return 'ERROR'
    }
  }
}
