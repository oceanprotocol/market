# Remove liquidity from deprecated Ocean Market v4 pools via Etherscan

## Get your balance of pool share tokens

1. Go to the pool's Etherscan/Polygonscan page. You can find it by inspecting your transactions on your account's Etherscan page under _Erc20 Token Txns_. 
2. Click _View All_ and look for Ocean Pool Token (OPT) transfers. Those transactions always come from the pool contract, which you can click on.
3. On the pool contract page, go to _Contract_ -> _Read Contract_.
4. Go to field `20. balanceOf` and insert your ETH address. This will retrieve your pool share token balance in wei.
5. Use this number as value for `poolAmountIn` when exiting the pool

## Get maximum to remove

1. Go to the pool's Etherscan/Polygonscan page.
2. Go to _Contract_ -> _Read Contract_.
3. Go to field `56. totalSupply` to get the total amopunt of pool shares, in wei.
4. Divide the number by 2 to get the maximum of pool shares you can send in one pool exit transaction. If your number retrieved in former step is bigger, you have to send multiple transactions.

## Exit pool

1. Go to the pool's Etherscan/Polygonscan page.
2. Go to _Contract_ -> _Write Contract_ and connect your wallet. Be sure to have your wallet connected to network of the pool.
3. Go to the field `5. exitswapPoolAmountIn`
4. For `poolAmountIn` add your pool shares in wei
5. For `minAmountOut` use anything, like `1`
6. Hit _Write_
