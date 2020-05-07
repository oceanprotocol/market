import React from 'react'
import styles from './Checkbox.module.css'

interface CheckboxProps {
  name: string
  checked: boolean
  onChange?: (evt: React.ChangeEvent) => void
  label: string
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  onChange,
  label
}) => {
  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
      />
      {label}
    </label>
  )
}

export default Checkbox
