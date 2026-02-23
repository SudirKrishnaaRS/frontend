"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { useWalletStore } from "@/store/walletStore";
import { useCMSContent } from "@/hooks/useCMSContent";
import { WalletLabels } from "@/types/wallet";

export default function WalletForm() {
  // To fetch the labels from Strapi CMS
  const {
    data: labels,
    loading: CMSLoading,
    error,
  } = useCMSContent<WalletLabels>("/api/wallet-labels");

  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  // Zustand Store
  const setWalletData = useWalletStore((state) => state.setWalletData);
  const setError = useWalletStore((state) => state.setError);

  const router = useRouter();

  console.log("first CMS Lables:", labels);

  const handleSubmit = async () => {
    setLoading(true);

    console.log(
      "first initial payload:",
      accountNumber,
      routingNumber,
      nickname
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountNumber,
            routingNumber,
            nickname,
          }),
        }
      );

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      console.log("first API response:", data);

      //  Set the API response in the Zustand Store
      setWalletData(data.nickname, data.maskedAccount);
      router.push("/success");
    } catch (error) {
      setError("Failed to save wallet. Please try again.");
      router.push("/error");
    } finally {
      setLoading(false);
    }
  };

  if (loading || CMSLoading) return <Loader />;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-4 w-96">
      <h1 className="text-xl font-bold text-gray-900">{labels?.title}</h1>

      <p className="text-gray-900">{labels?.body}</p>

      <label htmlFor="accountNumber" className="text-gray-900 text-l">
        {labels?.accountLabel}
      </label>
      <input
        placeholder=" enter account Number"
        id="accountNumber"
        type="number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="border p-2 w-full rounded text-gray-900"
      />

      <label htmlFor="routingNumber" className="text-gray-900 text-l">
        {labels?.routingLabel}
      </label>
      <input
        placeholder="enter routing number"
        id="routingNumber"
        type="number"
        value={routingNumber}
        onChange={(e) => setRoutingNumber(e.target.value)}
        className="border p-2 w-full rounded text-gray-900"
      />

      <label htmlFor="accountNickname" className="text-gray-900 text-l">
        {labels?.nicknameLabel}
      </label>
      <input
        placeholder="enter account Nickname"
        id="accountNickname"
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="border p-2 w-full rounded text-gray-900"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {labels?.submitButton}
      </button>
    </div>
  );
}
