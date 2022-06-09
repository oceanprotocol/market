import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Datatoken from '@shared/FormFields/Datatoken'
import { InputProps } from '@shared/FormInput'
import { withFormik } from 'formik'

export default {
  title: 'Component/@shared/FormFields/Datatoken',
  component: Datatoken
} as ComponentMeta<typeof Datatoken>

const MockedForm = withFormik({
  mapPropsToValues: () => ({
    name: 'OCEAN',
    symbol: 'OCEAN'
  }),
  validate: (values) => {
    const errors = {
      name: ''
    }

    if (!values.name) {
      errors.name = 'Required'
    }

    return errors
  },

  handleSubmit: (values, { setSubmitting }) => {
    console.log(JSON.stringify(values, null, 2))
    setSubmitting(false)
  },

  displayName: 'Datatoken'
})(Datatoken)

const Template: ComponentStory<typeof Datatoken> = (args: InputProps) => (
  <MockedForm {...args} />
)

interface Props {
  args: InputProps
}

export const Default: Props = Template.bind({})
Default.args = {
  name: 'PARCOUR-73',
  symbol: 'PARCOUR-73'
}
