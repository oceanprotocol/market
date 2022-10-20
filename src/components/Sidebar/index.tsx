import React, { ReactElement } from 'react'

import { useAppSelector } from '../../store'
import SidebarItem from './item'

import { CaretDoubleRight, Logo } from '../../assets/images/icons'

export default function Sidebar(): ReactElement {
  const navigation = useAppSelector((state) => state.navigation.main)

  return (
    <div className="flex flex-col bg-gray-800 border-r-2 border-gray-600">
      {/* Index component, swap this element with another sidebar if you like */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center">
            <Logo className="h-9 w-auto" />
          </div>

          <nav className="space-y-2 mt-8 flex flex-col items-center">
            {navigation.map((item) => (
              <SidebarItem key={item.title} item={item} />
            ))}
          </nav>
        </div>

        <div className="flex flex-shrink-0 p-4">
          <div className="group block w-full flex-shrink-0">
            <CaretDoubleRight
              className="inline-block h-6 w-6 rounded-full cursor-pointer"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}
