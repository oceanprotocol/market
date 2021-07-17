import { PriceOptionsMarket } from '../@types/MetaData'
import * as Yup from 'yup'

export const validationSchema: Yup.SchemaOf<PriceOptionsMarket> =
  Yup.object().shape({
    price: Yup.number()
      .min(0.01, (param) => `Must be more or equal to ${param.min}`)
      .required('Required'),
    dtAmount: Yup.number()
      .min(9, (param) => `Must be more or equal to ${param.min}`)
      .required('Required'),
    oceanAmount: Yup.number()
      .min(21, (param) => `Must be more or equal to ${param.min}`)
      .required('Required'),
    type: Yup.string()
      .matches(/fixed|dynamic|free/g, { excludeEmptyString: true })
      .required('Required'),
    weightOnDataToken: Yup.string().required('Required'),
    weightOnOcean: Yup.string().required('Required'),
    swapFee: Yup.number()
      .min(0.1, (param) => `Must be more or equal to ${param.min}`)
      .max(10, (param) => `Maximum is ${param.max}%`)
      .required('Required')
      .nullable()
  })

export const initialValues: PriceOptionsMarket = {
  price: 1,
  type: 'dynamic',
  dtAmount: 9,
  oceanAmount: 21,
  weightOnOcean: '7', // 70% on OCEAN
  weightOnDataToken: '3', // 30% on datatoken
  swapFee: 0.1 // in %
}
