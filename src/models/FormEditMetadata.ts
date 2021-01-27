import { MetadataMarket, MetadataPublishForm } from '../@types/MetaData'
import * as Yup from 'yup'
import { IEwaiLookupAssetResult } from '../ewai/client/ewai-js'
import * as EwaiUtils from '../ewai/ewaiutils'

const highlight = require('cli-highlight').highlight

export const validationSchema: Yup.SchemaOf<MetadataPublishForm> = Yup.object()
  .shape({
    name: Yup.string()
      .min(4, (param) => `Title must be at least ${param.min} characters`)
      .required('Required'),
    description: Yup.string().required('Required').min(10),
    // ---- ewai fields ----
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
    ewaiMsgSchema: Yup.string().nullable()
    // we can't do this here as it gets called on every keypress (so won't validate ever really until submitted)
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
  })
  .defined() // ewai added this line

export function getInitialValues(
  metadata: MetadataMarket,
  ewaiAsset: IEwaiLookupAssetResult
): Partial<MetadataPublishForm> {
  return {
    name: metadata.main.name,
    description: metadata.additionalInformation.description,
    // -- ewai fields --
    ewaiCategory: ewaiAsset?.metadata?.category
      ? ewaiAsset.metadata.category
      : '--SELECT ONE',
    ewaiVendor: ewaiAsset?.metadata?.vendor ? ewaiAsset.metadata.vendor : '',
    ewaiPublishRole: ewaiAsset?.dataPublishRole,
    ewaiIncomingMsgFormat: ewaiAsset?.incomingMsgFormat
      ? EwaiUtils.capitalize(ewaiAsset?.incomingMsgFormat)
      : 'Json',
    ewaiSchemaValidationOn: ewaiAsset?.schemaValidationOn ? 'Yes' : 'No',
    ewaiMsgSchema: ewaiAsset?.msgSchema
      ? highlight(JSON.stringify(ewaiAsset.msgSchema, null, 4), {
          language: 'json',
          ignoreIllegals: true
        })
      : '',
    ewaiPathToPtdTimestamp: ewaiAsset?.pathToMsgTimestamp
      ? ewaiAsset.pathToMsgTimestamp
      : '',
    ewaiOutputFormat: ewaiAsset?.defaultOutputFormat
      ? EwaiUtils.capitalize(ewaiAsset.defaultOutputFormat)
      : '--SELECT ONE--'
  }
}
