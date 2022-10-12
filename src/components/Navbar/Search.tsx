import React from 'react'
import { FiSearch } from 'react-icons/fi'

const Search: React.FC = () => {
  return (
    <form className="w-full max-w-xs mr-2">
      <div className="relative">
        <input
          type="search"
          name="search"
          placeholder="Search..."
          className="w-full h-10 pl-10 pr-5 text-sm rounded-full appearance-none focus:outline-none bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        />
        <button type="submit" className="absolute top-0 left-0 mt-3 ml-4">
          <FiSearch className="w-4 h-4 stroke-current" />
        </button>
      </div>
    </form>
  )
}

export default Search
