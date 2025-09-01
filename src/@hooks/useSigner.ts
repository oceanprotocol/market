import { useAppKitAccount } from "@reown/appkit/react";
import { useProvider } from "./useProvider";
import { useMemo } from "react";

export const useSigner = () => {
    const provider = useProvider()
    const account = useAppKitAccount()

    // Wrap signer creation with useMemo
    const signer = useMemo(() => {
        if (!provider || !account.address) return null;
        return provider.getSigner(account.address);
    }, [provider, account.address]);

    return { signer }
}