import {
  generateValidPhoneNumbers,
  generateRandomPhoneNumbers,
} from "../../src/utils.ts";

describe("getRandomPhoneNumbers", () => {
  it("should generate a valid phone number as a number", () => {
    const phoneNumberNumeric = generateRandomPhoneNumbers();

    expect(phoneNumberNumeric).toBeDefined();

    expect(phoneNumberNumeric).toBeLessThanOrEqual(999_999_999_999);
    expect(phoneNumberNumeric).toBeGreaterThanOrEqual(10_000_000_000);
  });
});

describe("generateValidPhoneNumbers", () => {
  it("should return a valid phone number", () => {
    const number = generateValidPhoneNumbers();

    console.log(number);
  });
});
