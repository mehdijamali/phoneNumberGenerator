import { connect, disconnect } from "../../services/db/connection";
import PhoneNumber from "../../services/db/model/PhoneNumber";
import { storeData } from "../../services/db/service";
import { PhoneNumberMetaData } from "../../services/types";

describe("storeData Integration Test", () => {
  const DB_URI = process.env.MONGO_DB_URI || "mongodb://localhost:27018";

  const DB_NAME = process.env.MONGO_DB_NAME || "phoneNumbers";
  beforeAll(async () => {
    await connect(DB_URI, DB_NAME);
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
