"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/walletStore";
import AchActionButton from "./AchActionButton";
import { CloseIcon, LandmarkIcon } from "./AchIcons";
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
    <section className="w-full max-w-[480px] border-t border-[#e5e5e5] bg-white p-6 shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]">
      <header className="relative flex min-h-14 items-start justify-between">
        <div className="space-y-1 pr-10">
          <h1 className="text-[18px] font-bold leading-[1.2] text-[#161d25]">
            Select Payment Method
          </h1>
          <p className="text-xs leading-4 text-[#4d4d4d]">
            Choose your preferred payment method, then add your payment details
            below.
          </p>
        </div>

        <button
          aria-label="Close ACH wallet form"
          className="absolute right-0 top-0 rounded-[2px] p-1 text-[#161d25] transition-colors duration-150 hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152644]/40"
          onClick={handleClose}
          type="button"
        >
          <CloseIcon className="size-4" />
        </button>
      </header>

      <div className="mt-4 rounded-[6px] border border-[#e5e5e5] bg-white">
        <div className="flex h-12 items-center bg-[rgba(159,219,237,0.25)] px-6 py-4">
          <p className="text-sm font-semibold leading-[1.2] text-[#152644]">
            Payment method will be applied to Daniels Aviation
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mx-auto w-full max-w-[384px] space-y-8">
            {/* Accoount Type */}
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

            {/* Routing Number */}
            <div className="space-y-4">
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

              {/* Account Number*/}
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

              {/* Confirm Account Number*/}
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

              {/* Account Nickname */}
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

      <footer className="mt-4 flex flex-col gap-4">
        <AchActionButton
          disabled={isSubmitting || !isFormValid}
          // leadingIcon={<LandmarkIcon className="size-6" />}
          onClick={handleSubmit}
          type="button"
          variant="primary"
        >
          {isSubmitting ? "Adding..." : "Add Payment Method"}
        </AchActionButton>

        <AchActionButton
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
