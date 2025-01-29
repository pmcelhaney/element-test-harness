// eslint-disable-next-line import/no-default-export, import/no-anonymous-default-export
export default {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  testEnvironment: "jsdom",
  coverageProvider: "v8",

  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/example/"],

  transform: {
    "^.+\\.(t|j|mj)s?$": "@swc/jest",
  },

  transformIgnorePatterns: [],
};
