module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/test/**/*.test.(ts|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
