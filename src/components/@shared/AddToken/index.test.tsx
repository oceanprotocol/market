import React from 'react'
import { act, render } from '@testing-library/react'
import AddToken from './'

test('render AddToken ', async () => {
  const args = {
    address: '0xd8992Ed72C445c35Cb4A2be468568Ed1079357c8',
    symbol: 'OCEAN',
    logo: 'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png'
  }
  // TODO: remove eslint rule (testing-library/no-unnecessary-act) and solve act issue
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(<AddToken {...args} />)
  })
})
