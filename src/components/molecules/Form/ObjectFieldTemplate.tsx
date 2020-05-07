import React from 'react'
import { ObjectFieldTemplateProps } from 'react-jsonschema-form'

// Template to render form
// https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#object-field-template
const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => (
  <>
    <h3>{props.title}</h3>
    {props.properties.map(
      (element: { content: React.ReactElement }) => element.content
    )}
  </>
)

export { ObjectFieldTemplate }
