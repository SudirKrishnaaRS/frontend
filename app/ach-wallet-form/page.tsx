import ACHWalletForm from "@/components/ach-wallet/ACHWalletForm";

export default function AchWalletFormPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-4 sm:px-8 sm:py-8">
      <div className="mx-auto w-full max-w-[932px]">
        <ACHWalletForm />
      </div>
    </main>
  );
}
