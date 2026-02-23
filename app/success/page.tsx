"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";

export default function SuccessPage() {
  const nickname = useWalletStore((state) => state.nickname);
  const masked = useWalletStore((state) => state.maskedAccount);

  const router = useRouter();

  useEffect(() => {
    if (!nickname || !masked) {
      router.push("/wallet");
    }
  }, [nickname, masked, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Wallet Saved Successfully 🎉
        </h1>

        <div className="space-y-2">
          <p className="text-lg text-gray-900">
            <span className="font-semibold">Nickname:</span> {nickname}
          </p>

          <p className="text-lg text-gray-900">
            <span className="font-semibold">Account:</span> {masked}
          </p>
        </div>
      </div>
    </div>
  );
}
