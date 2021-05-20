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
          '1eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDWVdQTTJLY1NKUjJtV0o2ZFBqZTVKVmZ5YTZnZXdhVElVZDBabUoyWndFIn0.eyJleHAiOjE2MjE1MjAxNzcsImlhdCI6MTYyMTUxOTU3NywianRpIjoiZWFhZjQ2NmQtY2NhNy00MDlkLWEzNGItNzA1N2I2MjQ4NDFhIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pby9hdXRoL3JlYWxtcy9tYXJrZXRwbGFjZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkZDM2NDVlZi0zN2Q5LTQzMzQtOWEzYy1jMjczNTRkYmNkMWMiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwb3J0YWwiLCJzZXNzaW9uX3N0YXRlIjoiY2UxMjAxOTMtMDhhZi00ODRiLTk4OGUtYjhiMjlhYzVhNjY2IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3BvcnRhbC1pbnQuZGF0YS1tYXJrZXRwbGFjZS5pbyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJwdWJsaXNoZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiamFtaWUgb2NlYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYW1pZUBvY2Vhbi5jb20iLCJnaXZlbl9uYW1lIjoiamFtaWUiLCJmYW1pbHlfbmFtZSI6Im9jZWFuIiwiZW1haWwiOiJqYW1pZUBvY2Vhbi5jb20ifQ.edeI8XiJk_v_vM0dwRXHWZK4hJ5GR_Wq-i2J00oBGt-7LSvEAqqyG39muMluqeoL1_s9KVaetVZqrESdksZyeu3AtmYJh_Nre7UjY75KgRsq2DTMHr4d20AjKQeBO0_ndyiz4rldrMiNhjK5Xi_uK3Aoh9VyuP5974IX4a0410Q_TiAB1I-zfYamWEgtl5GG1ErcZ2ecjL6HMP2uD3fLxanc674oHEVDojfTybYyI2Ao66OBU8NUvKZGajd0N2uTm-70jNSlAOJoVYHPdpmasfzFJ-gl5mUnlfNc_0hUsXy4sMmjIXQV0L6mrTSch7yiLrgYuxNDS0_EjD6h0ZJ9mg'
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
