---
title: Deep Dive
chapter: 6
---

Ocean Protocol makes it easy to publish data services, provide accurate pricing for the data, discover data, purchase data, and consume data services. Our Gaia-X Portal powered by Ocean Protocol supports fixed pricing and automatic price discovery for data services.

It&#39;s a vendor-neutral reference data marketplace for use by the Gaia-X community. It&#39;s decentralized (no single owner or controller) and non-custodial (only the data owner holds the keys for the datatokens). Developers, entrepreneurs and enterprises are free to fork our Gaia-X Portal to build their data marketplaces.

**Let&#39;s explore our Gaia-X Portal to understand more in-depth the Ocean Protocol 3 layers stack.**

The consumer interacts with the frontends including **Gaia-X Portal** , or with any independent third-party markets connected to the network. Applications (interfaces), usually running in the browser, are connected to the Ocean Protocol backend using Ocean JS library. The decentralized backend are smart contracts running on the Gaia-X distributed ledger, which includes the libraries and tools we covered before like access smart contracts and the on-chain metadata store.

![Layers](https://raw.githubusercontent.com/deltaDAO/files/main/layerColored.png)

**Layer 3 — Apps ecosystem (Gaia-X Portal, marketplaces, data management platforms)** This is effectively the services and the UI that people interact with for their data exchanges. A marketplace/publisher app, typically running in a web browser.

**Layer 2 — Component level (Ocean metadata storage, Ocean proxy, libraries)** The Ocean middleware solution sits in between. Datasets and their metadata are registered and validated here. It includes all the high-level libraries to interact with Ocean Protocol, and the components enabling the integration of your data with Ocean Protocol.

**Layer 1 — Network level (EVM nodes and smart contracts)** This is the foundational layer. The ledger records data ownership and access rights. Ocean Protocol smart contracts deal with data properties and rights and facilitate secure data exchange.
