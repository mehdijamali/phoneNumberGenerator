import mongoose from "mongoose";
import { connect, disconnect } from "../../services/db/connection";
import PhoneNumber from "../../services/db/model/PhoneNumber";
import { storeData } from "../../services/db/service";

describe("storeData Integration Test", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await PhoneNumber.deleteMany({});
  });

  test("should store data correctly in MongoDB", async () => {
    const request = {
      id: "test-id-1",
      country: "NL",
      nationalNumber: "642420290",
      countryCallingCode: "31",
      isMobile: true,
    };

    await storeData(request);

    const storedData = await PhoneNumber.findOne({
      countryCode: request.country,
      nationalNumber: request.nationalNumber,
    });

    expect(storedData).toBeTruthy();
    expect(storedData?.countryCode).toEqual(request.country);
    expect(storedData?.nationalNumber).toEqual(request.nationalNumber);
    expect(storedData?.countryCallingCode).toEqual(request.countryCallingCode);
    expect(storedData?.isMobile).toBe(true);
  });
});
