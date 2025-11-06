export default {
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>/tests", "<rootDir>"],
  testMatch: ["**/tests/**/*.js"],
  transform: {},

  // Coverage
  collectCoverage: true,
  collectCoverageFrom: ["./*.js", "utils/**/*.js"],
  coverageDirectory: "coverage"
};
