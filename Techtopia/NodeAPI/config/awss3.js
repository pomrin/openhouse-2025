const AWS = require('aws-sdk');
var path = require('path');

require('dotenv').config();

const initBucket = () => {
  if (!checkBucketExists(process.env.S3_BUCKET_NAME)) {
    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_KEY,
    });
    // Bucket does not exist
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: 'ap-southeast-1',
      },
    };

    s3.createBucket(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log('Bucket Created Successfully', data.Location);
      }
    });
  } else {
    console.log('Bucket already exist!');
  }
};

const checkBucketExists = async (bucket) => {
  if (process.env.NODE_ENV === 'production') {
    const s3 = new AWS.S3();
    const options = {
      Bucket: bucket,
    };
    try {
      await s3.headBucket(options).promise();
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  } else {
    // Always return true for development
    return true;
  }
};

const uploadFile = (fileContent, awsFolder, awsFileName) => {
  if (process.env.NODE_ENV === 'production') {
    // Save to S3

    const s3 = new AWS.S3();
    // Read content from the file
    // const fileContent = fs.readFileSync(fileName);

    let imageFullPath = path.join(awsFolder, awsFileName);
    imageFullPath = imageFullPath.replace(/\\/g, '/');

    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageFullPath, // File name you want to save as in S3
      Body: fileContent,
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });
  } else if (process.env.NODE_ENV === 'staging') {
    // Save to S3
  } else {
    // TODO: Save to local folder
  }
};

module.exports = {
  initBucket,
  uploadFile,
  // anotherMethod
};
