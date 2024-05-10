import {
  CountryCode,
  NationalNumber,
  parsePhoneNumberFromString,
  CountryCallingCode,
} from "libphonenumber-js";

export function getPhoneNumberMetadata(phoneNumber: number) {
  const number = parsePhoneNumberFromString(String(`+${phoneNumber}`));
  const isValid = number?.isValid();

  if (!isValid) return null;

  const result: {
    country: CountryCode | undefined;
    nationalNumber: NationalNumber | undefined;
    countryCallingCode: CountryCallingCode | undefined;
    isMobile?: boolean;
  } = {
    country: number?.country,
    countryCallingCode: number?.countryCallingCode,
    nationalNumber: number?.nationalNumber,
  };
  if (number?.country) {
    if (number?.country === "NL") {
      result["isMobile"] = isMobile(
        String(number?.nationalNumber),
        number?.country
      );
    }
  }

  return result;
}

export function isMobile(number: string, countryCode: CountryCode) {
  if (countryCode === "NL") {
    if (number[0] === "0") number = number.substring(1);
    if (number.length < 9) return false;
    const prefix = Number(number.substring(0, 2));
    if (prefix <= 65 && prefix >= 61) return true;
    return false;
  }
  return false;
}

export default { isMobile, getPhoneNumberMetadata };
