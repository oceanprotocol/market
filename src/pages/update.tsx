import React, { ChangeEvent, ReactElement, useState } from 'react'
import Page from '../components/templates/Page'
import { PageProps } from 'gatsby'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import { useOcean } from '@oceanprotocol/react'
import Loader from '../components/atoms/Loader'
import { DDO } from '@oceanprotocol/lib'
import Alert from '../components/atoms/Alert'
import styles from '../components/atoms/Box.module.css'

const pageTitle = 'Update Data Set'
const pageDescription =
  'Interim solution for updating title & description of a data set until a proper editing flow is implemented. No validation, no checks. Make sure your DID is correct and that you are connected with the account you used to published your data set.'

export default function PageGatsbyUpdateAsset(props: PageProps): ReactElement {
  const { ocean, account } = useOcean()
  const [did, setDid] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const [ddo, setDdo] = useState<DDO>()

  async function handleSubmit(e: ChangeEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (!did) return

    try {
      setIsLoading(true)
      const ddo = await ocean.assets.editMetadata(
        did,
        { title, description },
        account
      )
      setDdo(ddo)
    } catch (error) {
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleChangeDid(e: ChangeEvent<HTMLInputElement>) {
    setDid(e.target.value)
  }

  function handleChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
  }

  function handleChangeDescription(e: ChangeEvent<HTMLInputElement>) {
    setDescription(e.target.value)
  }

  return (
    <Page title={pageTitle} description={pageDescription} uri={props.uri}>
      <form className={styles.box}>
        <Input
          name="did"
          label="DID"
          placeholder="e.g. did:op:C1d97aEAb57622B2d139f10351B48CBf94071e5c"
          onChange={handleChangeDid}
          required
        />
        <Input name="title" label="New Title" onChange={handleChangeTitle} />
        <Input
          type="textarea"
          name="description"
          label="New Description"
          onChange={handleChangeDescription}
          rows={4}
        />
        <Button
          style="primary"
          onClick={handleSubmit}
          disabled={isLoading || !ocean || !account || !did}
        >
          {isLoading ? <Loader /> : 'Submit'}
        </Button>

        {ddo?.id && <Alert state="success" text="Updated!" />}
      </form>
    </Page>
  )
}
