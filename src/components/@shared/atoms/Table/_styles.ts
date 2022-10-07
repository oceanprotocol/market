import { createTheme, TableStyles, Theme } from 'react-data-table-component'

// https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/themes.ts
const theme: Partial<Theme> = {
  text: {
    primary: 'var(--font-color-text)',
    secondary: 'var(--color-secondary)',
    disabled: 'var(--color-secondary)'
  },
  background: {
    default: 'transparent'
  },
  divider: {
    default: 'var(--border-color)'
  },
  button: {
    default: 'var(--font-color-text)',
    focus: 'var(--color-primary)',
    hover: 'var(--color-primary)',
    disabled: 'var(--color-secondary)'
  }
}

createTheme('ocean', theme)

// https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.ts
export const customStyles: TableStyles = {
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
