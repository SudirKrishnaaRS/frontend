"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useCMSContent } from "@/hooks/useCMSContent";
import { SuccessLabels } from "@/types/success";
import Loader from "@/components/Loader";

export default function SuccessPage() {
  // Custom Hook: To fetch the labels from Strapi CMS
  const {
    data: labels,
    loading: CMSLoading,
    error,
  } = useCMSContent<SuccessLabels>("/api/success-pages");

  const nickname = useWalletStore((state) => state.nickname);
  const masked = useWalletStore((state) => state.maskedAccount);

  const router = useRouter();

  useEffect(() => {
    if (!nickname || !masked) {
      router.push("/wallet");
    }
  }, [nickname, masked, router]);

  if (CMSLoading) return <Loader loaderContent={"loading..."} />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-green-600">{labels?.title}</h1>

        <div className="space-y-2">
          <p className="text-lg text-gray-900">
            <span className="font-semibold">{`${labels?.nicknameLabel} : `}</span>{" "}
            {nickname}
          </p>

          <p className="text-lg text-gray-900">
            <span className="font-semibold">{`${labels?.accountLabel} : `}</span>{" "}
            {masked}
          </p>
        </div>
      </div>
    </div>
  );
}
