---
description: >-
  Use these steps to reveal the information contained within an asset's DID and
  list the buyers of a datatoken
---

# Retrieve datatoken/data NFT addresses & Chain ID

### How to find the network, datatoken address, and data NFT address from an Ocean Market link?

If you are given an Ocean Market link, then the network and datatoken address for the asset is visible on the Ocean Market webpage. For example, given this asset's Ocean Market link: [https://odc.oceanprotocol.com/asset/did:op:1b26eda361c6b6d307c8a139c4aaf36aa74411215c31b751cad42e59881f92c1](https://odc.oceanprotocol.com/asset/did:op:1b26eda361c6b6d307c8a139c4aaf36aa74411215c31b751cad42e59881f92c1) the webpage shows that this asset is hosted on the Mumbai network, and one simply clicks the datatoken's hyperlink to reveal the datatoken's address as shown in the screenshot below:

<figure><img src="../.gitbook/assets/market/marketplace_data.jpg" alt="" width="563"><figcaption><p>See the Network and Datatoken Address for an Ocean Market asset by visiting the asset's Ocean Market page.</p></figcaption></figure>

#### More Detailed Info:

You can access all the information for the Ocean Market asset also by **enabling Debug mode**. To do this, follow these steps:

**Step 1** - Click the Settings button in the top right corner of the Ocean Market

<figure><img src="../.gitbook/assets/market/Click-Settings.png" alt=""><figcaption><p>Click the Settings button</p></figcaption></figure>

**Step 2** - Check the Activate Debug Mode box in the dropdown menu

<figure><img src="../.gitbook/assets/market/Check-Debug-Mode.png" alt=""><figcaption><p>Check 'Active Debug Mode'</p></figcaption></figure>

**Step 3** - Go to the page for the asset you would like to examine, and scroll through the DDO information to find the NFT address, datatoken address, chain ID, and other information.

<figure><img src="../.gitbook/assets/market/Scroll-DDO-Info.png" alt=""><figcaption></figcaption></figure>

### How to use Aquarius to find the chainID and datatoken address from a DID?

If you know the DID:op but you don't know the source link, then you can use Ocean Aquarius to resolve the metadata for the DID:op to find the `chainId`+ `datatoken address` of the asset. Simply enter in your browser "[https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/](https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did:op:1b26eda361c6b6d307c8a139c4aaf36aa74411215c31b751cad42e59881f92c1)\<your did:op:XXX>" to fetch the metadata.

For example, for the following DID:op: "did:op:1b26eda361c6b6d307c8a139c4aaf36aa74411215c31b751cad42e59881f92c1" the Ocean Aquarius URL can be modified to add the DID:op and resolve its metadata. Simply add "[https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/](https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did:op:1b26eda361c6b6d307c8a139c4aaf36aa74411215c31b751cad42e59881f92c1)" to the beginning of the DID:op and enter the link in your browser like this: [https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did:op:1b26eda361c6b6d307c8a139c4aaf36aa74411215c31b751cad42e59881f92c1](https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did:op:1b26eda361c6b6d307c8a139c4aaf36aa74411215c31b751cad42e59881f92c1)

<figure><img src="../.gitbook/assets/market/network-and-datatoken-address.png" alt=""><figcaption><p>The metadata printout for this DID:op with the network's Chain ID and datatoken address circled in red</p></figcaption></figure>

Here are the networks and their corresponding chain IDs:

```json
"mumbai: 80001"
"polygon: 137"
"bsc: 56"
"energyweb: 246"
"moonriver: 1285"
"mainnet: 1"
"goerli: 5"
"polygonedge: 81001"
"gaiaxtestnet: 2021000"
"alfajores: 44787"
"gen-x-testnet: 100"
"filecointestnet: 3141"
"oasis_saphire_testnet: 23295"
"development: 8996"
```

