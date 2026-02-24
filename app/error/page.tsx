"use client";

import { useCMSContent } from "@/hooks/useCMSContent";
import { useWalletStore } from "@/store/walletStore";
import { ErrorLabels } from "@/types/error";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  // Custom Hook: To fetch the labels from Strapi CMS
  const {
    data: labels,
    loading: CMSLoading,
    error: CMSError,
  } = useCMSContent<ErrorLabels>("/api/error-pages");

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
        <h1 className="text-2xl font-bold text-red-600">{labels?.title}</h1>

        <p className="text-lg text-gray-700">{error || labels?.body}</p>

        <button
          onClick={handleRetry}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          {labels?.buttonLabel}
        </button>
      </div>
    </div>
  );
}
