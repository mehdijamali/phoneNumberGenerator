import mongoose, { Document, Schema } from "mongoose";

interface PhoneNumber extends Document {
  countryCode: string;
  nationalNumber: string;
  countryCallingCode: string;
  isMobile?: boolean;
}

const PhoneNumberSchema: Schema = new Schema(
  {
    countryCode: { type: String, required: true, index: { unique: true } },
    nationalNumber: { type: String, required: true, index: { unique: true } },
    countryCallingCode: { type: String, required: true },
    isMobile: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const PhoneNumberModel = mongoose.model<PhoneNumber>(
  "PhoneNumber",
  PhoneNumberSchema
);
export default PhoneNumberModel;
