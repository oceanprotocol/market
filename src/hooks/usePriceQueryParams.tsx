import { useEffect, useState } from 'react'
import { useLocation } from '@reach/router'
import queryString from 'query-string'

export default function usePriceQueryParams() {
  const location = useLocation()

  const [min, setMin] = useState(
    (queryString.parse(location.search).minPrice as string) || '0'
  )
  const [max, setMax] = useState(
    (queryString.parse(location.search).maxPrice as string) || '0'
  )

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

  return { min, setMin, max, setMax }
}
