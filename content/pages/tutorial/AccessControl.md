---
title: Access Control
chapter: 10
---

Ocean Protocol smart contracts orchestrate the flows between Data Providers who want to monetize their data and Data Consumers who want to use the data to build AI models. This covers the entire set of operations required for a successful data exchange, from publishing data to consuming it.

It is important to know that there are many possible variants of access. Access could be perpetual (access as many times as you like), time-bound (access for just one day, or within a specific date range), or one-time (after you access, the token is burned).

**In Ocean Protocol, data access is always treated as a data service**. This could be a service to access a static dataset (e.g. a single file), a dynamic dataset (stream), or for a compute service (e.g. “bring compute to the data”). The same requests and process is followed within Ocean Protocol. This is also why compute algorithm assets are handled the same as data assets by Ocean Protocol.

When an exchange takes place, it follows a series of steps involving the Ocean Protocol middleware, chronologically.

- **The Data Provider** provides the URL address of the data or compute service. The data can be stored wherever the data provider likes, as long as it’s connected. It can be stored in Google Drive, Dropbox, AWS S3, on their home server, or even on their smartphone. The publisher can also use IPFS, a decentralized file management system popular in the Web3 world.
- The dataset must have a dedicated URL. This is how the data will be accessed by the Data Consumers. Or instead of a file, the publisher may run a Compute-to-Data service. It then invokes **Ocean Datatoken Factory** to deploy a new datatoken to the chain.
- When the data Provider registers the URL address with the metadata associated with the dataset, the URL is encrypted and stored in the **Ocean Provider Service**.
- **Service Execution Agreements**. For each data set, the network validates who is able to access what. Ocean Protocol implements this with Service Execution Agreements (SEAs). A SEA is a contract-like agreement between a publisher, a consumer, and a verifier. SEAs specify what assets are to be delivered, the conditions that must be met, and the rewards for fulfilling the conditions. SEAs are implemented as part of Ocean Protocol smart contracts.
- **The Data Consumer**. Buyers of data send the amount of datatokens required to access the dataset to the Provider wallet. Once this is done, the smart contracts of the Ocean Provider Service load the encrypted URL, decrypt it and enable the requested service (i.e. send static data, or enable a Compute-to-data job).
