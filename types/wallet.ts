export type WalletLabels = {
  title: string;
  body: string;
  accountLabel: string;
  routingLabel: string;
  nicknameLabel: string;
  accountTypeLabel: string;
  accountType: {
    savingsAccountLabel: string;
    currentAccountLabel: string;
  };
  termsAndConditionsCheckbox: boolean;
  termsAndConditionsModal: {
    heading: string;
    body: string;
    closeButtonLabel: string;
  };
  submitButton: string;
};

export type SaveWalletPayload = {
  accountNumber: string;
  routingNumber: string;
  nickname: string;
};

export type SaveWalletResponse = {
  nickname: string;
  maskedAccount: string;
};
