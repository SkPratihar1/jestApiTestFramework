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

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: '.html-report',
        filename: 'report.html',
        expand: true,
      },
    ],
  ],
};

export default config;
