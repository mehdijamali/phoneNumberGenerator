module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/integration/**/*.ts"],
  openHandlesTimeout: 15000,
  testTimeout: 5000,
};
