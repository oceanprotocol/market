import { FormConsumerParameter } from '@components/Publish/_types'
import { parseConsumerParameters } from '@utils/ddo'
import * as Yup from 'yup'

export const ConsumerParametersConsumeSchema = Yup.array()
  .of(
    Yup.object().shape({
      required: Yup.boolean().required('required'),
      default: Yup.mixed().when('required', {
        is: false,
        then: Yup.mixed()
          .nullable()
          .transform((value) => value || null),
        otherwise: Yup.mixed().required('Required')
      })
    })
  )
  .nullable()

export const validationSchema: Yup.SchemaOf<{
  algorithm: string
  dataServiceParams: any
  algoServiceParams: any
  algoParams: any
}> = Yup.object().shape({
  algorithm: Yup.string().required('Required'),
  dataServiceParams: ConsumerParametersConsumeSchema,
  algoServiceParams: ConsumerParametersConsumeSchema,
  algoParams: ConsumerParametersConsumeSchema
})

export function getInitialValues(
  asset?: AssetExtended,
  selectedAlgorithmAsset?: AssetExtended
): {
  algorithm: string
  dataServiceParams?: FormConsumerParameter[]
  algoServiceParams?: FormConsumerParameter[]
  algoParams?: FormConsumerParameter[]
} {
  return {
    algorithm: selectedAlgorithmAsset?.id,
    dataServiceParams: parseConsumerParameters(
      asset?.services[0].consumerParameters
    ),
    algoServiceParams: parseConsumerParameters(
      selectedAlgorithmAsset?.services[0].consumerParameters
    ),
    algoParams: parseConsumerParameters(
      selectedAlgorithmAsset?.metadata?.algorithm.consumerParameters
    )
  }
}
