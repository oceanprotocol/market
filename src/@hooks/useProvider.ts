import { useAppKitProvider, useAppKitNetworkCore, Provider } from "@reown/appkit/react";
import { ethers } from "ethers";
import { useMemo } from "react";

export const useProvider = () => {
    const { walletProvider } = useAppKitProvider<Provider>("eip155");
    const { chainId } = useAppKitNetworkCore();

    const provider = useMemo(() => {
        if (!walletProvider || !chainId) return undefined;
        return new ethers.providers.Web3Provider(walletProvider, chainId);
    }, [walletProvider, chainId]);

    return provider
}