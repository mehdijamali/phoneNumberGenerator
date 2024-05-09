import { Schema, model } from "mongoose";

export interface PhoneNumber {
  countryCode: string;
  nationalNumber: string;
  countryCallingCode: string;
  isMobile?: boolean;
}

const PhoneNumberSchema = new Schema<PhoneNumber>({
  countryCode: {
    type: String,
    required: true,
  },
  nationalNumber: {
    type: String,
    required: true,
  },
  countryCallingCode: {
    type: String,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: false,
  },
});

export default model<PhoneNumber>("PhoneNumber", PhoneNumberSchema);
