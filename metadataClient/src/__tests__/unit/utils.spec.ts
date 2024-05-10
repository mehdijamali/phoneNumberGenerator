import { getPhoneNumberMetadata, isMobile } from "../../utils";

describe("getPhoneNumberMetadata", () => {
  it("should return null if phone number is not valid number", () => {
    const number = getPhoneNumberMetadata(111);
    expect(number).toBeNull();
  });
  it("should return null if the phone number is not valid phone number", () => {
    const number = getPhoneNumberMetadata(748315560721);
    expect(number).toBeNull();
  });
  it("should return correct meta data for a valid number", () => {
    const number = getPhoneNumberMetadata(31642420290);
    expect(number).toEqual({
      country: "NL",
      countryCallingCode: "31",
      nationalNumber: "642420290",
      isMobile: true,
    });
  });
  it("should detect correctly if a phone number is mobile phone for the Netherlands ", () => {
    const number = getPhoneNumberMetadata(31642420290);

    console.log(number);

    expect(number).toHaveProperty("isMobile");
    expect(number?.isMobile).toBeTruthy();
  });
  it("should detect correctly if a phone number is not mobile phone for the Netherlands ", () => {
    const number = getPhoneNumberMetadata(31104002911);
    expect(number).toHaveProperty("isMobile");
    expect(number?.isMobile).toBeFalsy();
  });
});

describe("isMobile", () => {
  describe("Netherlands - NL", () => {
    it("should return false if phone number is not valid number", () => {
      expect(isMobile("111", "NL")).toBeFalsy();
      expect(isMobile("611", "NL")).toBeFalsy();
    });

    it("should return false if phone number is not valid number", () => {
      expect(isMobile("642420290", "NL")).toBeTruthy();
      expect(isMobile("0642420290", "NL")).toBeTruthy();
    });
  });
});
