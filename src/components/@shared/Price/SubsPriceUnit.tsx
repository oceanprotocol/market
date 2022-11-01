/* eslint-disable prettier/prettier */
import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import { grey, pink } from '@mui/material/colors'
import { useFormikContext } from 'formik'
import { FormPublishData } from 'src/components/Publish/_types'
import Input from '@shared/FormInput'
import { UnformattedConvertedPrice } from './Conversion'

export default function SubsPriceUnit() {
  const [valuee, setValuee] = React.useState('')
  const [error, setError] = React.useState(false)
  const [helperText, setHelperText] = React.useState('Choose wisely')
  const [selectedOption, setSelectedOption] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState('0')
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  console.log({ subVals: values })
  const savedItem = JSON.parse(localStorage.getItem('timedValues'))
  const unformattedPrice = UnformattedConvertedPrice()
  const formattedPrice = unformattedPrice?.price
  const formattedCurrency = unformattedPrice?.currency

  // savedItem.map((val, key) => {
  //     console.log({ _val: val, key, unit: val.unit, time: val.time, price: val.price, conv: val.unit * val.price })
  // })

  // const variants = {
  //     variations: [
  //         {
  //             variation_id: 1,
  //             variation_name: "210kr",
  //             price: "210",
  //             reward_text: "200kr. Price",
  //             reward_description:
  //                 "Med et gavekort til Sendentanke.dk kan du vælge mellem gavekort til hundredevis af butikker og oplevelser ét sted.",
  //         },
  //         {
  //             variation_id: 2,
  //             variation_name: "400kro",
  //             price: "400",
  //             reward_text: "400 Price",
  //             reward_description: "Earn a reward",
  //         },
  //     ],
  // };

  // variants.variations.map((v, i) => {

  //     // console.log({ v, i, vid: v.variation_id })

  // });

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuee((event.target as HTMLInputElement).value)
    // console.log()
    // setHelperText(' ')
    // setError(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item }
  })

  console.log({ selectedValue, valuee })

  const onChangeValue = (event: { target: { value: any } }) => {
    // setSelectedOption(event.target.value);
    console.log(event.target.value)
  }
  const onValueChange = (event: { target: { value: any } }) => {
    setSelectedOption(event.target.value)
    console.log(event.target.value)
  }

  const subOptions = savedItem.map(
    (
      value: {
        price: number
        id: string
        unit: number
        time: string
      },
      index: string
    ) => {
      const labelUnit = value.unit.toFixed(2)
      const labelPrice = value.price.toFixed(2)
      const labelConv = Number(labelPrice) * Number(labelUnit)
      const labelConvCalc = (labelConv * Number(formattedPrice)).toFixed(2)
      console.log({ labelConvCalc, formattedPrice })
      return (
        <form key={index}>
          <FormControl sx={{ m: -0.2 }} error={error} variant="standard">
            {/* <FormLabel id="demo-error-radios">Pop quiz: MUI is... {value}</FormLabel> */}
            <RadioGroup
              aria-labelledby="demo-error-radios"
              name={value.id}
              value={valuee}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value={index}
                control={
                  <Radio
                    {...controlProps(index)}
                    sx={{
                      color: grey[800],
                      '&.Mui-checked': {
                        color: pink[600]
                      }
                    }}
                  />
                }
                label={`${labelUnit} ${value.time} / ${labelPrice} OCEAN ≈ €${labelConvCalc}`}
              />
            </RadioGroup>
          </FormControl>
        </form>
      )
    }
  )

  return <React.Fragment>{subOptions}</React.Fragment>
}
