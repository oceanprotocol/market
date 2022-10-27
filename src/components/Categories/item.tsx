import React, { ReactElement } from 'react'
import Link from 'next/link'
import { CategoryItem } from '../../slices/categories'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

declare type CategoryItemProps = {
  item: CategoryItem
}

export default function Category({ item }: CategoryItemProps): ReactElement {
  return (
    <Link key={item.title} href={item.url}>
      <a
        className={classNames(
          item.current
            ? 'bg-gray-800 text-white'
            : 'text-white hover:bg-gray-600 hover:bg-opacity-75',
          'flex w-64 flex-row py-3 font-medium rounded-md'
        )}
      >
        <div>
          <item.icon className="h-6 w-6" />
        </div>
        <span className="pl-2">{item.title}</span>
      </a>
    </Link>
  )
}
