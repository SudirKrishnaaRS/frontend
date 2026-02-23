"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();

  const nickname = params.get("nickname");
  const masked = params.get("masked");

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Wallet Saved Successfully 🎉
        </h1>

        <div className="space-y-2">
          <p className="text-lg">
            <span className="font-semibold">Nickname:</span> {nickname}
          </p>

          <p className="text-lg">
            <span className="font-semibold">Account:</span> {masked}
          </p>
        </div>
      </div>
    </div>
  );
}
