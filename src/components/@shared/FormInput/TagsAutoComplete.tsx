import React, { ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { OnChangeValue } from 'react-select'
import { useField } from 'formik'
import { InputProps } from '.'
import { getTagsList } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { useCancelToken } from '@hooks/useCancelToken'
import styles from './TagsAutoComplete.module.css'

interface AutoCompleteOption {
  readonly value: string
  readonly label: string
}

export default function TagsAutoComplete({
  ...props
}: InputProps): ReactElement {
  const { chainIds } = useUserPreferences()
  const { name, placeholder } = props
  const [defaultTags, setDefaultTags] = useState<AutoCompleteOption[]>()
  const [tagsList, setTagsList] = useState<AutoCompleteOption[]>()
  const [field, meta, helpers] = useField(name)
  const newCancelToken = useCancelToken()

  const generateAutocompleteOptions = (
    options: string[]
  ): AutoCompleteOption[] => {
    return options?.map((tag) => ({
      value: tag,
      label: tag
    }))
  }

  useEffect(() => {
    if (defaultTags || field.value === '') return
    const tags = field.value.split(', ')
    const autocompleteOptions = generateAutocompleteOptions(tags)
    setDefaultTags(autocompleteOptions)
  }, [defaultTags, field.value])

  useEffect(() => {
    const generateTagsList = async () => {
      const tags = await getTagsList(chainIds, newCancelToken())
      const autocompleteOptions = generateAutocompleteOptions(tags)
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
      className={styles.select}
      defaultValue={defaultTags}
      isMulti
      onChange={(value: AutoCompleteOption[]) => handleChange(value)}
      options={tagsList}
      placeholder={placeholder}
    />
  )
}
