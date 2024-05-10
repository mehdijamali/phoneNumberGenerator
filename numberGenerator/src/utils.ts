import { parsePhoneNumberFromString } from "libphonenumber-js";

export function generateRandomPhoneNumbers(): number {
  const min = 10_000_000_000;
  const max = 999_999_999_999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

export function generateValidPhoneNumbers() {
  let isValid = false;
  let phoneNumber = null;

  do {
    phoneNumber = parsePhoneNumberFromString(
      String(`+${generateRandomPhoneNumbers()}`)
    );

    isValid = Boolean(
      phoneNumber?.isValid() &&
        phoneNumber?.countryCallingCode &&
        phoneNumber.country
    );
  } while (!isValid);

  return `${phoneNumber?.countryCallingCode}${phoneNumber?.nationalNumber}`;
}

export default { generateRandomPhoneNumbers, generateValidPhoneNumbers };
