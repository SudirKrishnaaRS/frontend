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
        className="grid w-full grid-cols-2 gap-2 rounded-[8px]"
        id={id}
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              aria-checked={isSelected}
              className={`h-10 rounded-[8px] border px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152644]/40 ${
                isSelected
                  ? "border-[#152644] bg-[#eff4fc] text-[#152644]"
                  : "border-[#cccccc] bg-white text-[#4d4d4d] hover:bg-[#f8fafc]"
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
