import * as Yup from 'yup'

export interface AdvanceSettingsForm {
  allowCredentail: string[]
}

export const validationSchema: Yup.SchemaOf<AdvanceSettingsForm> = Yup.object().shape(
  {
    allowCredentail: Yup.array().nullable()
  }
)

export function getInitialValues(
  allowCredentail: string[]
): AdvanceSettingsForm {
  return { allowCredentail }
}
