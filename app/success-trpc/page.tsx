"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useCMSContent } from "@/hooks/useCMSContent";
import { SuccessLabels } from "@/types/success";
import Loader from "@/components/Loader";

export default function SuccessTrpcPage() {
  // Custom Hook: To fetch the labels from Strapi CMS
  const {
    data: labels,
    loading: CMSLoading,
    error,
  } = useCMSContent<SuccessLabels>("/api/success-pages");

  const trpcData = useWalletStore((state) => state.trpcData);

  const router = useRouter();

  useEffect(() => {
    if (!trpcData) {
      router.push("/wallet-trpc");
    }
  }, [trpcData, router]);

  if (CMSLoading) return <Loader loaderContent={"loading..."} />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-left w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-600 text-center">{labels?.title || "Success!"}</h1>

        <div className="space-y-4 mt-6">
          <p className="text-gray-700">
            Below are the full details received from the tRPC backend response layer:
          </p>

          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Display Name : </span> 
              {trpcData?.displayName}
            </p>

            <p className="text-sm text-gray-900">
              <span className="font-semibold">Request ID : </span> 
              {trpcData?.requestId}
            </p>

            <p className="text-sm text-gray-900">
              <span className="font-semibold">Method of Payment : </span> 
              {trpcData?.methodOfPayment}
            </p>

            <p className="text-sm text-gray-900">
              <span className="font-semibold">Routing Number : </span> 
              {trpcData?.routingNumber}
            </p>

            <p className="text-sm text-gray-900">
              <span className="font-semibold">Account Number (Masked) : </span> 
              {trpcData?.accountNumber}
            </p>

            {trpcData?.accountNickname && (
              <p className="text-sm text-gray-900">
                <span className="font-semibold">Account Nickname : </span> 
                {trpcData?.accountNickname}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
            <button onClick={() => router.push("http://sa.lvh.me:3001/wallet-dashboard")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Close
            </button>
        </div>
      </div>
    </div>
  );
}
