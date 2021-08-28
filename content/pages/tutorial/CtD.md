---
title: Compute-to-Data
chapter: 10
---

**Compute-to-Data** is the functionality that solves the current trade-off between the benefits of using private data and the risks of exposing it. It allows data consumers to **run compute jobs on private data while the data stays on-premise with the data provider.**

Overall, a data provider using the Compute-to-Data functionality enjoys many benefits:

- **Privacy.** Consumers never see the data, so they cannot leak personal or sensitive information. to the algorithm consumer.
- **Control.** Algorithm owners retain control of their algorithms since the algorithm is never shown to the consumer.
- **Storage capacity.** Data owners can monetize their data without having to move it around, which is ideal for very large datasets that are slow or expensive to move.
- **Compliance.** Having only one copy of the data and not moving it makes it easier to comply with data protection regulations like GDPR.
- **Auditability.** Compute-to-Data gives proof that algorithms were properly executed so that AI practitioners can be confident in the results.

Once an algorithm is sold, that algorithm is sent to train or query some dataset in a containerized environment. The algorithm and the data are both protected and cannot be seen by the data consumer.

![Compute-to-Data](https://raw.githubusercontent.com/deltaDAO/files/main/ComputeToData.png)
