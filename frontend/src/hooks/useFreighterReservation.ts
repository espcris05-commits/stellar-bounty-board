import { useState } from "react";

// Freighter wallet types (injected by the Stellar Freighter browser extension)
declare global {
  interface Window {
    freighterApi?: {
      getPublicKey(): Promise<string>;
      signTransaction(xdr: string, opts?: { networkPassphrase?: string }): Promise<string>;
      isConnected(): Promise<{ isConnected: boolean }>;
      getUserInfo(): Promise<{ publicKey?: string }>;
    };
  }
}

export function useFreighterReservation(bountyId: string) {
  const [loading, setLoading] = useState(false);
  const [reserved, setReserved] = useState(false);

  const reserveWithFreighter = async () => {
    setLoading(true);
    try {
      const freighter = window.freighterApi;
      if (!freighter) throw new Error("Freighter wallet not installed");
      const key = await freighter.getPublicKey();
      setReserved(true);
      return { key, bountyId };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Freighter signing failed";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { reserveWithFreighter, loading, reserved };
}
