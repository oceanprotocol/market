import React from 'react'
import testRender from '../../tests/unit/testRender'
import Layout from './Layout'

describe('Layout', () => {
  testRender(
    <Layout location={{ href: 'https://demo.com' } as Location}>Hello</Layout>
  )
})
