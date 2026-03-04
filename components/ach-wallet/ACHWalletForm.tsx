"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/walletStore";
import AchActionButton from "./AchActionButton";
import { CloseIcon } from "./AchIcons";
import AchTextField from "./AchTextField";
import AchToggleGroup from "./AchToggleGroup";
import CheckExampleCard from "./CheckExampleCard";
import {
  AchWalletFormErrors,
  AchWalletFormValues,
  sanitizeDigits,
  validateAchWalletForm,
} from "./achWalletValidation";

const INITIAL_FORM_VALUES: AchWalletFormValues = {
  accountType: "checking",
  routingNumber: "",
  accountNumber: "",
  confirmAccountNumber: "",
  accountNickname: "",
};

type FieldName = keyof Omit<AchWalletFormValues, "accountType">;

export default function ACHWalletForm() {
  const router = useRouter();
  const setWalletData = useWalletStore((state) => state.setWalletData);
  const setWalletError = useWalletStore((state) => state.setError);

  const [values, setValues] =
    useState<AchWalletFormValues>(INITIAL_FORM_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {}
  );
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => validateAchWalletForm(values), [values]);

  // Can be replaced by react-hook-form later
  const visibleErrors: AchWalletFormErrors = useMemo(
    () =>
      Object.entries(errors).reduce<AchWalletFormErrors>(
        (acc, [key, value]) => {
          if (touched[key as FieldName]) {
            acc[key as FieldName] = value;
          }
          return acc;
        },
        {}
      ),
    [errors, touched]
  );

  const isFormValid = Object.keys(errors).length === 0;

  const updateField = (name: FieldName, nextValue: string) => {
    setApiError("");
    setValues((prev) => ({ ...prev, [name]: nextValue }));
  };

  const markTouched = (name: FieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleClose = () => {
    router.push("/");
  };

  const handleCancel = () => {
    setValues(INITIAL_FORM_VALUES);
    setTouched({});
    setApiError("");
  };

  const markAllTouched = () => {
    setTouched({
      routingNumber: true,
      accountNumber: true,
      confirmAccountNumber: true,
      accountNickname: true,
    });
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      markAllTouched();
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const tokenRes = await fetch("/api/auth/token");
      if (!tokenRes.ok) {
        throw new Error("Failed to retrieve access token.");
      }

      const { token } = await tokenRes.json();

      const saveRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallet/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountNumber: values.accountNumber,
            routingNumber: values.routingNumber,
            nickname: values.accountNickname,
            accountType: values.accountType,
          }),
        }
      );

      if (!saveRes.ok) {
        throw new Error("Unable to save ACH payment details.");
      }

      const data: { nickname?: string; maskedAccount?: string } =
        await saveRes.json();

      if (!data.maskedAccount) {
        throw new Error("Masked account number missing from response.");
      }

      setWalletData(
        data.nickname || values.accountNickname || "ACH Account",
        data.maskedAccount
      );
      router.push("/success");
    } catch {
      const message = "Failed to save ACH details. Please try again.";
      setWalletError(message);
      setApiError(message);
      router.push("/error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto w-full max-w-[760px] bg-white">
      <header className="relative mb-4 px-10 pt-2 text-center lg:mb-5">
        <h1 className="text-[18px] font-bold leading-[1.2] text-[#161d25]">
          Select Payment Method
        </h1>
        <p className="mt-1 text-xs leading-4 text-[#4d4d4d]">
          Choose your preferred payment method, then add your payment details
          below.
        </p>

        <button
          aria-label="Close ACH wallet form"
          className="absolute right-0 top-0 flex size-[26px] items-center justify-center rounded-[2px] text-[#161d25] transition-colors duration-150 hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152644]/40"
          onClick={handleClose}
          type="button"
        >
          <CloseIcon className="size-4" />
        </button>
      </header>

      <div className="rounded-[4px] border border-[#e5e5e5] bg-white">
        <div className="flex min-h-12 items-center bg-[rgba(159,219,237,0.25)] px-4 py-3">
          <p className="text-sm font-semibold leading-[1.2] text-[#152644]">
            Payment method will be applied to Daniels Aviation
          </p>
        </div>

        <div className="px-4 py-4">
          <div className="space-y-5">
            <div className="w-full md:max-w-[224px]">
              <AchToggleGroup
                id="account-type"
                label="Account Type*"
                onChange={(nextValue) =>
                  setValues((prev) => ({ ...prev, accountType: nextValue }))
                }
                options={[
                  { label: "Checking", value: "checking" },
                  { label: "Savings", value: "savings" },
                ]}
                value={values.accountType}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <AchTextField
                error={visibleErrors.routingNumber}
                hint="E.g. 012200345"
                id="routingNumber"
                inputMode="numeric"
                label="Routing Number"
                maxLength={9}
                onChange={(event) =>
                  updateField(
                    "routingNumber",
                    sanitizeDigits(event.target.value).slice(0, 9)
                  )
                }
                onBlur={() => markTouched("routingNumber")}
                placeholder="Enter Routing Number"
                required
                value={values.routingNumber}
              />

              <AchTextField
                error={visibleErrors.accountNumber}
                hint="E.g. 12345678"
                id="accountNumber"
                inputMode="numeric"
                label="Account Number"
                maxLength={17}
                onChange={(event) =>
                  updateField(
                    "accountNumber",
                    sanitizeDigits(event.target.value).slice(0, 17)
                  )
                }
                onBlur={() => markTouched("accountNumber")}
                placeholder="Enter Account Number"
                required
                value={values.accountNumber}
              />

              <AchTextField
                error={visibleErrors.confirmAccountNumber}
                hint="E.g. 12345678"
                id="confirmAccountNumber"
                inputMode="numeric"
                label="Confirm Account Number"
                maxLength={17}
                onChange={(event) =>
                  updateField(
                    "confirmAccountNumber",
                    sanitizeDigits(event.target.value).slice(0, 17)
                  )
                }
                onBlur={() => markTouched("confirmAccountNumber")}
                placeholder="Enter Account Number"
                required
                value={values.confirmAccountNumber}
              />

              <AchTextField
                error={visibleErrors.accountNickname}
                id="accountNickname"
                label="Account Nickname"
                maxLength={40}
                onChange={(event) =>
                  updateField("accountNickname", event.target.value)
                }
                onBlur={() => markTouched("accountNickname")}
                optionalText="(optional)"
                placeholder="Enter Account Nickname"
                value={values.accountNickname}
              />
            </div>
          </div>

          {/* This is suppose to be an image which we will get from DAM */}
          <div className="mt-6">
            <CheckExampleCard />
          </div>
        </div>
      </div>

      {apiError ? (
        <p className="mt-3 text-sm leading-[1.2] text-[#b42318]">{apiError}</p>
      ) : null}

      <footer className="mt-3 flex flex-col gap-3 lg:flex-row lg:justify-end">
        <AchActionButton
          className="lg:w-[225px]"
          disabled={isSubmitting || !isFormValid}
          onClick={handleSubmit}
          type="button"
          variant="primary"
        >
          {isSubmitting ? "Adding..." : "Add Payment Method"}
        </AchActionButton>

        <AchActionButton
          className="lg:w-[179px]"
          onClick={handleCancel}
          type="button"
          variant="secondary"
        >
          Cancel
        </AchActionButton>
      </footer>
    </section>
  );
}
