---
title: Compute-to-Data
chapter: 9
---

**Ocean Compute-to-Data** is the functionality that solves the current tradeoff between the benefits of using private data and the risks of exposing it. It allows data consumers to **run compute jobs on data to train AI models while the data stays on-premise with the data provider**.

![Compute-to-Data](https://raw.githubusercontent.com/deltaDAO/files/main/C2D_full.JPG)

Overall, a Compute Provider using the Compute-to-Data functionality enjoys many benefits:

- **Privacy**. Compute Providers never see the data, so they cannot leak personal or sensitive information to the algorithm consumer.
- **Control**. Compute owners retain control of their algorithms since the algorithm is never fully shown to the algo consumer.
- **Storage capacity**. Algorithm owners can share or sell their script without having to import any data, which is ideal for very large datasets that are slow or expensive to move.
- **Compliance**. Having only one copy of the data and not moving it makes it easier to comply with data protection regulations like GDPR.
- **Auditability**. Compute-to-Data gives proof that algorithms were properly executed so that AI practitioners can be confident in the results.

Once an algorithm is sold, that algorithm is sent to train or query some dataset in a Virtual Machine. The algorithm and the data are both protected and cannot be seen by the algorithm consumer.

Wait, but how can you trust an algorithm supplied by another data scientist? Ocean Protocol has built-in financial incentives for curators to signal the quality of algorithms and datasets via a Quality Scoring Mechanism.

The Compute Quality Scoring Mechanism in Ocean Protocol is designed in such a way that Compute Providers lock OCEAN tokens into their algorithm as a guarantee. They then earn a cut of the transaction fees every time the algorithm is used, proportional to their share of the total amount of OCEAN tokens locked on the algorithm. And anyone can lock OCEAN tokens into any asset to get a cut of the transaction fees of that asset.

This incentivizes participants in Ocean Protocol to invest in the data sets that they think will provide the most fee, and the total amount invested provides a signal on algorithm quality. Data Buyers benefit from this market dynamic to judge the trustworthiness of an Ocean asset taking liquidity as reference (how much are participants betting on this particular algorithm or dataset).
