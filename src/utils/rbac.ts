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
          'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDWVdQTTJLY1NKUjJtV0o2ZFBqZTVKVmZ5YTZnZXdhVElVZDBabUoyWndFIn0.eyJleHAiOjE2MjE1MTE2MTgsImlhdCI6MTYyMTUxMTAxOCwianRpIjoiZWI3YzZjNmYtYjVjYi00YjA0LWI0ZjAtOWMzZTEzOGM3YWViIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pby9hdXRoL3JlYWxtcy9tYXJrZXRwbGFjZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkZDM2NDVlZi0zN2Q5LTQzMzQtOWEzYy1jMjczNTRkYmNkMWMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwb3J0YWwiLCJzZXNzaW9uX3N0YXRlIjoiMzU3NmIyNWUtYjNkNy00ZDkwLTgxNDAtYTE5MzQ3NjZmNTMyIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3BvcnRhbC1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pbyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJwdWJsaXNoZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiamFtaWUgb2NlYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYW1pZUBvY2Vhbi5jb20iLCJnaXZlbl9uYW1lIjoiamFtaWUiLCJmYW1pbHlfbmFtZSI6Im9jZWFuIiwiZW1haWwiOiJqYW1pZUBvY2Vhbi5jb20ifQ.YAuPrGiJHDnziuNBR67NMPNcrffCyJeUDAFMI3ugy8_NsahM0V6HIAfZ3pjAbX94TP_L1NbCLlbqRdMcRviJxaM1ffWe6JZ_2ktr1kGPtUScen8YF3Gke_uFMDVlkg4fjZi50-DVUy9GmuKcdHEBoRxLC3j1RfOpXtfVq8LIuIG04bJD0JUTxwsoZhmNXvcyldjN2XDsDKXJ90aLzE3do9GaHajTERbAiOXDFjUSxk2B4lttZyU9ZIVVNEVCJ6J0NjW_H-y0Jdqk-MqdpIaWW0k3X_i7nlvVh4bt0aFcGpb6LIyphL5Ivl7hbggg3_zetYAsdwJFgL5f7ICG8heX0Q'
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
