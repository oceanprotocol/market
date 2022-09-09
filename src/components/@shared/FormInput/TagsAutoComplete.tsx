import React, { ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { OnChangeValue } from 'react-select'
import { useField } from 'formik'
import { InputProps } from '.'
import { getTagsList } from '@utils/aquarius'
import { chainIds } from 'app.config'
import { useCancelToken } from '@hooks/useCancelToken'
import styles from './TagsAutoComplete.module.css'

interface AutoCompleteOption {
  readonly value: string
  readonly label: string
}

export default function TagsAutoComplete({
  ...props
}: InputProps): ReactElement {
  const { name, placeholder } = props
  const [tagsList, setTagsList] = useState<AutoCompleteOption[]>()
  const [field, meta, helpers] = useField(name)
  const [input, setInput] = useState<string>()

  const newCancelToken = useCancelToken()

  const generateAutocompleteOptions = (
    options: string[]
  ): AutoCompleteOption[] => {
    return options?.map((tag) => ({
      value: tag,
      label: tag
    }))
  }

  const defaultTags = !field.value
    ? undefined
    : generateAutocompleteOptions(field.value)

  useEffect(() => {
    const generateTagsList = async () => {
      const tags = await getTagsList(chainIds, newCancelToken())
      const autocompleteOptions = generateAutocompleteOptions(tags)
      setTagsList(autocompleteOptions)
    }
    generateTagsList()
  }, [newCancelToken])

  const handleChange = (userInput: OnChangeValue<AutoCompleteOption, true>) => {
    const normalizedInput = userInput.map((input) => input.value)
    helpers.setValue(normalizedInput)
    helpers.setTouched(true)
  }

  return (
    <CreatableSelect
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }}
      className={styles.select}
      defaultValue={defaultTags}
      hideSelectedOptions
      isMulti
      noOptionsMessage={() => 'Start typing to get suggestions'}
      onChange={(value: AutoCompleteOption[]) => handleChange(value)}
      onInputChange={(value) => setInput(value)}
      openMenuOnClick={false}
      options={!input || input?.length < 3 ? [] : tagsList}
      placeholder={placeholder}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'var(--border-color)'
        }
      })}
    />
  )
}
