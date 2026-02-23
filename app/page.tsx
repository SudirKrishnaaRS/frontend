"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Digital Wallet POC</h1>

      <button
        className="bg-cyan-900 text-white px-4 py-2 rounded"
        onClick={() => router.push("/wallet")}
      >
        Take me to the wallet
      </button>
    </main>
  );
}
