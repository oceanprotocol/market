import testRender from '../../../../.jest/testRender'
import { render } from '@testing-library/react'
import React from 'react'
import MostViews from '.'

describe('components/Home/MostViews', () => {
  testRender(<MostViews />)
})
