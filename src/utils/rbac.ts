import fetch from 'cross-fetch'

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
  console.log('data', data)
  console.log('process.env.RBAC_URL', process.env.RBAC_URL)
  try {
    console.log('Start fetch')
    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    console.log('Start fetch')
    console.log('response', response)
    return await response.json()
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}
