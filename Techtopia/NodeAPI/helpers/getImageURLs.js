
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
var path = require('path');


const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_BUCKET_USER_IMAGE_FOLDER = `user_profile/`;
// const S3_AWS_REGION = process.env.AWS_REGION;
// const S3_BUCKET_BASE_PATH = `https://${S3_BUCKET_NAME}.s3.${S3_AWS_REGION}.amazonaws.com/`;


async function saveBase64ToTmp(base64file, folderPath, fileName, fileExt) {
  try {
    // const format = base64file.substring(base64file.indexOf('data:') + 5, base64file.indexOf(';base64'));
    // const base64String = base64file.replace(/^data:image\/\w+;base64,/, '');
    // console.log(`base64String: ${base64String}`);
    const buff = Buffer.from(base64file, 'base64');

    // console.log(`buff: ${buff}`);

    // var file_ext = format.replace(/^image\//, '');
    const formatted_filename = `${fileName}.${fileExt}`;
    // console.log(`file_name: ${formatted_filename}`);

    let imageFullPath = path.join(folderPath, formatted_filename);
    imageFullPath = imageFullPath.replace(/\\/g, '/');
    // console.log(`imageFullPath: ${imageFullPath}`);

    // const params = {
    //   Bucket: S3_BUCKET_NAME,
    //   Key: imageFullPath,
    //   Body: buff,
    //   // ACL: "public-read",
    //   ContentEncoding: 'base64',
    //   ContentType: format
    // };

    // // console.log(`params: ${JSON.stringify(params)}`);

    // const stored = await s3.upload(params).promise();

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: imageFullPath,
      Body: buff,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
      ContentDisposition: 'inline'
    });

    const response = await s3.send(command);
    console.log(`S3 PutObjectCOmmand Response: ${response}`);


    // console.log(`Result: ${stored}`);
    // return stored.Location;
    // console.log(`Upload successful temp: ${JSON.stringify(uploadResult)}`);
    // console.log(`Location: ${JSON.stringify(uploadResult.Location)}`);
  } catch (ex) {
    console.error(`Uploading to S3 failed - ${ex}`);
  }
}
module.exports.saveBase64ToTmp = saveBase64ToTmp;

async function saveBase64UserImage(base64file, ticketId, fileExt) {
  // const format = "YYYY-MM-DD-HHmmss";
  // let currentDateTime = new Date();
  // let dateTimeString = moment(currentDateTime).format(format);
  let fileName = `cartoonprofile`;
  let userTicketFolder = path.join(S3_BUCKET_USER_IMAGE_FOLDER, `${ticketId}/`);
  // console.log(`vehicleTempFolder: ${vehicleTempFolder}`);
  return await saveBase64ToTmp(base64file, userTicketFolder, fileName, fileExt);
}
module.exports.saveBase64UserImage = saveBase64UserImage;
