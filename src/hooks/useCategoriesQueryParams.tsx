import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { setProperty, JSONparse } from '../utils'

const CATEGORIES_QUERY_PARAM = 'categories'

// Set selected categories if they are in the query param
const useGetCategoriesFromQueryParam = (
  allCategories: string[],
  setSelectedCategories: (categories: string[]) => void
) => {
  const router = useRouter()

  useEffect(() => {
    if (router.query && router.query.categories) {
      const parsedCategories = JSONparse<string[]>(
        router.query.categories as string,
        'Error parsing router.query.categories and setting parsedCategories'
      )
      // Only set/accept elements that are actually in allCcategories
      const categoriesFromUrl = (parsedCategories || []).filter((pc: string) =>
        allCategories.includes(pc)
      )
      setSelectedCategories(categoriesFromUrl)
    }
  }, [])
}

export default function useCategoriesQueryParam(allCategories: string[]) {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  useGetCategoriesFromQueryParam(allCategories, setSelectedCategories)

  // Update url and the state with the selected categories
  const toggleCategory = (category: string) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newSelectedCategories)

    // If newSelectedCategories remove the search query param, else set it
    const queryParamValue =
      newSelectedCategories.length === 0
        ? undefined
        : JSON.stringify(newSelectedCategories)
    const query = Object.assign({}, router.query)
    setProperty(query, CATEGORIES_QUERY_PARAM, queryParamValue)
    router.push({
      pathname: router.pathname,
      query: query
    })
  }

  return {
    selectedCategories,
    toggleCategory
  }
}
