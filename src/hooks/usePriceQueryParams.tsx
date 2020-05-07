import { useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { useDebouncedCallback } from 'use-debounce'
import { setProperty } from '../utils'

function updateQuery(router: NextRouter) {
  return (min?: string, max?: string) => {
    const query = Object.assign({}, router.query)

    setProperty(query, 'minPrice', min)
    setProperty(query, 'maxPrice', max)

    router.push({
      pathname: router.pathname,
      query: query
    })
  }
}

export default function usePriceQueryParams() {
  const router = useRouter()
  const [min, setMin] = useState((router.query?.minPrice as string) || '0')
  const [max, setMax] = useState((router.query?.maxPrice as string) || '0')
  const [debouncedUpdateQuery] = useDebouncedCallback(updateQuery(router), 1000)

  useEffect(() => {
    if (parseFloat(max) < parseFloat(min)) {
      setMax(min)
    }
  }, [min])

  useEffect(() => {
    if (parseFloat(min) > parseFloat(max)) {
      setMin(max)
    }
  }, [max])

  useEffect(() => {
    debouncedUpdateQuery(min, max)
  }, [min, max])

  return { min, setMin, max, setMax }
}
