"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Loader";
import { useWalletStore } from "@/store/walletStore";
import { useCMSContent } from "@/hooks/useCMSContent";
import { WalletLabels } from "@/types/wallet";
import { trpc } from "../utils/trpc"; // 1. Import our configured tRPC hook

export default function WalletFormTrpc() {
  const {
    data: labels,
    loading: CMSLoading,
    error,
  } = useCMSContent<WalletLabels>("/api/wallet-labels");

  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [accountType, setAccountType] = useState("savings");
  const [acceptedTerms, setAcceptedTerms] = useState(
    labels?.termsAndConditionsCheckbox
  );

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const setWalletData = useWalletStore((state) => state.setWalletData);
  const setTrpcData = useWalletStore((state) => state.setTrpcData);
  const setError = useWalletStore((state) => state.setError);

  const router = useRouter();

  // 2. Initialize the tRPC useMutation hook for our specific endpoint
  // This automatically knows the input payload types and return output types defined in ach.ts backend!
  const submitFormMutation = trpc.ach.submitForm.useMutation();

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    setLoading(true);

    try {
      // 3. Make the backend call via tRPC instead of vanilla `fetch()`
      // We pass the exact payload matching our required `zod` object mapping from the backend endpoint:
      const data = await submitFormMutation.mutateAsync({
        accountType: accountType as "savings" | "checking",
        routingNumber,
        accountNumber,
        accountNickname: nickname,
        displayName: "Sudir Aviation" // hardcoded here based on curl request provided
      });

      // 4. Access perfectly-typed response data from the `data` variable.
      // E.g., data.displayName, data.accountNumber, etc. are 100% typed.
      setTrpcData(data);
      router.push("/success-trpc");
    } catch (error) {
      setError("Failed to save wallet. Please try again.");
      router.push("/error");
    } finally {
      setLoading(false);
    }
  };

  if (CMSLoading || loading)
    return (
      <Loader
        loaderContent={CMSLoading ? "loading..." : "Saving to wallet..."}
      />
    );

  return (
    <section className="p-6 bg-white shadow-md rounded-lg space-y-4 w-96">
      <h1 className="text-xl font-bold text-gray-900">{labels?.title}</h1>

      <p className="text-gray-900">{labels?.body}</p>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div>
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
      </div>

      <div>
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
      </div>

      <div>
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
      </div>

      <div>
        <label className="text-gray-900 font-medium">
          {labels?.accountTypeLabel}
        </label>

        <div className="flex gap-4 mt-2">
          <label className="text-gray-900">
            <input
              type="radio"
              value={labels?.accountType?.savingsAccountLabel}
              checked={accountType === labels?.accountType?.savingsAccountLabel}
              onChange={(e) => setAccountType(e.target.value)}
              className="mr-2"
            />
            {labels?.accountType?.savingsAccountLabel}
          </label>

          <label className="text-gray-900">
            <input
              type="radio"
              value={labels?.accountType?.currentAccountLabel}
              checked={accountType === labels?.accountType?.currentAccountLabel}
              onChange={(e) => setAccountType(e.target.value)}
              className="mr-2"
            />
            {labels?.accountType?.currentAccountLabel}
          </label>
        </div>
      </div>

      <div>
        <label className="text-gray-900">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
            className="mr-2"
          />
          I accept{" "}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-blue-600 underline"
          >
            {labels?.termsAndConditionsModal?.heading}
          </button>
        </label>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-gray-900 text-lg font-bold">
              {labels?.termsAndConditionsModal?.heading}
            </h2>

            <p className="text-gray-700 text-sm">
              {labels?.termsAndConditionsModal?.body}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded w-20"
            >
              {labels?.termsAndConditionsModal?.closeButtonLabel}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading || !acceptedTerms}
      >
        {labels?.submitButton}
      </button>
    </section>
  );
}
