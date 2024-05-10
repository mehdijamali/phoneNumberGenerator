import { connect, disconnect } from "../../services/db/connection.js";
import PhoneNumber from "../../services/db/model/PhoneNumber.js";
import { storeData } from "../../services/db/service.js";
import { PhoneNumberMetaData } from "../../services/types.js";

describe("storeData Integration Test", () => {
  beforeAll(async () => {
    await connect("1", "2");
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await PhoneNumber.deleteMany({});
  });

  test("should store data correctly in MongoDB", async () => {
    const request: PhoneNumberMetaData = {
      requestId: "test-id-1",
      phoneNumber: "31642420290",
      metadata: {
        country: "NL",
        nationalNumber: "642420290",
        countryCallingCode: "31",
        isMobile: true,
      },
    };

    await storeData(request);

    const storedData = await PhoneNumber.findOne({
      countryCode: request.metadata.country,
      nationalNumber: request.metadata.nationalNumber,
    });

    expect(storedData).toBeTruthy();
    expect(storedData?.countryCode).toEqual(request.metadata.country);
    expect(storedData?.nationalNumber).toEqual(request.metadata.nationalNumber);
    expect(storedData?.countryCallingCode).toEqual(
      request.metadata.countryCallingCode
    );
    expect(storedData?.isMobile).toBe(true);
  });
});
