module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "!**/__tests__/integration/**"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
