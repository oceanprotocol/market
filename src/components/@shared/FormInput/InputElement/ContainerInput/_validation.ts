import { MetadataAlgorithmContainer } from '@components/Publish/_types'
import * as Yup from 'yup'
import { SchemaLike } from 'yup/lib/types'

export const validationAlgorithmContianerParameters: {
  [key in keyof MetadataAlgorithmContainer]: SchemaLike
} = {
  entrypoint: Yup.string().required(),
  image: Yup.string().required(),
  tag: Yup.string().required(),
  checksum: Yup.string().required()
}
