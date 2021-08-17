---
title: Smart Contracts - Storing and exchanging data
chapter: 6
---

It would be great to have a central repository to store information about data, which anyone can query. The only truly neutral solution is to have an independent smart contract where everyone can register their data. A blockchain can enable collaboration among competitors, just like that.

**Introducing Ocean Protocol**. This is exactly what the Ocean Protocol does. It implements standards on how to provide a valid link to the data, description, and further metadata. Now data marketplaces need only to query Ocean smart contracts to list available datasets. Payments for data exchanges are also part of the solution. When someone buys the data from a data marketplace the marketplace converts it into ETH and sends it directly to the user, taking their fee. Now if you want to buy a new dataset you could just visit your favorite data marketplace and see which dataset matches your needs, knowing that you are searching the entire ocean of available data, not just a fraction of it.

Ocean Protocol provides a standard way to do all of this. Eventually, it increases the quality of data markets since they can focus their limited resources on providing additional features that might be useful for their users instead of reimplementing a payment process yet again.

Ocean Protocol is a protocol that defines how communication between data providers and data consumers takes place in a decentralized way, either directly or via apps like marketplaces.

Ocean Protocol provides a complete toolbox for data scientists and developers to securely publish, exchange, and use data.

- It allows data providers to securely monetize their private data in full transparency while keeping full ownership.
- It allows data consumers to run compute algorithms on vetted data, which was previously not accessible (data not shared, no open marketplace to find the data, no process to judge data quality/relevance).

**Visual of a Simple Data Exchange**

**The Ocean Protocol toolbox offers**:

1. **Tools and libraries**. Smart contracts, libraries, and software components to publish and consume data services, build marketplaces, and develop other apps to privately and securely publish, exchange, and consume data. The Compute-to-Data feature is a core component of secure data exchanges.
2. **Standards to interact with data**. Standardization of data-related assets definitions in Web3, and standardization of metadata. This is key to enable large scale collaboration and the creation of an open and effective data market.
   1. **Definitions** An asset is the representation of different types of resources in Ocean Protocol. Typically an asset could be one of the following asset types:
      - **Dataset**. An asset representing a dataset or data resource. It could be for example a CSV file or multiple JPG files.
      - **Algorithm**. An asset representing a piece of software. It could be a python script using TensorFlow, a spark job, etc.
   2. **Metadata** is stored in a blockchain context efficiently. Information encompasses the name of data asset, description, owner, price, and other details like category, tags, creation and update dates, etc. It can also provide a sample of the data.
3. **Web3 access control**. Traditional access control uses centralized intermediaries, where data owners risk losing control of their data. Ocean Protocol restores control and privacy by replacing the centralized intermediaries with a decentralized blockchain network. Web3 provides a seamless experience across services using the same key, their Ethereum wallet (e.g. MetaMask).

**Visual of a Full Market Place**
![Marketplace](https://raw.githubusercontent.com/deltaDAO/files/main/Marketplace_white.png)

Ocean Protocol technology stack provides high-level functionalities to facilitate data exchanges for users in an easy way:

- **Publishing**. Allows the user to publish new assets to the network.
- **Consuming**. Published assets can be listed and consumed by the user.
- **Marketplace**. Enables complex interactions and advanced capabilities.
