---
title: Deployment of Ocean Market
description: Step by step guide to a quick deployment of Ocean Market
---

# Build and host your Data Marketplace

All that’s left is for you to host your data marketplace and start sharing it with your future users.

## **Build and host your marketplace using surge**

To host your data marketplace, you need to run the build command:

```bash
npm run build:static
```

This takes a few minutes to run. While this is running, you can get prepared to host your new data marketplace. You have many options for hosting your data marketplace (including AWS S3, Vercel, Netlify and many more). In this guide, we will demonstrate how to host it with surge, which is completely free and very easy to use. You can also refer to this tutorial from the infrastructuree section as well if you want to deploy your market in you own infrastructure using docker.

Open up a new terminal window and run the following command to install surge:

```bash
npm install --global surge
```

When this is complete, navigate back to the terminal window that is building your finished data marketplace. Once the build is completed, enter the following commands to enter the public directory and host it:

```bash
cd out
```

```bash
surge
```

If this is your first time using surge, you will be prompted to enter an email address and password to create a free account. It will ask you to confirm the directory that it is about to publish, check that you are in the market/public/ directory and press enter to proceed. Now it gives you the option to choose the domain that you want your project to be available on.

We have chosen https://crypto-photos.surge.sh which is a free option. You can also set a CNAME value in your DNS to make use of your own custom domain.

After a few minutes, your upload will be complete, and you’re ready to share your data marketplace.
