# Advanced Settings

**Table of Contents**

- [Role based Access Control](#rbac-settings)
- [Allow and Deny lists](#allow-and-deny-list-settings)
- [Free Pricing](#free-pricing-settings)

## RBAC settings

- Setup and host the Ocean role based access control (RBAC) server. Follow the instructions in the [RBAC repository](https://github.com/oceanprotocol/RBAC-Server)
- The RBAC server can store roles in [Keycloak](https://www.keycloak.org/) or a json file.
- In your .env file, set the value of the `GATSBY_RBAC_URL` environmental variable to the URL of the Ocean RBAC server that you have hosted, e.g. `GATSBY_RBAC_URL= "http://localhost:3000"`
- Users of your marketplace will now require the correct role ("user", "consumer", "publisher") to access features in your marketplace. The market will check the role that has been allocated to the user based on the address that they have connected to the market with.
- The following features have been wrapped in the `Permission` component and will be restricted once the `GATSBY_RBAC_URL` has been defined:
  - Viewing or searching datasets requires the user to have permission to `browse`
  - Purchasing or trading a datatoken, or adding liquidity to a pool require the user to have permission to `consume`
  - Publishing a dataset requires the user to have permission to `publish`
- You can change the permission restrictions by either removing the `Permission` component or passing in a different eventType prop e.g. `<Permission eventType="browse">`.

## Allow and Deny List Settings

- To enable allow and deny lists you need to add the following environmental variable to your .env file: `GATSBY_ALLOW_ADVANCED_SETTINGS="true"`
- Publishers in your market will now have the ability to restrict who can consume their datasets.

## Free Pricing Settings

- To allow publishers to set pricing as "Free" you need to add the following environmental variable to your .env file: `GATSBY_ALLOW_FREE_PRICING="true"`
- This allocates the datatokens to the [dispenser contract](https://github.com/oceanprotocol/contracts/blob/main/contracts/dispenser/Dispenser.sol) which dispenses data tokens to users for free. Publishers in your market will now be able to offer their datasets to users for free (excluding gas costs).
