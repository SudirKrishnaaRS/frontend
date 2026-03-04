export type AchAccountType = "checking" | "savings";

export type AchWalletFormValues = {
  accountType: AchAccountType;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountNickname: string;
};

export type AchWalletFormErrors = Partial<
  Record<keyof Omit<AchWalletFormValues, "accountType">, string>
>;

export const sanitizeDigits = (value: string) => value.replace(/\D/g, "");

export function validateAchWalletForm(
  values: AchWalletFormValues
): AchWalletFormErrors {
  const errors: AchWalletFormErrors = {};

  if (!/^\d{9}$/.test(values.routingNumber)) {
    errors.routingNumber = "Enter a valid 9-digit bank routing number";
  }

  if (!/^\d{4,17}$/.test(values.accountNumber)) {
    errors.accountNumber = "Account number must be between 4 and 17 digits.";
  }

  if (!values.confirmAccountNumber) {
    errors.confirmAccountNumber = "Please confirm your account number.";
  } else if (values.accountNumber !== values.confirmAccountNumber) {
    errors.confirmAccountNumber =
      "Account numbers do not match.Please try again.";
  }

  if (values.accountNickname.length > 40) {
    errors.accountNickname = "Nickname must be 40 characters or fewer.";
  }

  return errors;
}
