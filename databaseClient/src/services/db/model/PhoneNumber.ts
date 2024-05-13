import mongoose, { Document, Schema } from "mongoose";

interface PhoneNumber extends Document {
  countryCode: string;
  nationalNumber: string;
  countryCallingCode: string;
  isMobile?: boolean;
}

const PhoneNumberSchema = new Schema(
  {
    countryCode: { type: String, required: true, index: true },
    nationalNumber: { type: String, required: true },
    countryCallingCode: { type: String, required: true },
    isMobile: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

PhoneNumberSchema.index(
  { countryCallingCode: 1, nationalNumber: 1 },
  { unique: true }
);

const PhoneNumberModel = mongoose.model<PhoneNumber>(
  "PhoneNumber",
  PhoneNumberSchema
);
export default PhoneNumberModel;
