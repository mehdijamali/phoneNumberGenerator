import dotenv from "dotenv";
import { connect } from "./connection";
import PhoneNumber from "./model/PhoneNumber";
import { PhoneNumberMetaData } from "../types";

dotenv?.config();

export async function storeData(request: PhoneNumberMetaData): Promise<void> {
  await connect();

  const data = {
    countryCode: request?.country,
    nationalNumber: request?.nationalNumber,
    countryCallingCode: request?.countryCallingCode,
  };
  try {
    if (request?.isMobile) data["isMobile"] = true;

    await PhoneNumber.create(data);

    console.log(`Database Client - Data Persisted for ${request.id}`);
  } catch (error) {
    console.log(
      `Database Client - An error has happened in persisting data for ${request.id}`
    );
  }
}

export default { storeData };
