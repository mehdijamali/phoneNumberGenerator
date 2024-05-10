import dotenv from "dotenv";
import { connect } from "./connection";
import PhoneNumber from "./model/PhoneNumber";
import { PhoneNumberMetaData } from "../types";

dotenv?.config();

const DB_URI =
  process.env.MONGO_DB_URI || "mongodb://api_user:api_password@localhost:27018";
const DB_NAME = process.env.MONGO_DB_NAME || "phoneNumbers";
export async function storeData(request: PhoneNumberMetaData): Promise<void> {
  await connect(DB_URI, DB_NAME);

  const data: {
    countryCode: string;
    nationalNumber: string;
    countryCallingCode: string;
    isMobile?: boolean;
  } = {
    countryCode: request?.metadata.country,
    nationalNumber: request?.metadata.nationalNumber,
    countryCallingCode: request?.metadata.countryCallingCode,
  };
  try {
    if (request?.metadata.isMobile) data["isMobile"] = true;

    await PhoneNumber.create(data);

    console.log(`Database Client - Data Persisted for ${request.requestId}`);
  } catch (error) {
    console.log("error", error);

    console.log(
      `Database Client - An error has happened in persisting data for ${request.requestId}`
    );
  }
}

export default { storeData };
