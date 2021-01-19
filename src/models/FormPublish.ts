import { MetadataPublishForm } from '../@types/MetaData'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema: Yup.SchemaOf<MetadataPublishForm> = Yup.object()
  .shape({
    // ---- required fields ----
    name: Yup.string()
      .min(4, (param) => `Title must be at least ${param.min} characters`)
      .required('Required'),
    author: Yup.string().required('Required'),
    dataTokenOptions: Yup.object()
      .shape({
        name: Yup.string(),
        symbol: Yup.string()
      })
      .required('Required'),
    description: Yup.string().min(10).required('Required'),
    access: Yup.string()
      .matches(/Compute|Download/g, { excludeEmptyString: true })
      .required('Required'),
    termsAndConditions: Yup.boolean().required('Required'),

    // ---- optional fields ----
    tags: Yup.string().nullable(),
    links: Yup.array<FileMetadata[]>().nullable(),
    // ---- ewai fields ----
    ewaiEwns: Yup.string()
      .matches(/^([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.ewc$/g, {
        excludeEmptyString: true,
        message: 'Please enter a valid EWNS name'
      })
      .required('Required'),
    ewaiCategory: Yup.string()
      .matches(
        /Bioenergy|EV|Geothermal|Hydropower|Hydrogen|Ocean\/Marine|Solar|Wind|Other/g,
        {
          excludeEmptyString: true,
          message: 'Please select an energy category'
        }
      )
      .required('Required'),
    ewaiVendor: Yup.string().nullable(),
    ewaiPublishRole: Yup.string()
      .matches(/^([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.ewc$/g, {
        excludeEmptyString: true,
        message: 'Please enter a valid EWNS role name'
      })
      .required('Required'),
    ewaiIncomingMsgFormat: Yup.string()
      .matches(/Json|Text/g, {
        excludeEmptyString: true,
        message:
          'Please specify the incoming message format type for this dataset'
      })
      .required('Required'),
    ewaiSchemaValidationOn: Yup.string()
      .matches(/Yes|No/g, {
        excludeEmptyString: true,
        message:
          'Please specify whether schema validation is enabled for this dataset'
      })
      .required('Required'),
    ewaiPathToPtdTimestamp: Yup.string().nullable(),
    ewaiMsgSchema: Yup.string().nullable(),
    // had to comment this out, as it was being called on every keypress
    // which won't work as the user is typing in partial Json Schema
    /* .test(
        'validateJsonSchema',
        'You must enter a valid JSON Schema if you put any data in this field!',
        function (value) {
          if (!ewaiutil.hasJsonStructure(value)) {
            return false
          }
          const check = ewaiutil.safeJsonParse(value)
          return check.error === null
        }
      )
      .nullable(), */
    ewaiOutputFormat: Yup.string()
      .matches(/Json|Csv|Xml/g, {
        excludeEmptyString: true,
        message: 'Please select the output data format for this dataset'
      })
      .required('Required')
  })
  .defined()

export const initialValues: Partial<MetadataPublishForm> = {
  name: '',
  author: '',
  dataTokenOptions: {
    name: '',
    symbol: ''
  },
  files: '',
  description: '',
  access: '--SELECT ONE--',
  termsAndConditions: false,
  // -- ewai fields --
  ewaiEwns: '',
  ewaiCategory: '--SELECT ONE--',
  ewaiVendor: '',
  ewaiPublishRole: '',
  ewaiIncomingMsgFormat: '--SELECT ONE--',
  ewaiSchemaValidationOn: '--SELECT ONE--',
  ewaiMsgSchema: '',
  ewaiPathToPtdTimestamp: '',
  ewaiOutputFormat: '--SELECT ONE--'
}
