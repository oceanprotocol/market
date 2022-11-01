/* eslint-disable prettier/prettier */
import Conversion, { UnformattedConvertedPrice } from '@shared/Price/Conversion'
import { useField, useFormikContext } from 'formik'
import React, { createContext, ReactElement, useEffect, useState } from 'react'
import Input from '@shared/FormInput'
import styles from './Price.module.css'
import { FormPublishData } from '../_types'
import DataTable from 'react-data-table-component'
import { customStyles } from '@shared/atoms/Table/_styles'
import differenceBy from 'lodash/differenceBy'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'
import Delete from '@material-ui/icons/Delete'
import Add from '@material-ui/icons/Add'

import MaterialTable from '@material-table/core'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertProps } from '@mui/material/Alert'

import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowModel,
  GridValueGetterParams,
  GridValueSetterParams,
  GridCellValue,
  GridRenderCellParams,
  GridActionsCellItem,
  MuiEvent,
  GridRowModes,
  GridRowParams,
  GridEventListener,
  GridCellModesModel,
  GridRowModesModel,
  GridToolbarContainer,
  GridRowId,
  GridColumns,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { randomId, useDemoData } from '@mui/x-data-grid-generator'

const streamData = [
  {
    id: 1,
    unit: 0.5,
    time: 'seconds',
    price: 0.1,
    conversion: 0.2
  }
]

const sampleDeserts = [
  {
    id: 1,
    name: 'Frozen yogurt',
    type: 'Ice cream',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: 14,
    iron: 1,
    conversion: 1
  },
  {
    id: 2,
    name: 'Ice cream sandwhich',
    type: 'Ice cream',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: 8,
    iron: 1,
    conversion: 0
  },
  {
    id: 3,
    name: 'Eclair',
    type: 'Pastry',
    calories: 262,
    fat: 16.0,
    carbs: 37,
    protein: 6.0,
    sodium: 337,
    calcium: 6,
    iron: 7,
    conversion: 0
  }
  // {
  //   id: 4,
  //   name: 'Cupcake',
  //   type: 'Pastry',
  //   calories: 305,
  //   fat: 3.7,
  //   carbs: 67,
  //   protein: 4.3,
  //   sodium: 413,
  //   calcium: 3,
  //   iron: 8,
  //   conversion: ''
  // },
  // {
  //   id: 5,
  //   name: 'Gingerbread',
  //   type: 'Pastry',
  //   calories: 356,
  //   fat: 16.0,
  //   carbs: 49,
  //   protein: 3.9,
  //   sodium: 327,
  //   calcium: 7,
  //   iron: 16,
  //   conversion: ''
  // },
  // {
  //   id: 6,
  //   name: 'Jelly bean',
  //   type: 'Other',
  //   calories: 375,
  //   fat: 0.0,
  //   carbs: 94,
  //   protein: 0.0,
  //   sodium: 50,
  //   calcium: 0,
  //   iron: 0,
  //   conversion: ''
  // },
  // {
  //   id: 7,
  //   name: 'Lollipop',
  //   type: 'Other',
  //   calories: 392,
  //   fat: 0.2,
  //   carbs: 98,
  //   protein: 0.0,
  //   sodium: 38,
  //   calcium: 0,
  //   iron: 2,
  //   conversion: ''
  // },
  // {
  //   id: 8,
  //   name: 'Honeycomb',
  //   type: 'Other',
  //   calories: 408,
  //   fat: 3.2,
  //   carbs: 87,
  //   protein: 6.5,
  //   sodium: 562,
  //   calcium: 0,
  //   iron: 45,
  //   conversion: ''
  // },
  // {
  //   id: 9,
  //   name: 'Donut',
  //   type: 'Pastry',
  //   calories: 52,
  //   fat: 25.0,
  //   carbs: 51,
  //   protein: 4.9,
  //   sodium: 326,
  //   calcium: 2,
  //   iron: 22,
  // },
  // {
  //   id: 10,
  //   name: 'KitKat',
  //   type: 'Other',
  //   calories: 16,
  //   fat: 6.0,
  //   carbs: 65,
  //   protein: 7.0,
  //   sodium: 54,
  //   calcium: 12,
  //   iron: 6,
  // },
]

