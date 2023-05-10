import * as Yup from 'yup'
import { ConsumerParametersConsumeSchema } from '../Compute/_constants'

export const validationSchema: Yup.SchemaOf<{
  dataService: any
}> = Yup.object().shape({
  dataService: ConsumerParametersConsumeSchema
})
