export const columns = [
  {
    name: 'Name',
    selector: (row: any) => row.name,
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Symbol',
    selector: (row: any) => row.symbol,
    maxWidth: '10rem'
  },
  {
    name: 'Price',
    selector: (row: any) => row.price,
    right: true
  }
]

export const data = [
  {
    name: 'Title asset',
    symbol: 'DATA-70',
    price: '1.011'
  },
  {
    name: 'Title asset Title asset Title asset Title asset Title asset',
    symbol: 'DATA-71',
    price: '1.011'
  },
  {
    name: 'Title asset',
    symbol: 'DATA-72',
    price: '1.011'
  },
  {
    name: 'Title asset Title asset Title asset Title asset Title asset Title asset Title asset Title asset Title asset Title asset',
    symbol: 'DATA-71',
    price: '1.011'
  }
]
