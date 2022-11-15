import { render, screen } from '@testing-library/react'
import React from 'react'
import Formik, { useFormikContext } from 'formik'
import FormEditMetadata from './FormEditMetadata'
import content from '../../../../content/pages/editMetadata.json'

jest.mock('formik')

describe('src/components/Asset/Edit/FormEditMetadata.tsx', () => {
  const useFormikContextMock = jest.spyOn(Formik, 'useFormikContext')

  it('renders fixed price', () => {
    // render()
    // (useFormikContext as jest.Mock).
    // <FormEditMetadata
    //   data={content.form.data}
    //   showPrice={true}
    //   isComputeDataset={false}
    // />
    expect(screen.getByText('New Title')).toBeInTheDocument()
  })
})
