import fetch from 'cross-fetch'
import appConfig from '../../app.config'

export async function rbacRequest(
  component: string,
  eventType: string,
  token: string
): Promise<Response> {
  const data = {
    component,
    eventType,
    credentials: {
      token
    }
  }
  console.log('appConfig', appConfig)
  console.log('appConfig rbacUrl', appConfig.rbacUrl)
  try {
    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}
