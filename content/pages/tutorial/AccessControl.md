---
title: Access Control
chapter: 9
---

Ocean Protocol smart contracts orchestrate the flows between Data Providers who want to monetize their data and Data Consumers who want to use the data to train machine learning models. This covers the entire set of operations required for a successful data exchange, from publishing to consuming data.

It is important to know that there are many possible variants of access. Access could be perpetual (access as many times as you like), time-bound (access for just one day, or within a specific date range), or one-time (after you access, the token is burned).

**In Ocean Protocol, data access is always treated as a data service**. This could be a service to access a static dataset (e.g. a single file), a dynamic dataset (stream), or a compute service (e.g. &quot;bring compute to the data&quot;). The same requests and process is followed within Ocean Protocol. This is also why compute algorithm assets are handled the same as data assets by Ocean Protocol.

When an exchange takes place, it chronologically follows a series of steps involving the Ocean Protocol middleware.

1. **The Data Provider** provides the URL address of the data or compute service. The data can be stored wherever the data provider likes. It can be stored on any cloud service, server or device accessible through a URL. The publisher can also use [IPFS](https://ipfs.io/), a decentralized file management system popular in the Web3 world.
2. The dataset must have a dedicated URL. This is how the Ocean backend will access the data. Or, instead of a file, the publisher may run a Compute-to-Data service. It then invokes **Ocean Datatoken Factory** to deploy a new datatoken to the chain.
3. When the data Provider registers the URL address with the metadata associated with the dataset, the URL is encrypted and stored on the distributed ledger in the state of the Metadata smart contract.
4. **The Data Consumer.** Data consumers send the amount of datatokens required to access the dataset to the data provider&#39;s wallet. Once this is done, Ocean Provider loads the encrypted URL, decrypts it, and enables the requested service (i.e. send static data, or enable a Compute-to-data job).
