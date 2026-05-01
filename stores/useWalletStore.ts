import { create } from "zustand";
import { WalletStore } from "@/lib/types";

export const useWalletStore = create<WalletStore>((set) => ({
  balance: null,
  network: "devnet",
  setBalance: (balance) => set({ balance }),
  setNetwork: (network) => set({ network }),
}));
