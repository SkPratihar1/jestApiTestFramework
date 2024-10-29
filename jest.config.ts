// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     testMatch: ['**/__tests__/**/*.test.ts'],
// reporters: [
//   'default',
//   ['jest-html-reporters', {
//     publicPath: '.html-report',
//     filename: 'report.html',
//     expand: true,
//   }]
// ],
//   };

// import type { Config } from '@jest/types';

// const config: Config.InitialOptions = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testMatch: ['**/__tests__/**/*.test.ts'],
//   reporters: [
//     'default',
//     [
//       'jest-html-reporters',
//       {
//         publicPath: '.html-report',
//         filename: 'report.html',
//         expand: true,
//       },
//     ],
//   ],
// };

// export default config;


import type { Config } from '@jest/types';

const isCI = process.env.CI === 'true';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  maxWorkers: isCI ? 2 : '50%',  // Parallelism for faster tests in CI/CD
  collectCoverage: true,          // Enable coverage reports
  coverageDirectory: './coverage',
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test-reports/html-report',
        filename: 'report.html',
        expand: true,
        pageTitle: 'Test Report',
        //logoImgPath: './path/to/logo.png',  // Optional logo for the report
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './test-reports/junit',
        outputName: 'junit-report.xml',
      },
    ],
    [
      'jest-stare',   // Optional, for more detailed HTML reports
      {
        resultDir: './test-reports/jest-stare',
        reportTitle: 'Detailed Jest Test Report',
        coverageLink: './coverage/lcov-report/index.html',
      },
    ],
  ],
  globals: {
    'ts-jest': {
      diagnostics: isCI ? false : true,  // Avoid diagnostics in CI to speed up
    },
  },
};

export default config;
