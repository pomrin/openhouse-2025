const { S3Client } = require('@aws-sdk/client-s3');

const credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
};

const config = {
  region: process.env.region,
  credentials
};

module.exports = new S3Client(config);
