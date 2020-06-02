import cx from 'classnames'
import React, { PureComponent, FormEvent, ChangeEvent } from 'react'
import slugify from '@sindresorhus/slugify'
import DatePicker from 'react-datepicker'
import Help from './Help'
import Label from './Label'
import Row from './Row'
import InputGroup from './InputGroup'
import styles from './Input.module.css'

interface InputProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  help?: string
  tag?: string
  type?: string
  options?: string[]
  additionalComponent?: any
  value?: string
  onChange?(
    event:
      | FormEvent<HTMLInputElement>
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ): void
  rows?: number
  group?: any
  multiple?: boolean
  pattern?: string
}

interface InputState {
  isFocused: boolean
  dateCreated?: Date
}

export default class Input extends PureComponent<InputProps, InputState> {
  public state: InputState = {
    isFocused: false,
    dateCreated: new Date()
  }

  public inputWrapClasses() {
    if (this.props.type === 'search') {
      return styles.inputWrapSearch
    } else if (this.props.type === 'search' && this.state.isFocused) {
      return cx(styles.inputWrapSearch, styles.isFocused)
    } else if (this.state.isFocused && this.props.type !== 'search') {
      return cx(styles.inputWrap, styles.isFocused)
    } else {
      return styles.inputWrap
    }
  }

  public handleFocus = () => {
    this.setState({ isFocused: !this.state.isFocused })
  }

  private handleDateChange = (date: Date) => {
    this.setState({ dateCreated: date })

    const event = {
      currentTarget: {
        name: 'dateCreated',
        value: date
      }
    }
    this.props.onChange!(event as any) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  public InputComponent = () => {
    const { type, options, group, name, required, onChange, value } = this.props

    const wrapClass = this.inputWrapClasses()

    switch (type) {
      case 'select':
        return (
          <div className={wrapClass}>
            <select
              id={name}
              className={styles.select}
              name={name}
              required={required}
              onFocus={this.handleFocus}
              onBlur={this.handleFocus}
              onChange={onChange}
              value={value}
            >
              <option value="">---</option>
              {options &&
                options
                  .sort((a, b) => a.localeCompare(b))
                  .map((option: string, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
            </select>
          </div>
        )
      case 'textarea':
        return (
          <div className={wrapClass}>
            <textarea
              id={name}
              className={styles.input}
              onFocus={this.handleFocus}
              onBlur={this.handleFocus}
              {...this.props}
            />
          </div>
        )
      case 'radio':
      case 'checkbox':
        return (
          <div className={styles.radioGroup}>
            {options &&
              options.map((option: string, index: number) => (
                <div className={styles.radioWrap} key={index}>
                  <input
                    className={styles.radio}
                    id={slugify(option)}
                    type={type}
                    name={name}
                    value={slugify(option)}
                  />
                  <label
                    className={styles.radioLabel}
                    htmlFor={slugify(option)}
                  >
                    {option}
                  </label>
                </div>
              ))}
          </div>
        )
      case 'date':
        return (
          <div className={wrapClass}>
            <DatePicker
              selected={this.state.dateCreated}
              onChange={this.handleDateChange}
              className={styles.input}
              onFocus={this.handleFocus}
              onBlur={this.handleFocus}
              id={name}
              name={name}
            />
          </div>
        )
      default:
        return (
          <div className={wrapClass}>
            {group ? (
              <InputGroup>
                <input
                  id={name}
                  type={type || 'text'}
                  className={styles.input}
                  onFocus={this.handleFocus}
                  onBlur={this.handleFocus}
                  {...this.props}
                />
                {group}
              </InputGroup>
            ) : (
              <input
                id={name}
                type={type || 'text'}
                className={styles.input}
                onFocus={this.handleFocus}
                onBlur={this.handleFocus}
                {...this.props}
              />
            )}

            {/* {type === 'search' && <SearchIcon />} */}
          </div>
        )
    }
  }

  public render() {
    const {
      name,
      label,
      required,
      help,
      additionalComponent,
      multiple
    } = this.props

    return (
      <Row>
        <Label htmlFor={name} required={required}>
          {label}
        </Label>

        <this.InputComponent />

        {help && <Help>{help}</Help>}

        {multiple && 'hello'}

        {additionalComponent && additionalComponent}
      </Row>
    )
  }
}
