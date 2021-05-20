import fetch from 'cross-fetch'
import appConfig from '../../app.config'

export default async function rbacRequest(eventType: string): Promise<boolean> {
  const url = appConfig.rbacUrl

  if (url === 'false') {
    return true
  } else {
    const data = {
      component: 'market',
      eventType,
      credentials: {
        token:
          'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDWVdQTTJLY1NKUjJtV0o2ZFBqZTVKVmZ5YTZnZXdhVElVZDBabUoyWndFIn0.eyJleHAiOjE2MjE1MjA4MTUsImlhdCI6MTYyMTUyMDIxNSwianRpIjoiZmRhODM1Y2MtOTMyNi00YmM5LTkwNTktZWI5NWMxY2IwY2M3IiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pby9hdXRoL3JlYWxtcy9tYXJrZXRwbGFjZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkZDM2NDVlZi0zN2Q5LTQzMzQtOWEzYy1jMjczNTRkYmNkMWMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwb3J0YWwiLCJzZXNzaW9uX3N0YXRlIjoiZjBjZTE3YmQtZTM5ZS00N2E4LTkzMWMtNjUwNDBhZjNjZGJiIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3BvcnRhbC1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pbyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJwdWJsaXNoZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiamFtaWUgb2NlYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYW1pZUBvY2Vhbi5jb20iLCJnaXZlbl9uYW1lIjoiamFtaWUiLCJmYW1pbHlfbmFtZSI6Im9jZWFuIiwiZW1haWwiOiJqYW1pZUBvY2Vhbi5jb20ifQ.OTDbNFg8FusY-TovkdpSZZqVcBQ8xVRQfl-Hf0aCzRioRLYc0mri4hgenbVubDsVqyThZU7xOIXUoQ2-mTGqQA0zwpgqKY-ntRz2XZ1GW6saVIiFMuYDCRpiL1KVdW0s0gVZKNJoYHT1O31Xg7aQ7qN8E0f8TFnK_pDwKZ5AEj5VyDVhDcHEqJo1pW6ElVe5A1Rnh7m11SsZ_yi5lbrfssa18RFOzU9XYSmqdqEsEzFGxlAdiTB-eeFSRTt7jUALVZ66jPiUQ6fju8qI9KKRB9Tg80N3sfjoULUp_EwbYGx7HVuxtvl_cPUYDpmb3gsjsAU1Fd877ddpLvsfTxi4hw'
      }
    }
    console.log('appConfig', appConfig)
    console.log('appConfig rbacUrl', appConfig.rbacUrl)
    try {
      const response = await fetch(url, {
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
}
