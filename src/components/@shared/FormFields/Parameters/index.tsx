import React, { ReactElement, useState } from 'react'
import { ErrorMessage, useField } from 'formik'
import InputElement from '@shared/FormInput/InputElement'
import styles from './index.module.css'
import { initialValues } from 'src/components/Publish/_constants'

// https://www.cluemediator.com/add-or-remove-input-fields-dynamically-with-reactjs
// TODO: fix Warning: Each child in a list should have a unique "key" prop.
export default function Parameters(props: InputProps): ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [field, meta, helpers] = useField(props.name)
  const [paramaterList, setParameterList] = useState([])

  const [dirtyName, setDirtyName] = useState([])
  const [dirtyType, setDirtyType] = useState([])
  const [dirtyOption, setDirtyOption] = useState([])

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>, index) => {
    const { name, value } = e.target
    const list = [...paramaterList]

    list[index]['type'] = value

    if (dirtyType.indexOf(index) == -1) {
      setDirtyType([...dirtyType, index])
    }

    if (value !== 'options') {
      delete list[index].options
      setDirtyOption([])
    } else {
      list[index].options = [{ '': '' }]
    }

    setParameterList(list)
    helpers.setValue(list)
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>, index) => {
    const { name, value } = e.target
    const list = [...paramaterList]

    list[index][name] = value

    setParameterList(list)
    helpers.setValue(list)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index) => {
    const { name, value } = e.target
    const list = [...paramaterList]

    list[index][name] = value

    setParameterList(list)
    helpers.setValue(list)
  }

  const handleCheckboxChange = (e, index) => {
    const { name, checked } = e.target
    const list = [...paramaterList]

    list[index][name] = checked
    setParameterList(list)
    helpers.setValue(list)
  }

  const handleOptionNameChange = (e, paramIndex, optionIndex) => {
    const { name, value } = e.target
    const list = [...paramaterList]

    list[paramIndex].options[optionIndex][value] = Object.values(
      list[paramIndex].options[optionIndex]
    )[0]
    delete list[paramIndex].options[optionIndex][
      Object.keys(list[paramIndex].options[optionIndex])[0]
    ]

    setParameterList(list)
    helpers.setValue(list)

    if (dirtyOption.indexOf(optionIndex) == -1) {
      setDirtyOption([...dirtyOption, optionIndex])
    }
  }

  const handleOptionValueChange = (e, paramIndex, optionIndex) => {
    const { name, value } = e.target
    const list = [...paramaterList]

    Object.keys(list[paramIndex].options[optionIndex]).map(function (
      key,
      index
    ) {
      list[paramIndex].options[optionIndex][key] = value
    })

    setParameterList(list)
    helpers.setValue(list)
  }

  const handleAddOptionClick = (e, paramIndex, optionIndex) => {
    e.preventDefault()
    const list = [...paramaterList]

    if (dirtyOption.indexOf(optionIndex) == -1) {
      setDirtyOption([...dirtyOption, optionIndex])
    }

    // check if any keys are blank
    let oneKeyBlank = false
    for (let i = 0; i < list[paramIndex].options.length; i++) {
      if (Object.keys(list[paramIndex].options[i])[0] == '') {
        oneKeyBlank = true
        break
      }
    }

    if (!oneKeyBlank) {
      list[paramIndex].options = [...list[paramIndex].options, { '': '' }]

      setParameterList(list)
      helpers.setValue(list)
    }
  }

  const handleRemoveOptionClick = (e, paramIndex, optionIndex) => {
    e.preventDefault()
    const list = [...paramaterList]
    let dirtyO = dirtyOption

    list[paramIndex].options.splice(optionIndex, 1)
    setParameterList(list)
    helpers.setValue(list)

    dirtyO = dirtyO.map(function (n) {
      if (n < optionIndex) return n
      if (n == optionIndex) return
      if (n > optionIndex) return n - 1
    })
    setDirtyOption(dirtyO)
  }

  const handleAddParameterClick = (e, index) => {
    e.preventDefault()
    const defaultParams = {
      type: '',
      name: '',
      label: '',
      description: '',
      required: false,
      default: '',
      options: [{ '': '' }]
    }
    let oneKeyBlank = false

    if (index == -1) {
      setParameterList([...paramaterList, defaultParams])
      return
    }

    if (dirtyName.indexOf(index) == -1) {
      setDirtyName([...dirtyName, index])
    }
    if (dirtyType.indexOf(index) == -1) {
      setDirtyType([...dirtyType, index])
    }

    // validate this set of parameters
    if (paramaterList[index]['type'] == 'options') {
      for (let i = 0; i < paramaterList[index].options.length; i++) {
        if (Object.keys(paramaterList[index].options[i])[0] == '') {
          oneKeyBlank = true
          if (dirtyOption.indexOf(i) == -1) {
            setDirtyOption([...dirtyOption, i])
          }
        }
      }
    }
    if (
      paramaterList[index]['name'] !== '' &&
      paramaterList[index]['type'] !== '' &&
      !oneKeyBlank
    ) {
      setParameterList([...paramaterList, defaultParams])
    }
  }

  const handleRemoveParameterClick = (e, index) => {
    e.preventDefault()
    const list = [...paramaterList]
    let dirtyN = dirtyName
    let dirtyT = dirtyType

    list.splice(index, 1)
    setParameterList(list)
    helpers.setValue(list)

    dirtyN = dirtyN.map(function (n) {
      if (n < index) return n
      if (n == index) return
      if (n > index) return n - 1
    })
    setDirtyName(dirtyN)

    dirtyT = dirtyT.map(function (n) {
      if (n < index) return n
      if (n == index) return
      if (n > index) return n - 1
    })
    setDirtyType(dirtyT)
  }

  return (
    <div className={styles.parameters}>
      {paramaterList.map((x, i) => {
        return (
          <div className={styles.parameter}>
            <div
              className={`${styles.field} ${
                dirtyType.indexOf(i) > -1 && x.type == '' ? styles.hasError : ''
              }`}
            >
              <label htmlFor={'param_type' + i} className={styles.label}>
                Type *:
              </label>
              <InputElement
                type="select"
                name="type"
                value={x.type}
                field={{ value: '' }}
                options={['text', 'options']}
                id={'param_type' + i}
                onChange={(e) => handleTypeChange(e, i)}
                className={styles.select}
              />
            </div>

            <div
              className={`${styles.field} ${
                dirtyName.indexOf(i) > -1 && x.name == '' ? styles.hasError : ''
              }`}
            >
              <label htmlFor={'param_name' + i} className={styles.label}>
                Name *:
              </label>
              <InputElement
                type="text"
                name="name"
                value={x.name}
                id={'param_name' + i}
                placeholder="e.g. fname"
                onChange={(e) => handleNameChange(e, i)}
                onBlur={(e) => {
                  !dirtyName.indexOf(i) && setDirtyName([...dirtyName, i])
                }}
                className={styles.input}
              />
            </div>

            {paramaterList[i]['type'] === 'options' && (
              <div className={styles.field}>
                <label className={styles.label}>Options *:</label>
                <div className={styles.options}>
                  {paramaterList[i]['options'].map((y, j) => {
                    return (
                      <div
                        className={`${
                          dirtyOption.indexOf(j) > -1 && Object.keys(y)[0] == ''
                            ? styles.hasError
                            : ''
                        }`}
                      >
                        <InputElement
                          type="text"
                          name="name"
                          value={Object.keys(y)[0]}
                          placeholder="key"
                          onChange={(e) => handleOptionNameChange(e, i, j)}
                          onBlur={(e) => {
                            !dirtyOption.indexOf(j) &&
                              setDirtyOption([...dirtyOption, j])
                          }}
                          className={styles.option}
                        />
                        <InputElement
                          type="text"
                          name="value"
                          value={Object.values(y)[0]}
                          placeholder="value"
                          onChange={(e) => handleOptionValueChange(e, i, j)}
                          className={styles.option}
                        />
                        {paramaterList[i]['options'].length !== 1 && (
                          <button
                            onClick={(e) => handleRemoveOptionClick(e, i, j)}
                            className={styles.button}
                          >
                            Remove
                          </button>
                        )}
                        {paramaterList[i]['options'].length - 1 === j && (
                          <button
                            onClick={(e) => handleAddOptionClick(e, i, j)}
                            className={styles.button}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className={styles.field}>
              <label htmlFor={'param_label' + i} className={styles.label}>
                Label:
              </label>
              <InputElement
                type="text"
                name="label"
                value={x.label}
                id={'param_label' + i}
                placeholder="e.g. First Name"
                onChange={(e) => handleInputChange(e, i)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={'param_description' + i} className={styles.label}>
                Description:
              </label>
              <InputElement
                type="text"
                name="description"
                value={x.description}
                id={'param_description' + i}
                placeholder="e.g. Enter your first name"
                onChange={(e) => handleInputChange(e, i)}
                className={styles.input}
              />
            </div>
            <div className={styles.requiredfield}>
              <InputElement
                type="checkbox"
                name="required"
                checked={x.required}
                options={['Required?']}
                onChange={(e) => handleCheckboxChange(e, i)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={'param_default' + i} className={styles.label}>
                Default:
              </label>
              <InputElement
                type="text"
                name="default"
                value={x.default}
                id={'param_default' + i}
                placeholder="e.g. John"
                onChange={(e) => handleInputChange(e, i)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <button
                onClick={(e) => handleRemoveParameterClick(e, i)}
                className={styles.button}
              >
                Remove
              </button>
              {paramaterList.length - 1 === i && (
                <button
                  onClick={(e) => handleAddParameterClick(e, i)}
                  className={styles.button}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        )
      })}
      {paramaterList.length === 0 && (
        <button
          onClick={(e) => handleAddParameterClick(e, -1)}
          className={styles.button}
        >
          Add
        </button>
      )}
    </div>
  )
}
