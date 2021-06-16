# Advance Settings

**Table of Contents**

- [Role based Access Control](#-rbac-settings)
- [Allow and Deny lists](#-allow-deny-list-settings)
- [Free Pricing](#-free-pricing-settings)
- [Free Pricing](#-free-pricing-settings)

## RBAC settings

- Setup and host the Ocean role based access control (RBAC) server. Follow the instructions in the RBAC repository: https://github.com/oceanprotocol/RBAC-Server
- Create an environmental variable in the .env file called `GATSBY_RBAC_URL`. The value should by the URL of the Ocean RBAC server that you have hosted, e.g. `GATSBY_RBAC_URL= "http://localhost:3000"`
- Users of your marketplace will now require the correct role ("user", "comsumer", "publisher") access features in your marketplace.

## Allow Deny List Settings

- To enable allow and deny lists you need to add the following environmental variable to your .env file: `GATSBY_ALLOW_ADVANCED_SETTINGS="true"`
- Publishers in your market will now have the ability to restrict who can consume their datasets.

## Free Pricing Settings

- To allow publishers to set pricing as "Free" you need to add the following environmental variable to your .env file: `GATSBY_ALLOW_FREE_PRICING="true"`
- This allocates the datatokens to a [dispenser](https://github.com/oceanprotocol/contracts/blob/main/contracts/dispenser/Dispenser.sol) which dispenses data tokens to users for free. Publishers in your market will now be able to offer their datasets to users for free (excluding gas costs).
