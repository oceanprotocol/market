---
title: Forking Ocean Market
description: Forking and running Ocean Market locally.
---

# Forking Ocean Market

One of the best use cases for Ocean is running your own marketplace and monetizing your digital assets. With Ocean you can sell your data directly to your customers with no third party in-between, no need to speak to data with data brokers. Ocean makes this all super easy for you with some pretty cool tech under the hood. Furthermore, an Ocean powered market isn't just limited to selling data, you can use it for selling any type of digital asset!

Using Ocean Market is already a big improvement on the alternatives that are out there, but it gets even better. Ocean Market is completely open-source and made freely available under the Apache 2 license. This means that you can fork Ocean Market and set up your own data marketplace in just a few steps. This guide will walk you through the process, you’ll be surprised how easy it is. No prior blockchain knowledge is required!

* Fork Ocean Market
* Clone the market locally
* Install the dependencies
* Run your Market fork for the first time

## Fork Ocean Market

The first step is to log into Github and navigate to the Ocean Market repository, you’ll need to log in or create a Github account. Now you need to click “Fork” in the top right-hand corner. If you are a member of an organization on Github, it will give you the option to clone it into either your personal account or the organization. Choose whichever is suitable for you.

## Clone the market locally

Now we need to clone the market fork locally so that we can start making changes to the code. Upon forking Ocean Market, GitHub will take you to the repository page. Here, you should copy the URL of the repository. To do this, click on the green “Code” button and then click the copy icon to copy the HTTPS URL. Make sure that you have git installed and set up and installed on your computer before proceeding. See this guide if you’re not familiar with git.

## Install the dependencies

Installing the dependencies is a vital step for running the market. It’s a super simple process, thanks to npm (node package manager). Make sure you have node.js installed, otherwise it will fail. In Ocean Market it’s highly recommended that you use the same version of node that we are using, you can check this in the [.nvmrc file](https://github.com/oceanprotocol/market/blob/main/.nvmrc).

Enter the following command to install the dependencies:

```bash
npm install
```

This command will take a few minutes to complete and you’ll see some warnings as it runs (no need to worry about the warnings).

## Run your Market fork for the first time

At this point, you are ready to run your data marketplace for the first time. This is another straightforward step that requires just one command:

```bash
npm start
```

The above command will build the development bundle and run it locally.

## Great Job!

Your marketplace has successfully been built and is now running locally. Let’s check it out! Open your browser and navigate to http://localhost:8000/. You’ll see that you have a full-on clone of Ocean Market running locally. Give it a go and test out publishing and consuming assets - everything works!

That’s all that’s required to get a clone of Ocean market working. The whole process is made simple because your clone can happily use all the smart contracts and backend components that are maintained by Ocean Protocol Foundation.

So you’ve got a fully functioning marketplace at this point, which is pretty cool. But it doesn’t really look like your marketplace. Right now, it’s still just a clone of Ocean Market - the same branding, name, logo, etc. The next few steps focus on personalizing your marketplace.
