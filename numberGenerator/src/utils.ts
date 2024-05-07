export function getRandomPhoneNumbers(): number {
  const min = 10_000_000_000;
  const max = 999_999_999_999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

export default getRandomPhoneNumbers;
