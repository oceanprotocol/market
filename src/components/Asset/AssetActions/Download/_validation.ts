import * as Yup from 'yup'
import { getUserCustomParameterValidationSchema } from '../ConsumerParameters/_validation'
import { ConsumerParameter } from '@oceanprotocol/lib'

export function getDownloadValidationSchema(
  parameters: ConsumerParameter[]
): Yup.SchemaOf<{
  dataServiceParams: any
}> {
  return Yup.object().shape({
    dataServiceParams: getUserCustomParameterValidationSchema(parameters)
  })
}
