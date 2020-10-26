import { PriceOptionsMarket } from '../@types/MetaData'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<PriceOptionsMarket>({
  price: Yup.number().min(1, 'Must be greater than 0').required('Required'),
  dtAmount: Yup.number().min(1, 'Must be greater than 0').required('Required'),
  oceanAmount: Yup.number()
    .min(1, 'Must be greater than 0')
    .required('Required'),
  type: Yup.string()
    .matches(/fixed|dynamic/g)
    .required('Required'),
  weightOnDataToken: Yup.string().required('Required'),
  weightOnOcean: Yup.string().required('Required'),
  swapFee: Yup.number()
    .min(0.1, 'Must be more or equal to 0.1')
    .max(10, 'Maximum is 10%')
    .required('Required')
    .nullable()
})

export const initialValues: PriceOptionsMarket = {
  price: 1,
  type: 'dynamic',
  dtAmount: 9,
  oceanAmount: 1,
  weightOnOcean: '1', // 10% on OCEAN
  weightOnDataToken: '9', // 90% on datatoken
  swapFee: 0.1 // in %
}
