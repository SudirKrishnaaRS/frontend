"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { useWalletStore } from "@/store/walletStore";

export default function WalletForm() {
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  // Zustand Store
  const setWalletData = useWalletStore((state) => state.setWalletData);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);

    console.log(
      "first initial payload:",
      accountNumber,
      routingNumber,
      nickname
    );

    try {
      const res = await fetch("http://localhost:5000/api/wallet/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountNumber,
          routingNumber,
          nickname,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      console.log("first API response:", data);

      // Approach 1: To Pass the API response via Query Params
      // router.push(
      //   `/success?nickname=${data.nickname}&masked=${data.maskedAccount}`
      // );

      // Approach 2: Set the API response in the Zustand Store
      setWalletData(data.nickname, data.maskedAccount);
      router.push("/success");
    } catch (error) {
      alert("Failed to save wallet");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-4 w-96">
      <h1 className="text-xl font-bold text-gray-900">Save Wallet</h1>

      <input
        placeholder="Account Number"
        type="number"
        className="border p-2 w-full rounded text-gray-900"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />

      <input
        placeholder="Routing Number (10 digits)"
        type="number"
        className="border p-2 w-full rounded text-gray-900"
        value={routingNumber}
        onChange={(e) => setRoutingNumber(e.target.value)}
      />

      <input
        placeholder="Account Nickname"
        className="border p-2 w-full rounded text-gray-900"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        Save Wallet
      </button>
    </div>
  );
}
