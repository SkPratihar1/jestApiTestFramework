import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const s3 = new AWS.S3();
const reportPaths = {
  html: path.join(__dirname, 'test-reports', 'html-report', 'report.html'),
  junit: path.join(__dirname, 'test-reports', 'junit', 'junit-report.xml'),
  coverage: path.join(__dirname, 'coverage', 'lcov-report', 'index.html'),
  stare: path.join(__dirname, 'test-reports', 'jest-stare', 'index.html'),
};

async function uploadReportToS3(reportPath: string, key: string) {
  const fileContent = fs.readFileSync(reportPath);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: key,
    Body: fileContent,
    ContentType: 'text/html',
  };

  try {
    await s3.upload(params).promise();
    console.log(`Uploaded ${key} to S3`);
  } catch (error) {
    console.error(`Failed to upload ${key}: ${(error as Error).message}`);
  }
}

(async () => {
  for (const [type, filePath] of Object.entries(reportPaths)) {
    if (fs.existsSync(filePath)) {
      await uploadReportToS3(filePath, `reports/${type}/report-${new Date().toISOString()}.html`);
    } else {
      console.warn(`Report not found at ${filePath}`);
    }
  }
})();
