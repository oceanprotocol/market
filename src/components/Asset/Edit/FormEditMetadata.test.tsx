import { render, screen } from '@testing-library/react'
import React from 'react'
import Formik, { FormikErrors, FormikTouched, FormikState } from 'formik'
import FormEditMetadata from './FormEditMetadata'
import content from '../../../../content/pages/editMetadata.json'

let fieldMock = {}
const metaMock = {}
const helperMock = {}

jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useField: jest.fn(() => {
    return [fieldMock, metaMock, helperMock]
  })
}))

describe('src/components/Asset/Edit/FormEditMetadata.tsx', () => {
  // const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext')

  it('renders fixed price', () => {
    fieldMock = { foo: 'bar' }
    render(
      <FormEditMetadata
        data={content.form.data}
        showPrice={true}
        isComputeDataset={false}
      />
    )
    expect(screen.getByText('New Title')).toBeInTheDocument()
  })
})
