import { useState } from "react";

export function useFreighterReservation(bountyId: string) {
  const [loading, setLoading] = useState(false);
  const [reserved, setReserved] = useState(false);

  const reserveWithFreighter = async () => {
    setLoading(true);
    try {
      // @ts-ignore - Freighter injected
      const freighter = window.freighterApi;
      if (!freighter) throw new Error("Freighter wallet not installed");
      const key = await freighter.getPublicKey();
      setReserved(true);
      return { key, bountyId };
    } catch (e: any) {
      throw new Error(e.message || "Freighter signing failed");
    } finally {
      setLoading(false);
    }
  };

  return { reserveWithFreighter, loading, reserved };
}
