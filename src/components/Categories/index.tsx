import React, { ReactElement } from 'react'

import { useAppSelector } from '../../store'
import Category from './item'
import { CategoryItem } from '../../slices/categories'

type CategoriesProps = {
  categories: CategoryItem[]
}

export default function Categories({
  categories
}: CategoriesProps): ReactElement {
  return (
    <div className="flex">
      <div className="flex flex-col w-full overflow-y-auto pt-5 pb-4">
        <div className="flex w-full">
          <span className="pb-3 text-gray-400">CATEGORIES</span>
        </div>

        <nav className="">
          {categories.map((item) => (
            <Category key={item.title} item={item} />
          ))}
        </nav>
      </div>
    </div>
  )
}
