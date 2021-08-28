---
title: Smart Contracts for storing and exchanging data
chapter: 5
---

It would be great to have a central repository to store information about data, which anyone can query. The only truly neutral solution is to have an independent smart contract where everyone can register their data. A blockchain can enable collaboration among competitors, just like that.

**Introducing Ocean Protocol**. This is exactly what Ocean Protocol does. It implements standards on how to provide a valid link to the data, description, and further metadata. Now data marketplaces need only to query Ocean smart contracts to list available datasets. Payments for data exchanges are also part of the solution. When someone buys the data from a data marketplace, the payment is sent directly to the data provider.Now, suppose you want to buy a new dataset. In that case, you could visit your favorite data marketplace and see which dataset matches your needs, knowing that you are searching the entire ocean of available data, not just a fraction of it.

Ocean Protocol provides a standard way to do all of this. Eventually, it increases the quality of data markets since they can focus their limited resources on providing additional features that might be useful for their users instead of reimplementing a payment process yet again.

Ocean Protocol defines how communication between data providers and data consumers takes place in a decentralized way, either directly or via apps like marketplaces.

Ocean Protocol provides a complete toolbox for data scientists and developers to publish securely, exchange, and use data.

- It allows data providers to securely monetize their private data in full transparency while keeping full ownership.
- It allows data consumers to run compute algorithms on data, which was previously not accessible (data not shared, no open marketplace to find the data, no process to judge data quality/relevance).

**Visual of a Simple Data Exchange**

![Data Exchange](https://raw.githubusercontent.com/deltaDAO/files/main/data_exchange.png)

The Ocean Protocol toolbox offers:

1. **Tools and libraries.** Smart contracts, libraries, and software components to publish and consume data services, build marketplaces, and develop other apps to privately and securely publish, exchange, and consume data. The Compute-to-Data feature is a core component of secure data exchanges.
2. **Standards to interact with data.** Standardization of data-related assets definitions in Web3, and standardization of metadata. This is key to enable large-scale collaboration and the creation of an open and effective data economy.
3. **Definitions** An asset is the representation of different types of resources in Ocean Protocol. Typically an asset could be one of the following asset types:

   - **Dataset.** An asset representing a dataset or data resource.
   - **Algorithm.** An asset representing a piece of code or software.

4. **Metadata** is stored on the blockchain. To be more precise, the asset self-description is stored in the state of a metadata smart contract and holds information such as the name of data asset, description, owner, price, and other details like category, tags, creation and update dates, etc. It can also provide a sample of the data.
5. **Web3 access control.** Traditional access control uses centralized intermediaries, where data owners risk losing control of their data. Ocean Protocol restores control and privacy by replacing the centralized intermediaries with a decentralized distributed ledger. Web3 provides a seamless experience across services using the same key, their wallet (e.g., MetaMask).

**Visual of a Full Market Place**
![Ocean Marketplace](https://raw.githubusercontent.com/deltaDAO/files/main/ocean_market.jpg)

The Ocean Protocol technology stack provides high-level functionalities to facilitate data exchanges for users in an easy way:

- **Publishing**. Allows the user to publish new assets to the network.
- **Consuming**. Published assets can be listed and consumed by the user.
- **Marketplace**. Enables complex interactions and advanced capabilities.
