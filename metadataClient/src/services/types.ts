export type PhoneNumberMetaData = {
  requestId: string;
  phoneNumber: string;
  metadata: {
    country: string;
    nationalNumber: string;
    countryCallingCode: string;
    isMobile?: boolean;
  };
};
