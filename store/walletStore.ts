import { create } from "zustand";

type WalletState = {
  nickname: string;
  maskedAccount: string;
  error: string;
  trpcData: {
    displayName: string;
    methodOfPayment: string;
    requestId: string;
    routingNumber: string;
    accountNumber: string;
    accountNickname?: string;
  } | null;

  setWalletData: (nickname: string, masked: string) => void;
  setTrpcData: (data: WalletState["trpcData"]) => void;
  setError: (message: string) => void;
  clearWalletData: () => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  nickname: "",
  maskedAccount: "",
  error: "",
  trpcData: null,

  setWalletData: (nickname, masked) =>
    set({
      nickname,
      maskedAccount: masked,
      error: "",
    }),

  setTrpcData: (data) =>
    set({
      trpcData: data,
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
      trpcData: null,
    }),
}));
