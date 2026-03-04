export default function CheckExampleCard() {
  return (
    <div className="rounded-[8px] p-6">
      <div className="space-y-2 text-center">
        <p className="text-sm leading-5 text-[#737373]">
          Example of routing number and account number found at the bottom of a
          check
        </p>

        <div className="space-y-[6px]">
          <div className="flex h-12 items-center justify-center bg-[#e2e8f0] px-2">
            <p className="font-mono text-2xl leading-[1.2] text-[#152644]">
              a012200345A 12345678C 1010
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-xs leading-4 text-[#152644]">
            <div className="space-y-1">
              <div className="border-t border-[#152644]" />
              <p>Routing Number</p>
            </div>
            <div className="space-y-1">
              <div className="border-t border-[#152644]" />
              <p>Account Number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
