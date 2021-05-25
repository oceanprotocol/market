import React, { ChangeEvent, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import slugify from 'slugify'
import PriceUnit from '../../atoms/Price/PriceUnit'
import { ReactComponent as External } from '../../../images/external.svg'
import InputElement from '../../atoms/Input/InputElement'
import Loader from '../../atoms/Loader'
import {
  input,
  checkbox,
  radio,
  empty,
  selection,
  disabled as disabledStyle,
  search,
  scroll,
  row,
  label,
  title,
  link,
  did,
  price
} from './AssetSelection.module.css'

export interface AssetSelectionAsset {
  did: string
  name: string
  price: string
  checked: boolean
  symbol: string
}

function Empty() {
  return <div className={empty}>No assets found.</div>
}

export default function AssetSelection({
  assets,
  multiple,
  disabled,
  ...props
}: {
  assets: AssetSelectionAsset[]
  multiple?: boolean
  disabled?: boolean
}): JSX.Element {
  const [searchValue, setSearchValue] = useState('')

  const styleClassesInput = `${input} ${multiple ? checkbox : radio}`

  function handleSearchInput(e: ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value)
  }

  return (
    <div className={`${selection} ${disabled ? disabledStyle : ''}`}>
      <InputElement
        type="search"
        name="search"
        size="small"
        placeholder="Search by title, datatoken, or DID..."
        value={searchValue}
        onChange={handleSearchInput}
        className={search}
        disabled={disabled}
      />
      <div className={scroll}>
        {!assets ? (
          <Loader />
        ) : assets && !assets.length ? (
          <Empty />
        ) : (
          assets
            .filter((asset: AssetSelectionAsset) =>
              searchValue !== ''
                ? asset.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  asset.did.toLowerCase().includes(searchValue.toLowerCase()) ||
                  asset.symbol.toLowerCase().includes(searchValue.toLowerCase())
                : asset
            )
            .map((asset: AssetSelectionAsset) => (
              <div className={row} key={asset.did}>
                <input
                  id={slugify(asset.did)}
                  type={multiple ? 'checkbox' : 'radio'}
                  className={styleClassesInput}
                  defaultChecked={asset.checked}
                  {...props}
                  disabled={disabled}
                  value={asset.did}
                />
                <label
                  className={label}
                  htmlFor={slugify(asset.did)}
                  title={asset.name}
                >
                  <h3 className={title}>
                    <Dotdotdot clamp={1} tagName="span">
                      {asset.name}
                    </Dotdotdot>
                    <a
                      className={link}
                      href={`/asset/${asset.did}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <External />
                    </a>
                  </h3>

                  <Dotdotdot clamp={1} tagName="code" className={did}>
                    {asset.symbol} | {asset.did}
                  </Dotdotdot>
                </label>

                <PriceUnit price={asset.price} small className={price} />
              </div>
            ))
        )}
      </div>
    </div>
  )
}
