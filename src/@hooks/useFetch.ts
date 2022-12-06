import { useState } from 'react'
import { SignalOriginItem } from '../@context/Signals/_types'

export default function useFetch(baseUrl: string) {
  const [loading, setLoading] = useState(true)

  function get(url: string) {
    return new Promise((resolve, reject) => {
      fetch(baseUrl + url)
        .then((response) => response.json())
        .then((data) => {
          if (!data) {
            setLoading(false)
            return reject(data)
          }
          setLoading(false)
          resolve(data)
        })
        .catch((error) => {
          setLoading(false)
          reject(error)
        })
    })
  }
  // If we need to send data we can use the POST method here
  function post(url: string, body: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      fetch(baseUrl + url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data) {
            setLoading(false)
            return reject(data)
          }
          setLoading(false)
          resolve(data)
        })
        .catch((error) => {
          setLoading(false)
          reject(error)
        })
    })
  }

  return { get, post, loading }
}

export function useMockFetch(
  baseUrl: string,
  success: boolean,
  timeout: number,
  sampleSignals?: SignalOriginItem[]
) {
  const [loading, setLoading] = useState(false)

  function get(url = ''): Promise<SignalOriginItem[]> {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          setLoading(false)
          resolve(sampleSignals.length > 0 ? sampleSignals : [])
        } else {
          setLoading(false)
          console.log('error from signals API')
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ message: 'Error' })
        }
      }, timeout)
    })
  }
  return {
    loading,
    get
  }
}
