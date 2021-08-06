import React from 'react'
import { render } from '@testing-library/react'
import Disclaimer from '../../../src/components/atoms/Input/Disclaimer'

describe('Disclaimer', () => {
  it('renders without crashing', () => {
    const disclaimerText = 'test'
    const { container } = render(
      <Disclaimer visible>{disclaimerText}</Disclaimer>
    )

    const disclaimerByClass = container.querySelector('.disclaimer')
    const disclaimerByVisibility = container.querySelector('.hidden')

    expect(disclaimerByClass).toBeInTheDocument()
    expect(disclaimerByVisibility).not.toBeInTheDocument()
    expect(container).toHaveTextContent(disclaimerText)
  })
})
