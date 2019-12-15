module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/tests/.*|(\\.|/)(test|spec))\\.(tsx|ts)?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "moduleNameMapper": {
    "\\.(css|styl)$": "identity-obj-proxy",
    "^api(.*)$": "<rootDir>/src/api$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^const(.*)$": "<rootDir>/src/const$1"
  },
  "clearMocks": true,
  "collectCoverage": true,
  "coverageReporters": ["html"],
  "verbose": true,
}
