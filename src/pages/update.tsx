import React, { ChangeEvent, ReactElement, useState } from 'react'
import Layout from '../components/Layout'
import { PageProps } from 'gatsby'
import Input from '../components/atoms/Input'
import Button from '../components/atoms/Button'
import { useOcean } from '@oceanprotocol/react'
import Loader from '../components/atoms/Loader'
import { DDO } from '@oceanprotocol/lib'
import Alert from '../components/atoms/Alert'

const pageTitle = 'Update Data Set'
const pageDescription =
  'Interim solution for updating title & description of a data set until a proper editing flow is implemented. No validation, no checks. Make sure your DID is correct and you are connected with the account you published the to-be-edited data set.'

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
    <Layout title={pageTitle} description={pageDescription} uri={props.uri}>
      <form>
        <Input name="did" label="DID" onChange={handleChangeDid} required />
        <Input name="title" label="New Title" onChange={handleChangeTitle} />
        <Input
          type="textarea"
          name="description"
          label="New Description"
          onChange={handleChangeDescription}
          rows={4}
        />
        <Button style="primary" onClick={handleSubmit}>
          {isLoading ? <Loader /> : 'Submit'}
        </Button>

        {ddo?.id && <Alert state="success" text="Updated!" />}
      </form>
    </Layout>
  )
}