const sampleDesertColumns = [
  {
    name: 'Name',
    selector: (row: { name: any }) => row.name,
    sortable: true,
    grow: 2
  },
  {
    name: 'Type',
    selector: (row: { fat: any }) => row.fat,
    sortable: true
  },
  // {
  //   name: 'Calories (g)',
  //   selector: row => row.calories,
  //   sortable: true,
  //   right: true,
  //   conditionalCellStyles: [
  //     {
  //       when: row => row.calories < 300,
  //       style: {
  //         backgroundColor: 'rgba(63, 195, 128, 0.9)',
  //         color: 'white',
  //         '&:hover': {
  //           cursor: 'pointer',
  //         },
  //       },
  //     },
  //     {
  //       when: row => row.calories >= 300 && row.calories < 400,
  //       style: {
  //         backgroundColor: 'rgba(248, 148, 6, 0.9)',
  //         color: 'white',
  //         '&:hover': {
  //           cursor: 'pointer',
  //         },
  //       },
  //     },
  //     {
  //       when: row => row.calories >= 400,
  //       style: {
  //         backgroundColor: 'rgba(242, 38, 19, 0.9)',
  //         color: 'white',
  //         '&:hover': {
  //           cursor: 'not-allowed',
  //         },
  //       },
  //     },
  //   ],
  // },
  {
    name: 'Fat (g)',
    selector: (row: { fat: any }) => row.fat,
    sortable: true,
    right: true,
    conditionalCellStyles: [
      {
        when: (row: { fat: number }) => row.fat <= 5,
        style: {
          backgroundColor: 'rgba(63, 195, 128, 0.9)',
          color: 'white',
          '&:hover': {
            cursor: 'pointer'
          }
        }
      },
      {
        when: (row: { fat: number }) => row.fat > 5 && row.fat < 10,
        style: {
          backgroundColor: 'rgba(248, 148, 6, 0.9)',
          color: 'white',
          '&:hover': {
            cursor: 'pointer'
          }
        }
      },
      {
        when: (row: { fat: number }) => row.fat > 10,
        style: {
          backgroundColor: 'rgba(242, 38, 19, 0.9)',
          color: 'white',
          '&:hover': {
            cursor: 'not-allowed'
          }
        }
      }
    ]
  },
  {
    name: 'Conversion',
    selector: (row: { calcium: number; iron: number }) =>
      row.calcium * row.iron,
    cell: (row: { calcium: number; iron: number }) => (
      <div className={styles.form}>
        <Input
          type="text"
          // min="1"
          readOnly
          placeholder="0"
          value={row.calcium * row.iron}
          // value={row.calcium}
          // onChange={(event) => {
          //   row.calium = event.currentTarget.value;
          //   console.log(event.currentTarget.value, row);
          //   event.preventDefault()
          //   // setPrice(event.currentTarget.value);

          // }}
          // {...secondsPrice}
        />
      </div>
    ),
    sortable: false,
    style: {
      backgroundColor: '#F40691',
      color: 'white',
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  // {
  //   name: 'Conversion',
  //   selector: row => row.conversion,
  //   cell: row => (
  //     <div style={styles.form}>
  //       <Input
  //         // name=''
  //         readOnly={true}
  //         type='text'
  //         value={Number(row.conversion) * 5}

  //       />
  //     </div>
  //   ),
  // }

  {
    name: 'Calcium (%)',
    // selector: row => row,
    selector: (row: any) => row,
    cell: (row: { calium: string }) => (
      <div className={styles.form}>
        <Input
          type="number"
          min="1"
          placeholder="0"
          // value={row.calcium}
          onChange={(event) => {
            row.calium = event.currentTarget.value
            console.log(event.currentTarget.value, row)
            event.preventDefault()
            // setPrice(event.currentTarget.value);
          }}
          // {...secondsPrice}
        />
      </div>
    ),

    sortable: true,
    right: true,
    style: {
      backgroundColor: '#F40691',
      color: 'white',
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  {
    name: 'Iron (%)',
    selector: (row: { iron: any }) => row.iron,
    sortable: true,
    right: true,
    style: {
      backgroundColor: '#F40691',
      color: 'white',
      '&:hover': {
        cursor: 'pointer'
      }
    }
  }
]

const TAX_RATE = 0.07

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`
}

function priceRow(qty: number, unit: number) {
  return qty * unit
}
function conversionRow(price: number, unit: number) {
  return price * unit
}

function createRow(desc: string, qty: number, unit: number) {
  const price = priceRow(qty, unit)
  return { desc, qty, unit, price }
}

interface Row {
  desc: string
  qty: number
  unit: number
  price: number
}

function subtotal(items: readonly Row[]) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0)
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99)
]

const invoiceSubtotal = subtotal(rows)
const invoiceTaxes = TAX_RATE * invoiceSubtotal
const invoiceTotal = invoiceTaxes + invoiceSubtotal

export function SpanningTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
              0
            )} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface SelectedCellParams {
  id: GridRowId
  field: string
}

interface EditToolbarProps {
  selectedCellParams?: SelectedCellParams
  cellModesModel: GridCellModesModel
  setCellModesModel: (value: GridCellModesModel) => void
  cellMode: 'view' | 'edit'
}

// { id: 1, unit: 1, time: 'seconds', price: 1 },
const initialRows: GridRowsProp = [
  {
    id: randomId(),
    unit: 1,
    time: 'seconds',
    price: 1
  }
]

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = randomId()
    setRows((oldRows) => [
      ...oldRows,
      { id, unit: 1, time: 'seconds', price: 1, isNew: true }
    ])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'time' }
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color="secondary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  )
}

export function FullFeaturedCrudGrid() {
  const savedItem = JSON.parse(localStorage.getItem('timedValues'))

  const [rows, setRows] = React.useState(savedItem || initialRows)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  function setConversion(params: GridValueSetterParams) {
    return params?.row
  }

  function parseConversion(value: GridCellValue) {
    return Number(value)
  }

  const unformattedPrice = UnformattedConvertedPrice()

  console.log({ unformattedPrice })

  const { subsPrice } = values.pricing
  console.log({ Tvalues: values, subsPrice })

  function getConversion(params: GridValueGetterParams) {
    const priceRow = params.row.price
    const unitRow = params.row.unit
    const conversion = conversionRow(priceRow, unitRow).toFixed(2)
    const formattedPrice = unformattedPrice?.price
    const convertedPrice = Number(conversion) * Number(formattedPrice)

    return `≈ €${convertedPrice.toFixed(2)}`
  }

  useEffect(() => {
    const formattedRow = rows.map((values: any) => values)
    console.log({ rows, f_rows: formattedRow })

    if (rows && typeof window !== 'undefined') {
      setFieldValue('pricing.subsPrice', {
        rows
      })
    }
  }, [rows, setFieldValue])

  localStorage.setItem('timedValues', JSON.stringify(rows))

  console.log({ savedItem })

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row: { id: GridRowId }) => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })

    const editedRow = rows.find((row: { id: GridRowId }) => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter((row: { id: GridRowId }) => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(
      rows.map((row: { id: any }) => (row.id === newRow.id ? updatedRow : row))
    )
    return updatedRow
  }

  function SelectTimeEditInputCell(props: GridRenderCellParams) {
    const { id, value, field } = props
    const apiRef = useGridApiContext()

    const handleChange = async (event: SelectChangeEvent) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value
      })
      apiRef.current.stopCellEditMode({ id, field })
    }

    return (
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        sx={{ height: 1 }}
        native
        autoFocus
      >
        <option>second(s)</option>
        <option>minute(s)</option>
        <option>hour(s)</option>
        <option>day(s)</option>
        <option>semester(s)</option>
        <option>year(s)</option>
        <option>forever</option>
      </Select>
    )
  }

  const renderSelectTimeEditInputCell: GridColDef['renderCell'] = (params) => {
    return <SelectTimeEditInputCell {...params} />
  }

  const columns: GridColumns = [
    {
      field: 'unit',
      headerName: 'Unit',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      width: 130,
      editable: true
    },
    {
      field: 'time',
      headerName: 'Time',
      headerClassName: 'super-app-theme--header',
      renderEditCell: renderSelectTimeEditInputCell,
      type: 'string',
      width: 130,
      editable: true
    },
    {
      field: 'price',
      headerName: 'Price',
      headerClassName: 'super-app-theme--header',
      type: 'number',
      width: 130,
      editable: true
    },
    {
      field: 'conversion',
      headerName: 'Conversion',
      headerClassName: 'super-app-theme--header',
      width: 160,
      editable: true,
      valueGetter: getConversion,
      valueSetter: setConversion,
      valueParser: parseConversion
      // renderEditCell: renderConversionEditInputCell
      // sortComparator: (v1, v2) => v1!.toString().localeCompare(v2!.toString()),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              key={id}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key={id}
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={id}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            key={id}
          />
        ]
      }
    }
  ]

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        boxShadow: 2,
        backgroundColor: 'dark',
        // fontFamily: [
        //   '-apple-system',
        //   'BlinkMacSystemFont',
        //   '"Segoe UI"',
        //   'Roboto',
        //   '"Helvetica Neue"',
        //   'Arial',
        //   'sans-serif',
        //   '"Apple Color Emoji"',
        //   '"Segoe UI Emoji"',
        //   '"Segoe UI Symbol"',
        // ].join(','),
        // WebkitFontSmoothing: 'auto',
        // letterSpacing: 'normal',
        // '& .MuiDataGrid-columnsContainer': {
        //   backgroundColor: (theme) => theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
        // },
        // '& .MuiDataGrid-iconSeparator': {
        //   display: 'none',
        // },
        // '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        //   borderRight: (theme) => `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
        //     }`,
        // },
        '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
          borderBottom: (theme) =>
            `1px solid ${
              theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
            }`
        },
        // '& .MuiDataGrid-cell': {
        //   color: (theme) =>
        //     theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
        // },
        '& .MuiPaginationItem-root': {
          borderRadius: 0
        },
        '& .MuiDataGrid-cell': {
          color: '#F40691'
        },
        '& .MuiDataGrid-cell--editable': {
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'white' : '#100c08'
        },
        '& .super-app-theme--header': {
          backgroundColor: '#F40691'
        },
        // backgroundColor: 'white',
        m: 2,
        '& .actions': {
          color: '#F40691'
        },
        '& .textPrimary': {
          color: '#F40691'
        }
      }}
    >
      {/* <SubsPriceUnit /> */}
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel }
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  )
}
