import React, { CSSProperties, ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { OnChangeValue } from 'react-select'
import { useField } from 'formik'
import { InputProps } from '.'
import { getTagsList } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { useCancelToken } from '@hooks/useCancelToken'

const customStyles = {
  control: (
    styles: CSSProperties,
    {
      isFocused,
      isSelected
    }: {
      isFocused: boolean
      isSelected: boolean
    }
  ) => ({
    ...styles,
    borderColor:
      isFocused || isSelected
        ? 'var(--font-color-text)'
        : 'var(--border-color)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'none',
    background: 'var(--background-content)',
    fontSize: 'var(--font-size-base)',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 'var(--font-weight-bold)',
    '&:hover': {}
  }),
  indicatorSeparator: (styles: CSSProperties) => ({
    ...styles,
    backgroundColor: 'var(--border-color)'
  }),
  menu: (styles: CSSProperties) => ({
    ...styles,
    backgroundColor: 'var(--background-highlight)'
  }),
  option: (styles: CSSProperties) => ({
    ...styles,
    backgroundColor: 'var(--background-highlight)',
    color: 'var(--font-color-heading)'
  }),
  multiValue: (styles: CSSProperties) => ({
    ...styles,
    backgroundColor: 'var(--background-highlight)'
  }),
  multiValueLabel: (styles: CSSProperties) => ({
    ...styles,
    color: 'var(--font-color-heading)'
  }),
  multiValueRemove: (styles: CSSProperties) => ({
    ...styles,
    ':hover': {}
  }),
  valueContainer: (styles: CSSProperties) => ({
    ...styles,
    color: 'var(--font-color-heading)'
  }),
  placeholder: (styles: CSSProperties) => ({
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
