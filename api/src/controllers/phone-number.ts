import PhoneNumberModel from "../models/PhoneNumberModel.js";

class PhoneNumbersController {
  async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
    const query = PhoneNumberModel.find()
      .sort({ _id: 1 })
      .skip(documentsToSkip);

    if (limitOfDocuments !== undefined) {
      query.limit(limitOfDocuments);
    }

    return query.exec();
  }

  async findAllByCountryCode(
    countryCode: string,
    documentsToSkip = 0,
    limitOfDocuments?: number,
    mobileOnly?: boolean
  ) {
    const queryObj: any = { countryCode };

    if (mobileOnly) {
      queryObj.isMobile = true;
    }

    const query = PhoneNumberModel.find(queryObj)
      .sort({ _id: 1 })
      .skip(documentsToSkip);

    if (limitOfDocuments !== undefined) {
      query.limit(limitOfDocuments);
    }

    return query.exec();
  }

  async countByCountryCode(
    countryCode: string,
    mobileOnly: boolean
  ): Promise<number> {
    const queryObj = { countryCode, isMobile: mobileOnly };
    return PhoneNumberModel.countDocuments(queryObj);
  }
}

export default new PhoneNumbersController();
