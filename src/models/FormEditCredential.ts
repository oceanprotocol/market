import { Credential, DDO } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export interface AdvancedSettingsForm {
  allow: Credential[]
  deny: Credential[]
  isOrderDisabled: boolean
}

export const validationSchema: Yup.SchemaOf<AdvancedSettingsForm> = Yup.object()
  .shape({
    allow: Yup.array().nullable(),
    deny: Yup.array().nullable(),
    isOrderDisabled: Yup.boolean().nullable()
  })
  .defined()

export function getInitialValues(ddo: DDO): AdvancedSettingsForm {
  const metadata = ddo.findServiceByType('metadata')
  return {
    allow: ddo?.credentials?.allow,
    deny: ddo?.credentials?.deny,
    isOrderDisabled: metadata.attributes?.status?.isOrderDisabled || false
  }
}
