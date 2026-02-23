import { create } from "zustand";

type WalletState = {
  nickname: string;
  maskedAccount: string;
  setWalletData: (nickname: string, masked: string) => void;
  clearWalletData: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  nickname: "",
  maskedAccount: "",

  setWalletData: (nickname, masked) =>
    set({
      nickname,
      maskedAccount: masked,
    }),

  clearWalletData: () =>
    set({
      nickname: "",
      maskedAccount: "",
    }),
}));
