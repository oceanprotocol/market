import React, { ReactElement } from 'react'

import { useAppSelector } from '../../store'
import CategoryItem from './item'

export default function Categories(): ReactElement {
  const categoryNavigation = useAppSelector(
    (state) => state.navigation.category
  )

  return (
    <div className="flex">
      <div className="flex p-2.5 flex-col w-full overflow-y-auto pt-5 pb-4">
        <div className="flex w-full">
          <span className="pl-2 pb-3 text-gray-400">CATEGORIES</span>
        </div>

        <nav className="">
          {categoryNavigation.map((item) => (
            <CategoryItem key={item.title} item={item} />
          ))}
        </nav>
      </div>
    </div>
  )
}
