import React from 'react'
import testRender from '../../../../.jest/testRender'
import AnnouncementBanner from './index'

describe('@shared/AnnouncementBanner', () => {
  testRender(
    <AnnouncementBanner
      text="# Hello World!"
      action={{ name: 'hello', handleAction: jest.fn() }}
      state="success"
    />
  )
})
