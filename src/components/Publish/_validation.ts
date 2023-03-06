import { MAX_DECIMALS } from '@utils/constants'
import * as Yup from 'yup'
import { getMaxDecimalsValidation } from '@utils/numbers'
import { FileInfo } from '@oceanprotocol/lib'
import { testLinks } from '../../@utils/yup'

// TODO: conditional validation
// e.g. when algo is selected, Docker image is required
// hint, hint: https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema

const validationMetadata = {
  type: Yup.string()
    .matches(/dataset|algorithm/g, { excludeEmptyString: true })
    .required('Required'),
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string()
    .min(10, (param) => `Description must be at least ${param.min} characters`)
    .max(
      5000,
      (param) => `Description must have maximum ${param.max} characters`
    )
    .required('Required'),
  author: Yup.string().required('Required'),
  tags: Yup.array<string[]>().nullable(),
  termsAndConditions: Yup.boolean()
    .required('Required')
    .isTrue('Please agree to the Terms and Conditions.')
}

const validationService = {
  files: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: testLinks(),
        valid: Yup.boolean().isTrue().required('File must be valid.')
      })
    )
    .min(1, `At least one file is required.`)
    .required('Enter a valid URL and click ADD FILE.'),
  links: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: testLinks(),
        valid: Yup.boolean()
        // valid: Yup.boolean().isTrue('File must be valid.')
      })
    )
    .nullable(),
  dataTokenOptions: Yup.object().shape({
    name: Yup.string(),
    symbol: Yup.string()
  }),
  timeout: Yup.string().required('Required'),
  access: Yup.string()
    .matches(/compute|access/g)
    .required('Required'),
  providerUrl: Yup.object().shape({
    url: Yup.string().url('Must be a valid URL.').required('Required'),
    valid: Yup.boolean().isTrue().required('Valid Provider is required.'),
    custom: Yup.boolean()
  })
}

const validationPricing = {
  type: Yup.string()
    .matches(/fixed|free/g, { excludeEmptyString: true })
    .required('Required'),
  // https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema

  price: Yup.number()
    .min(1, (param: { min: number }) => `Must be more or equal to ${param.min}`)
    .max(
      1000000,
      (param: { max: number }) => `Must be less than or equal to ${param.max}`
    )
    .test(
      'maxDigitsAfterDecimal',
      `Must have maximum ${MAX_DECIMALS} decimal digits`,
      (param) => getMaxDecimalsValidation(MAX_DECIMALS).test(param?.toString())
    )
    .required('Required')
}

// TODO: make Yup.SchemaOf<FormPublishData> work, requires conditional validation
// of all the custom docker image stuff.
// export const validationSchema: Yup.SchemaOf<FormPublishData> =
export const validationSchema: Yup.SchemaOf<any> = Yup.object().shape({
  user: Yup.object().shape({
    stepCurrent: Yup.number(),
    chainId: Yup.number().required('Required'),
    accountId: Yup.string().required('Required')
  }),
  metadata: Yup.object().shape(validationMetadata),
  services: Yup.array().of(Yup.object().shape(validationService)),
  pricing: Yup.object().shape(validationPricing)
})
