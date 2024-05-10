module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["**/__tests__/integration/**/*.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  openHandlesTimeout: 15000,
  testTimeout: 20000,
};
