import testRender from '../../../../.jest/testRender'
import { render } from '@testing-library/react'
import React from 'react'
import Pagination from './index'
import { MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS } from '@utils/aquarius'

describe('@shared/Pagination', () => {
  testRender(
    <Pagination
      totalPages={MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS + 1}
      currentPage={2}
      rowsPerPage={10}
      rowCount={30}
      onChangePage={() => jest.fn()}
    />
  )

  it('renders without currentPage prop', () => {
    render(
      <Pagination
        totalPages={10}
        rowsPerPage={10}
        rowCount={30}
        onChangePage={() => jest.fn()}
      />
    )
  })
})
