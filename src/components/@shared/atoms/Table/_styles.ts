import { createTheme } from 'react-data-table-component'

createTheme('ocean', {
  text: {
    primary: 'var(--font-color-text)',
    secondary: 'var(--color-secondary)'
  },
  background: {
    default: 'transparent'
  },
  divider: {
    default: 'var(--border-color)'
  },
  action: {
    button: 'var(--font-color-text)',
    hover: 'var(--color-primary)',
    disabled: 'var(--color-secondary)'
  }
})

export const customStyles = {
  table: {
    style: {
      scrollbarWidth: 'thin'
    }
  },
  head: {
    style: {
      fontSize: 'var(--font-size-small)',
      fontWeight: 'var(--font-weight-base)'
    }
  },
  headCells: {
    style: {
      textTransform: 'uppercase',
      color: 'var(--color-secondary)',
      fontSize: 'var(--font-size-small)'
    }
  },
  cells: {
    style: {
      minWidth: '0 !important'
    }
  },
  rows: {
    style: {
      fontSize: 'var(--font-size-small)',
      fontWeight: 'var(--font-weight-base)'
    }
  }
}
