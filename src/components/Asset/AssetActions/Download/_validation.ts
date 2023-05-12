import * as Yup from 'yup'
import { ConsumerParametersConsumeSchema } from '../Compute/_constants'

export const validationSchema: Yup.SchemaOf<{
  dataServiceParams: any
}> = Yup.object().shape({
  dataServiceParams: ConsumerParametersConsumeSchema
})
