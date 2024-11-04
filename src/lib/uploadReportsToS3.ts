// import 'dotenv/config';
// import AWS from 'aws-sdk';
// import fs from 'fs';
// import path from 'path';

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_DEFAULT_REGION, 
// });

// const s3 = new AWS.S3();
// const rootDir = path.resolve(__dirname, '..', '..');
// const reportPaths = {
//   html: path.join(rootDir, 'test-reports', 'html-report', 'report.html'),
//   junit: path.join(rootDir, 'test-reports', 'junit', 'junit-report.xml'),
//   coverage: path.join(rootDir, 'coverage', 'lcov-report', 'index.html'),
//   stare: path.join(rootDir, 'test-reports', 'jest-stare', 'index.html'),
// };

// async function uploadReportToS3(reportPath: string, key: string) {
//   const fileContent = fs.readFileSync(reportPath);

//   const params = {
//     Bucket: 'jest-report', 
//     Key: key,
//     Body: fileContent,
//     ContentType: 'text/html',
//   };

//   try {
//     await s3.upload(params).promise();
//     console.log(`Uploaded ${key} to S3`);
//   } catch (error) {
//     console.error(`Failed to upload ${key}: ${(error as Error).message}`);
//   }
// }

// (async () => {
//   for (const [type, filePath] of Object.entries(reportPaths)) {
//     if (fs.existsSync(filePath)) {
//       await uploadReportToS3(filePath, `reports/${type}/report-${new Date().toISOString()}.html`);
//     } else {
//       console.warn(`Report not found at ${filePath}`);
//     }
//   }
// })();





import 'dotenv/config';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION, 
});

const s3 = new AWS.S3();
const rootDir = path.resolve(__dirname, '..', '..');
const reportPaths = {
  html: path.join(rootDir, 'test-reports', 'html-report', 'report.html'),
  junit: path.join(rootDir, 'test-reports', 'junit', 'junit-report.xml'),
  coverage: path.join(rootDir, 'coverage', 'lcov-report', 'index.html'),
  stare: path.join(rootDir, 'test-reports', 'jest-stare', 'index.html'),
};

async function uploadReportToS3(reportPath: string, key: string) {
  const fileContent = fs.readFileSync(reportPath);

  const params = {
    Bucket: 'jest-report', 
    Key: key,
    Body: fileContent,
    ContentType: 'text/html',
  };

  try {
    await s3.upload(params).promise();
    console.log(`Uploaded ${key} to S3`);

    // Generate a signed URL for the uploaded file
    const signedUrl = await generateSignedUrl('jest-report', key);
    console.log(`Signed URL for ${key}:`, signedUrl);

    return signedUrl; // Return the signed URL if needed
  } catch (error) {
    console.error(`Failed to upload ${key}: ${(error as Error).message}`);
  }
}

async function generateSignedUrl(bucketName: string, objectKey: string): Promise<string | undefined> {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 120 // URL expires in 60 seconds
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for ${objectKey}: ${(error as Error).message}`);
  }
}

(async () => {
  for (const [type, filePath] of Object.entries(reportPaths)) {
    if (fs.existsSync(filePath)) {
      const key = `reports/${type}/report-${new Date().toISOString()}.html`;
      const signedUrl = await uploadReportToS3(filePath, key);
      if (signedUrl) {
        console.log(`Access your report here: ${signedUrl}`);
      }
    } else {
      console.warn(`Report not found at ${filePath}`);
    }
  }
})();
