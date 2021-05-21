import fetch from 'cross-fetch'
import appConfig from '../../app.config'

export default async function rbacRequest(
  eventType: string,
  address: string
): Promise<boolean> {
  const url = appConfig.rbacUrl
  console.log('address', address)
  if (url === 'false') {
    return true
  } else {
    const data = {
      component: 'market',
      eventType,
      credentials: {
        token:
          'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDWVdQTTJLY1NKUjJtV0o2ZFBqZTVKVmZ5YTZnZXdhVElVZDBabUoyWndFIn0.eyJleHAiOjE2MjE1MjU0NDQsImlhdCI6MTYyMTUyNDg0NCwianRpIjoiYzRhY2U3NWItZTM1NC00ZjQwLWE0YTMtYjliMmQ4MDY1M2M5IiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pby9hdXRoL3JlYWxtcy9tYXJrZXRwbGFjZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkZDM2NDVlZi0zN2Q5LTQzMzQtOWEzYy1jMjczNTRkYmNkMWMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwb3J0YWwiLCJzZXNzaW9uX3N0YXRlIjoiYTY0NTRmYmQtNDk5Ni00MmMwLTk4ZWMtYWEzZjE3NmIzODhlIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3BvcnRhbC1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pbyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJwdWJsaXNoZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiamFtaWUgb2NlYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYW1pZUBvY2Vhbi5jb20iLCJnaXZlbl9uYW1lIjoiamFtaWUiLCJmYW1pbHlfbmFtZSI6Im9jZWFuIiwiZW1haWwiOiJqYW1pZUBvY2Vhbi5jb20ifQ.SwWiFq1jYXtLseZHZesyKuIINZwPx45aC4pMsBvtODOwUGIjw5srBhLHc4kT87SiKczv8YviOgW31xxZ4X30udHON5YbrTfeox9hWmzu6XPQDzIfkuhdorkH7HSpU2asiYKWlJ32hzhnbVJ8GqPy6nmWnCBE1yCiHzXq_vb3i90hJOtrueI2xHmU2rxw6B4iqXvGiswwCU12GL6eR1g0yaslHwYDf3BETvO_5XX4PtJJHeb3EOsozNS8pkL0r2Yy_V6ykH5LCOdX366GPmq1lwi89mYYKM_2n6xRCCHwzEvl1GuY9Zv79wt7zuJHM_LHh3REc8ic40L5MDn1N39vJQ'
      }
    }
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
