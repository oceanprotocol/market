import fetch from 'cross-fetch'

export async function rebacRequest(
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
  try {
    const response = await fetch(process.env.RBAC_URL, {
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
