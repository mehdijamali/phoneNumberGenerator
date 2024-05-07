import { getRandomPhoneNumbers } from "./utils.ts";

describe("getRandomPhoneNumbers", () => {
  test("should generate a valid phone number as a number", () => {
    const phoneNumberNumeric = getRandomPhoneNumbers();

    expect(phoneNumberNumeric).toBeDefined();

    expect(phoneNumberNumeric).toBeLessThanOrEqual(999_999_999_999);
    expect(phoneNumberNumeric).toBeGreaterThanOrEqual(10_000_000_000);
  });
});
//
