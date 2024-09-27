const aws = require("aws-sdk");

/**
 * Module that returns S3 service object
 * @module s3
 * @typedef aws.s3
 */
module.exports = new aws.SESV2({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
  apiVersion: "2019-09-27",
});