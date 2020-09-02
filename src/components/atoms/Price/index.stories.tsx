import { DDO } from '@oceanprotocol/lib'
import React from 'react'
import Price from '.'
import ddo from '../../../../tests/unit/__fixtures__/ddo'

export default {
  title: 'Atoms/Price'
}

export const Normal = () => <Price ddo={ddo as DDO} />

export const Small = () => <Price ddo={ddo as DDO} small />
