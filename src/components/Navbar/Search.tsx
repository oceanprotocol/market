import React, { ReactElement } from 'react'
import { ChevronDown, SearchIcon } from '../../assets/images/icons'

export default function Search(): ReactElement {
  return (
    <form className="flex w-full h-10 " action="#" method="GET">
      <div className="relative border border-gray-300 rounded-md py-1 w-full text-gray-300 ">
        <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          <SearchIcon />
        </div>
        <div className="cursor-pointer absolute inset-y-0 right-2 flex items-center">
          <ChevronDown />
        </div>
        <input
          id="search-field"
          className="bg-gray-800 block h-full w-full py-2 pl-8 pr-3 placeholder-gray-300 focus:border-transparent focus:placeholder-gray-300 focus:outline-none focus:ring-0 sm:text-sm"
          placeholder="Search"
          type="search mm"
          name="search"
        />
      </div>
    </form>
  )
}
