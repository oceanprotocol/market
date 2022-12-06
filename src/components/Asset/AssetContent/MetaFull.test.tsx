import { render, screen } from '@testing-library/react'
import React from 'react'
import MetaFull from './MetaFull'
import { datasetAquarius } from '../../../../.jest/__fixtures__/datasetAquarius'
import { algorithmAquarius } from '../../../../.jest/__fixtures__/algorithmAquarius'

describe('src/components/Asset/AssetContent/MetaFull.tsx', () => {
  it('renders metadata', () => {
    render(<MetaFull ddo={datasetAquarius} />)
    expect(screen.getByText('Owner')).toBeInTheDocument()
  })

  it('renders metadata for an algorithm', () => {
    render(<MetaFull ddo={algorithmAquarius} />)
    expect(screen.getByText('Docker Image')).toBeInTheDocument()
  })

  it('renders Revenue collector when it is different to owner', () => {
    const paymentCollector = '0x99840Df5Cb42faBE0Feb8811Aaa4BC99cA6C84e1'
    const setPaymentCollector = jest.fn()
    React.useState = jest
      .fn()
      .mockReturnValue([paymentCollector, setPaymentCollector])
    render(<MetaFull ddo={algorithmAquarius} />)
    expect(screen.getByText('Revenue Sent To')).toBeInTheDocument()
    expect(screen.getByText('0x9984…84e1')).toBeInTheDocument()
  })
})
