import React, { ChangeEvent, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import PriceUnit from '../../atoms/Price/PriceUnit'
import { ReactComponent as External } from '../../../images/external.svg'
import styles from './AssetSelection.module.css'
import InputElement from '../../atoms/Input/InputElement'

const cx = classNames.bind(styles)

export interface AssetSelectionAsset {
  did: string
  name: string
  price: string
  checked: boolean
}

export default function AssetSelection({
  assets,
  multiple,
  ...props
}: {
  assets: AssetSelectionAsset[]
  multiple?: boolean
}): JSX.Element {
  const [searchValue, setSearchValue] = useState('')

  const styleClassesInput = cx({
    input: true,
    [styles.checkbox]: multiple,
    [styles.radio]: !multiple
  })

  function handleSearchInput(e: ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value)
  }

  return (
    <div className={styles.selection}>
      <InputElement
        type="search"
        name="search"
        size="small"
        placeholder="Search by title or DID..."
        value={searchValue}
        onChange={handleSearchInput}
        className={styles.search}
      />
      <div className={styles.scroll}>
        {assets
          .filter((asset: AssetSelectionAsset) =>
            searchValue !== ''
              ? asset.name.toLowerCase().includes(searchValue) ||
                asset.did.includes(searchValue)
              : asset
          )
          .map((asset: AssetSelectionAsset) => (
            <div className={styles.row} key={asset.did}>
              <input
                id={slugify(asset.did)}
                type={multiple ? 'checkbox' : 'radio'}
                className={styleClassesInput}
                checked={asset.checked}
                {...props}
                value={asset.did}
              />
              <label
                className={styles.label}
                htmlFor={slugify(asset.did)}
                title={asset.name}
              >
                <h3 className={styles.title}>
                  <Dotdotdot clamp={1} tagName="span">
                    {asset.name}
                  </Dotdotdot>
                  <a
                    className={styles.link}
                    href={`/asset/${asset.did}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <External />
                  </a>
                </h3>

                <Dotdotdot clamp={1} tagName="code" className={styles.did}>
                  {asset.did}
                </Dotdotdot>
              </label>

              <PriceUnit price={asset.price} small className={styles.price} />
            </div>
          ))}
      </div>
    </div>
  )
}
