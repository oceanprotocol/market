import React, { ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { OnChangeValue, StylesConfig } from 'react-select'
import { useField } from 'formik'
import { InputProps } from '.'
import { getTagsList } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { useCancelToken } from '@hooks/useCancelToken'

const customStyles: StylesConfig<AutoCompleteOption, true> = {
  control: (styles, { isFocused }) => ({
    ...styles,
    borderColor: isFocused ? 'var(--font-color-text)' : 'var(--border-color)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'none',
    background: 'var(--background-content)',
    fontSize: 'var(--font-size-base)',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 'var(--font-weight-bold)',
    transition: '0.2s ease-in-out',
    '&:hover': {}
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: 'var(--border-color)'
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: 'var(--background-highlight)'
  }),
  option: (styles) => ({
    ...styles,
    backgroundColor: 'var(--background-highlight)',
    color: 'var(--font-color-heading)'
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: 'var(--background-highlight)'
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'var(--font-color-heading)',
    fontSize: 'var(--font-size-base)',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 'var(--font-weight-bold)'
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ':hover': {}
  }),
  valueContainer: (styles) => ({
    ...styles,
    color: 'var(--font-color-heading)'
  }),
  placeholder: (styles) => ({
    ...styles,
    // margin: 0,
    color: 'var(--color-secondary)',
    fontWeight: 'var(--font-weight-base)',
    transition: '0.2s ease-out',
    opacity: 0.7
  })
}

interface AutoCompleteOption {
  readonly value: string
  readonly label: string
}

export default function TagsAutoComplete({
  ...props
}: InputProps): ReactElement {
  const { chainIds } = useUserPreferences()
  const { name, placeholder } = props
  const [tagsList, setTagsList] = useState<AutoCompleteOption[]>()
  const [field, meta, helpers] = useField(name)
  const newCancelToken = useCancelToken()

  useEffect(() => {
    const generateTagsList = async () => {
      const tags = await getTagsList(chainIds, newCancelToken())
      const autocompleteOptions = tags?.map((tag) => ({
        value: tag,
        label: tag
      }))
      setTagsList(autocompleteOptions)
    }
    generateTagsList()
  }, [chainIds, newCancelToken])

  const handleChange = (userInput: OnChangeValue<AutoCompleteOption, true>) => {
    const normalizedInput = userInput.map((input) => input.value).join(', ')
    helpers.setValue(normalizedInput)
  }

  return (
    <CreatableSelect
      isMulti
      onChange={(value: AutoCompleteOption[]) => handleChange(value)}
      options={tagsList}
      placeholder={placeholder}
      styles={customStyles}
    />
  )
}
