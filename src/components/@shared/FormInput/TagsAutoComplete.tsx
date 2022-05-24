import React, { ReactElement } from 'react'
import CreatableSelect from 'react-select/creatable'
import { OnChangeValue } from 'react-select'
import { useField } from 'formik'
import { InputProps } from '.'

interface AutoCompleteOption {
  readonly value: string
  readonly label: string
}

interface AutoCompleteProps extends InputProps {
  autoCompleteOptions?: AutoCompleteOption[]
}

export default function TagsAutoComplete({
  autoCompleteOptions,
  ...props
}: AutoCompleteProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  const handleChange = (userInput: OnChangeValue<AutoCompleteOption, true>) => {
    const normalizedInput = userInput.map((input) => input.value).join(', ')
    console.log(normalizedInput)
    helpers.setValue(normalizedInput)
  }

  return (
    <CreatableSelect
      isMulti
      onChange={(value: AutoCompleteOption[]) => handleChange(value)}
      options={autoCompleteOptions}
    />
  )
}
