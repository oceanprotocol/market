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
  }, [chainIds, newCancelToken])

  const handleChange = (userInput: OnChangeValue<AutoCompleteOption, true>) => {
    const normalizedInput = userInput.map((input) => input.value)
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
