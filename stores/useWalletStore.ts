import { create } from "zustand";

interface WalletStore {
  balance: number | null;
  network: string;
  setBalance: (balance: number | null) => void;
  setNetwork: (network: string) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  balance: null,
  network: "devnet",
  setBalance: (balance) => set({ balance }),
  setNetwork: (network) => set({ network }),
}));
