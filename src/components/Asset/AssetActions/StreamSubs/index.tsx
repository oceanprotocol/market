import { useAsset } from '@context/Asset'
import Input from '@shared/FormInput'
import { getFieldContent } from '@utils/form'
import { Field, useFormikContext } from 'formik'
import React from 'react'
import styles from './index.module.css'
import content from '../../../../../content/publish/form.json'
import Copy from '@shared/atoms/Copy'
import { LoggerInstance } from '@oceanprotocol/lib'
import { FormPublishData } from 'src/components/Publish/_types'
import { initialValues } from 'src/components/Publish/_constants'
// import { getAccessDetails } from '@utils/accessDetailsAndPricing'

export default function StreamSubs() {
  const { asset } = useAsset()
  LoggerInstance.log('asset_:', asset)
  // connect with Form state, use for conditional field rendering
  // const { values } = useFormikContext<FormPublishData>()
  //  LoggerInstance.log('values', values)

  // return (
  //   <div>
  //     <input
  //       type="text"
  //       defaultValue={asset.services[0].files}
  //       maxLength={45}
  //       width={0}
  //     />
  //     {asset.services[0].files && (
  //       <code className={styles.accountId}>
  //         <Copy text={asset.services[0].files} />
  //       </code>
  //     )}
  //     <footer className={styles.stats}></footer>
  //   </div>
  // )

  // return (
  //   <>
  //     <div>
  //       {/* <div className={styles.typeLabel}>
  //         <h2>{'\u2728'}</h2>
  //         <Copy text={asset.services[0].files} />
  //         <Input
  //           placeholder="Hello there"
  //           size="mini"
  //           value={asset.services[0].files}
  //         />
  //       </div> */}
  //       {/* <input
  //         className="rounded-md w-full border border-gray-400 p-3 mb-5"
  //         value={asset.services[0].files}
  //         // onChange={({ target: { value } }) => onChange(value)}
  //       />
  //       {asset.services[0].files && (
  //         <code className={styles.accountId}>
  //           <Copy text={asset.services[0].files} />
  //         </code>
  //       )} */}
  //     </div>
  //     {/* <div> */}

  //     {/* </div> */}
  //   </>
  // )

  // return (
  //   <>
  //     <footer className={styles.stats}>
  //       {!asset || !asset?.stats || asset?.stats?.orders === 0 ? (
  //         'No sales yet'
  //       ) : (
  //         <>
  //           <span className={styles.number}>{asset.stats.orders}</span> sale
  //           {asset.stats.orders === 10 ? '' : 'ssssssssssssssssss'}
  //         </>
  //       )}
  //     </footer>
  //     <div className={styles.typeLabel}>
  //       <span className={styles.number}>
  //         {`${asset.stats.orders === 1 ? 'saleeeeeee' : 'sales'}`}
  //       </span>
  //     </div>
  //   </>
  // )

  // async function handleSubmit(values: FormPublishData) {
  //   // const { erc721Address, datatokenAddress } = await create(values)
  //   LoggerInstance.log('allVal', values)

  //   async function create(values: FormPublishData): Promise<{
  //     apiDocs: string
  //   }> {
  //     const { apiDocs } = await create(values)
  //     return { apiDocs }
  //     // return <div>{values}</div>
  //   }
  // }

  return (
    <footer className={styles.stats}>
      {!asset ||
      !asset?.accessDetails ||
      !asset?.accessDetails?.validOrderTx ? (
        ''
      ) : (
        <>
          <div>
            <input type="text" defaultValue={asset.services[0].files} />
            {asset.services[0].files && (
              <code className={styles.accountId}>
                <Copy text={asset.services[0].files} />
              </code>
            )}
            <footer className={styles.stats}></footer>
          </div>
        </>
      )}
    </footer>
  )
}
