import React, { ReactElement } from 'react'
import Link from 'next/link'
import { NavigationState } from '../../slices/navigation'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

declare type SidebarItemProps = {
  item: NavigationState
}

export default function SidebarItem({ item }: SidebarItemProps): ReactElement {
  return (
    <Link key={item.title} href={item.url}>
      <a
        className={classNames(
          item.current
            ? 'bg-blue-800 text-white'
            : 'text-white hover:bg-blue-600 hover:bg-opacity-75',
          'group flex items-center px-1 py-3 font-medium rounded-md'
        )}
      >
        <item.icon
          className="h-6 w-6 flex-shrink-0 text-blue-300"
          aria-hidden="true"
        />
        {/* {item.title} */}
      </a>
    </Link>
  )
}
