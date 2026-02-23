"use client";

import { useWalletStore } from "@/store/walletStore";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const error = useWalletStore((state) => state.error);
  const clearWalletData = useWalletStore((state) => state.clearWalletData);

  const router = useRouter();

  const handleRetry = () => {
    clearWalletData();
    router.push("/wallet");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Something Went Wrong ❌
        </h1>

        <p className="text-lg text-gray-700">
          {error || "An unexpected error occurred."}
        </p>

        <button
          onClick={handleRetry}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
