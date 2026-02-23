import { create } from "zustand";

type WalletState = {
  nickname: string;
  maskedAccount: string;
  error: string;

  setWalletData: (nickname: string, masked: string) => void;
  setError: (message: string) => void;
  clearWalletData: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  nickname: "",
  maskedAccount: "",
  error: "",

  setWalletData: (nickname, masked) =>
    set({
      nickname,
      maskedAccount: masked,
      error: "",
    }),

  setError: (message) =>
    set({
      error: message,
    }),

  clearWalletData: () =>
    set({
      nickname: "",
      maskedAccount: "",
      error: "",
    }),
}));
