# Deploying Marketplace

### Prerequisites

* A server for hosting Ocean Marketplace. 
* Obtain API key for wanted network.

### Push your customized Ocean Market code to your Git repository

In case you customized the Ocean Market using the tutorial from this chapter (link), push your code to a Git repository.

### Create a directory

```bash
mkdir my-marketplace
cd my-marketplace
```

### Create a file with the name \`.env\`

If you already created the .env file as instructed in ...(link to customize the market chapter), you can skip this step, otherwise copy the below content into the \`.env\` file.

{% code title=".env" overflow="wrap" %}
```bash
# Update this value if your Market should use custom Aquarius 
NEXT_PUBLIC_METADATACACHE_URI=https://v4.aquarius.oceanprotocol.com

# Provide INFURA project ID from the obtained API key for NEXT_PUBLIC_INFURA_PROJECT_ID
#NEXT_PUBLIC_INFURA_PROJECT_ID="xxx" 
#NEXT_PUBLIC_MARKET_FEE_ADDRESS="0xxx"
#NEXT_PUBLIC_PUBLISHER_MARKET_ORDER_FEE="1"
#NEXT_PUBLIC_CONSUME_MARKET_ORDER_FEE="1"
#NEXT_PUBLIC_CONSUME_MARKET_FIXED_SWAP_FEE="1"

#
# ADVANCED SETTINGS
#

# Toggle pricing options presented during price creation
#NEXT_PUBLIC_ALLOW_FIXED_PRICING="true"
#NEXT_PUBLIC_ALLOW_FREE_PRICING="true"

# Privacy Preference Center
#NEXT_PUBLIC_PRIVACY_PREFERENCE_CENTER="true"
```
{% endcode %}

### Create a \`Dockerfile\` file and copy the below content into it.

In the following Dockerfile, replace \<YOUR\_GIT\_REPO\_URL> with the url of your Ocean Market fork repository or use "https://github.com/oceanprotocol/market.git" if you want to deploy the standard image of Ocean Market.

<pre class="language-docker" data-title="Dockerfile"><code class="lang-docker">FROM node:16
<strong>RUN git clone &#x3C;YOUR_GIT_REPO_URL> /usr/app/market
</strong>WORKDIR /usr/app/market
RUN npm ci --legacy-peer-deps
RUN npm run build
EXPOSE 3000
CMD ["npx", "next", "start"]
</code></pre>

### Build a docker image

```bash
docker build . -f Dockerfile -t market:latest
```

### Start the marketplace

```bash
docker start market
```
