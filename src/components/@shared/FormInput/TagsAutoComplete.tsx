import React, { ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { OnChangeValue } from 'react-select'
import { useField } from 'formik'
import { InputProps } from '.'
import { getTagsList } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { useCancelToken } from '@hooks/useCancelToken'

interface AutoCompleteOption {
  readonly value: string
  readonly label: string
}

export default function TagsAutoComplete({
  ...props
}: InputProps): ReactElement {
  const { chainIds } = useUserPreferences()
  const [tagsList, setTagsList] = useState<AutoCompleteOption[]>()
  const [field, meta, helpers] = useField(props.name)

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
    />
  )
}
