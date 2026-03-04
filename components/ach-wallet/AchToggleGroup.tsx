import { AchAccountType } from "./achWalletValidation";

type AchToggleOption = {
  label: string;
  value: AchAccountType;
};

type AchToggleGroupProps = {
  id: string;
  label: string;
  options: AchToggleOption[];
  value: AchAccountType;
  onChange: (value: AchAccountType) => void;
};

export default function AchToggleGroup({
  id,
  label,
  options,
  value,
  onChange,
}: AchToggleGroupProps) {
  return (
    <div className="space-y-[6px]">
      <label
        className="block text-sm font-semibold leading-[1.2] text-[#161d25]"
        htmlFor={id}
      >
        {label}
      </label>

      <div
        aria-label={label}
        className="grid h-8 w-full grid-cols-2 overflow-hidden rounded-[8px] border border-[#9fa1a5] bg-[#f4f4f5]"
        id={id}
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          const isFirst = options[0]?.value === option.value;

          return (
            <button
              aria-checked={isSelected}
              className={`relative flex h-full items-center justify-center px-4 text-[14px] leading-none transition-colors duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152644]/35 ${
                isFirst ? "border-r border-[#9fa1a5]" : ""
              } ${
                isSelected
                  ? "bg-[#ececef] font-semibold text-[#22385e]"
                  : "bg-transparent font-medium text-[#22385e] hover:bg-[#ececef]"
              }`}
              key={option.value}
              onClick={() => onChange(option.value)}
              role="radio"
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
