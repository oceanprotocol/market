interface ConsumerParameter {
  name: string
  type: 'text' | 'number' | 'boolean' | 'select'
  label: string
  required: boolean
  description: string
  default: string
  options?: string
}
