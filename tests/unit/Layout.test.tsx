import React from 'react'
import testRender from './testRender'
import Layout from '../../src/components/Layout'

describe('Layout', () => {
  testRender(
    <Layout location={{ href: 'https://demo.com' } as Location}>Hello</Layout>
  )
})
