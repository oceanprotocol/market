# Remove liquidity from deprecated Ocean Market v4 pools via Etherscan

## Get your balance of pool share tokens

1. Go to the pool's Etherscan/Polygonscan page. To find it without UI, see through your latest transactions and look for Ocean Pool Token (OPT) transfers. Those transactions always come from the pool contract.
2. On the pool contract page, go to _Contract_ -> _Read Contract_.
3. Go to field `20. balanceOf` and insert your ETH address. This will retrieve your pool share token balance.
4. To convert to wei, go to [eth-converter.com](https://eth-converter.com) and input the retrieved pool shares number in the _Ether_ field
5. Use the converted wei number as value for `poolAmountIn` when exiting the pool

## Get maximum to remove

1. Go to the pool's Etherscan/Polygonscan page.
2. Go to _Contract_ -> _Read Contract_.
3. Go to field `56. totalSupply` to get the total amopunt of pool shares, in wei.
4. Divide the number by 2 to get the maximum of pool shares you can send in one pool exit transaction. If your number retrieved in former step is bigger, you have to send multiple transactions.

## Exit pool

1. Go to the pool's Etherscan/Polygonscan page.
2. Go to _Contract_ -> _Write Contract_ and connect your wallet. Be sure to have your wallet connected to network of the pool.
3. For `poolAmountIn` add your pool shares in wei
4. For `minAmountOut` use anything, like `1`
5. Hit _Write_
