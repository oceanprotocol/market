import * as React from 'react'
import { FormikProps, connect } from 'formik'
import debounce from 'lodash.debounce'
import omit from 'lodash.omit'
import isEqual from 'react-fast-compare'
import { LoggerInstance } from '@oceanprotocol/lib'

export interface PersistProps {
  name: string
  ignoreFields?: string[]
  debounce?: number
  isSessionStorage?: boolean
}

// TODO: refactor into functional component
class PersistImpl extends React.Component<
  PersistProps & { formik: FormikProps<any> },
  any
> {
  static defaultProps = {
    debounce: 300
  }

  saveForm = debounce((data: FormikProps<any>) => {
    const dataToSave = this.omitIgnoredFields(data)
    LoggerInstance.log('data to save', dataToSave)
    if (this.props.isSessionStorage) {
      window.sessionStorage.setItem(this.props.name, JSON.stringify(dataToSave))
    } else {
      window.localStorage.setItem(this.props.name, JSON.stringify(dataToSave))
    }
  }, this.props.debounce)

  omitIgnoredFields = (data: FormikProps<any>) => {
    const { ignoreFields } = this.props
    LoggerInstance.log('omitted fields', ignoreFields)
    const { values, touched, errors } = data

    LoggerInstance.log('values', values, omit(values, ignoreFields))
    return ignoreFields
      ? omit(
          {
            ...data,
            values: omit(values, ignoreFields),
            touched: omit(touched, ignoreFields),
            errors: omit(errors, ignoreFields)
          },
          ignoreFields
        )
      : data
  }

  componentDidUpdate(prevProps: PersistProps & { formik: FormikProps<any> }) {
    if (!isEqual(prevProps.formik, this.props.formik)) {
      this.saveForm(this.props.formik)
    }
  }

  componentDidMount() {
    const maybeState = this.props.isSessionStorage
      ? window.sessionStorage.getItem(this.props.name)
      : window.localStorage.getItem(this.props.name)
    if (maybeState && maybeState !== null) {
      this.props.formik.setFormikState(JSON.parse(maybeState))
    }
  }

  render(): null {
    return null
  }
}

export const Persist = connect<PersistProps, any>(PersistImpl)
