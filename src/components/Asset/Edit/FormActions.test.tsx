import { render, screen } from '@testing-library/react'
import React from 'react'
import { useFormikContext } from 'formik'
import FormActions from './FormActions'

jest.mock('formik')

describe('@components/Asset/Edit/FormActions.tsx', () => {
  it('renders fixed price', () => {
    const isValid = true
    ;(useFormikContext as jest.Mock).mockReturnValue([isValid])
    render(<FormActions />)
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
