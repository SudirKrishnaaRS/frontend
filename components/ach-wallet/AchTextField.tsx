import { ChangeEvent } from "react";

type AchTextFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optionalText?: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  hint?: string;
  error?: string;
  type?: "text" | "email" | "password";
  inputMode?: "text" | "numeric" | "email";
  maxLength?: number;
  autoComplete?: string;
};

export default function AchTextField({
  id,
  label,
  required = false,
  optionalText,
  placeholder,
  value,
  onChange,
  onBlur,
  hint,
  error,
  type = "text",
  inputMode = "text",
  maxLength,
  autoComplete,
}: AchTextFieldProps) {
  const messageId = `${id}-hint`;

  return (
    <div className="space-y-[6px]">
      <div className="flex items-center gap-1">
        <label
          className="text-sm font-semibold leading-[1.2] text-[#161d25]"
          htmlFor={id}
        >
          {label}
          {required ? "*" : ""}
        </label>
        {optionalText ? (
          <span className="text-sm leading-[1.2] text-[#808080]">
            {optionalText}
          </span>
        ) : null}
      </div>

      <input
        aria-describedby={hint || error ? messageId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className={`w-full rounded-[8px] border bg-white px-[14px] py-[10px] text-base leading-[1.4] text-[#161d25] shadow-[0_1px_2px_rgba(16,24,40,0.05)] placeholder:text-[#808080] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#152644]/20 ${
          error
            ? "border-[#b42318] focus:border-[#b42318]"
            : "border-[#cccccc] focus:border-[#152644]"
        }`}
        id={id}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        type={type}
        value={value}
      />

      {hint || error ? (
        <p
          className={`text-sm leading-[1.2] ${
            error ? "text-[#b42318]" : "text-[#4d4d4d]"
          }`}
          id={messageId}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
