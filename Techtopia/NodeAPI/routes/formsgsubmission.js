const {
    createLambdaResponse,
} = require("../helpers/common");

const S3OHImageBucketHelper = require('../helpers/getImageURLs');

const formsg = require('@opengovsg/formsg-sdk')({
    mode: 'production',
});

var path = require('path');
const Blob = require('buffer');
// const { Readable } = require("stream");
const { default: axios } = require("axios");
// const { blob } = require('node:stream/consumers');

// ##### Form SG
// This is where your domain is hosted, and should match
// the URI supplied to FormSG in the form dashboard
const POST_URI = process.env.FORM_SG_POST_URL;

// Your form's secret key downloaded from FormSG upon form creation
const formSecretKey = process.env.FORM_SECRET_KEY;

// Set to true if you need to download and decrypt attachments from submissions
const HAS_ATTACHMENTS = true;

// #### Cut Out Pro
const API_KEY_CUT_OUT_PRO = process.env.CUT_OUT_PRO_API;

module.exports.getRequest = async (event, context) => {
    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context:   ${JSON.stringify(context)}`);

    return createLambdaResponse(event, 200, 'Hello World Success!');
};

module.exports.postRequest = async (event, context) => {
    console.log(`API_KEY_CUT_OUT_PRO-  ${API_KEY_CUT_OUT_PRO}`);

    const eventBody = JSON.parse(event.body);
    const dataToParse = eventBody.data;

    // 1: Decrypt the various values from FormSG
    const formSgSignature = event.headers["X-FormSG-Signature"];
    console.log(`event.headers["X-FormSG-Signature"]: ${JSON.stringify(event.headers["X-FormSG-Signature"])}`);
    const authResult = formsg.webhooks.authenticate(formSgSignature, POST_URI);
    console.log(`authResult: ${authResult}`);

    const submissionWithAttachments = await formsg.crypto.decryptWithAttachments(formSecretKey, dataToParse);
    // console.log(`submissionWithAttachments: ${JSON.stringify(submissionWithAttachments)}`);
    // console.log(`submissionWithAttachments.content: ${JSON.stringify(submissionWithAttachments.content)}`);
    // console.log(`submissionWithAttachments.content.responses: ${JSON.stringify(submissionWithAttachments.content.responses)}`);
    // console.log(`submissionWithAttachments.content.responses[0]: ${JSON.stringify(submissionWithAttachments.content.responses[0])}`);
    const ticketId = submissionWithAttachments.content.responses[0].answer;
    console.log(`ticketId: ${ticketId}`);
    console.log(`submissionWithAttachments.content.responses[1]: ${JSON.stringify(submissionWithAttachments.content.responses[1])}`);
    const email = submissionWithAttachments.content.responses[1].answer;
    console.log(`email: ${email}`);
    console.log(`submissionWithAttachments.content.responses[2]: ${JSON.stringify(submissionWithAttachments.content.responses[2])}`);
    const visitorName = submissionWithAttachments.content.responses[2].answer;
    console.log(`visitorName: ${visitorName}`);
    console.log(`submissionWithAttachments.content.responses[3]: ${JSON.stringify(submissionWithAttachments.content.responses[3])}`);
    const photoInfo = submissionWithAttachments.content.responses[3].answer;
    console.log(`photoInfo: ${photoInfo}`);
    if (photoInfo) {
        const photoExt = path.extname(photoInfo)?.substring(1);
        console.log(`photoExt: ${photoExt}`);

        // console.log(`submissionWithAttachments.attachments: ${JSON.stringify(submissionWithAttachments.attachments)}`);
        // console.log(`submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"]: ${JSON.stringify(submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"])}`);
        // console.log(`submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content: ${JSON.stringify(submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content)}`);
        const imageBase64 = submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content;
        console.log(`imageBase64: ${JSON.stringify(imageBase64)}`);
        const test_blob = base64ToBlob(imageBase64, `image/${photoExt}`);
        const formData = new FormData();
        formData.append('file', test_blob, 'filename.png'); // Specify filename
        console.log(`${JSON.stringify(formData)}`);


        // const byteCharacters = Buffer.from(imageBase64, 'base64');
        // const stream = Readable.from(byteCharacters);
        // const file = await blob(stream);

        // const formData = new FormData();
        // formData.append('file', file, "bar.png"); // Specify filename
        console.log(`here!`);

        try {
            // TODO 2: Pass the image to cutout pro
            const response = await axios.post('https://www.cutout.pro/api/v1/cartoonSelfie?cartoonType=1', formData, {
                headers: {
                    'APIKEY': API_KEY_CUT_OUT_PRO, // Replace with your API key
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                },
                encoding: null,
                responseType: 'arraybuffer' // Set responseType to 'arraybuffer' for binary data
            });

            console.log(`response.data - ${JSON.stringify(response.data)}`);
            const byteArray = new Uint8Array(response.data);
            const base64String = uint8ArrayToBase64(byteArray);
            // TODO 3: Save the image into S3 based on the <S3_Bucket>/user_profile/<ticket_id>/cartoonify.png
            var response2 = await saveImageToS3BucketFolder(base64String, ticketId, photoExt);
            console.log(`response: ${response2}`);

        } catch (err) {
            console.error(err);
            return createLambdaResponse(event, 500, `Cutoutpro Failed - ${JSON.stringify(err)}!!`);
        }
    }

    const submission = formsg.crypto.decrypt(formSecretKey, dataToParse);
    console.log(`submission without attachment: ${JSON.stringify(submission)}`);
    // TODO 4 (optional): Update a value in Database to indicate user have signed on.

    return createLambdaResponse(event, 200, 'Post Success!');
};

module.exports.riydhoPostRequest = async (event, context) => {
    console.log(`POST_URI-  ${POST_URI}`);
    console.log(`formSecretKey-  ${formSecretKey}`);
    console.log(`HAS_ATTACHMENTS-  ${HAS_ATTACHMENTS}`);
    console.log(`formsg-  ${formsg}`);

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context:   ${JSON.stringify(context)}`);
    return createLambdaResponse(event, 200, 'Post Success!');
};


function uint8ArrayToBase64(uint8Array) {
    console.log(`Converting uint8 to Base64`);
    let binaryString = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    console.log(`End of conversion.`);
    return Buffer.from(binaryString, 'utf8').toString('base64');
    // return btoa(binaryString);
}

const base64ToBlob = (base64, type) => {
    const byteCharacters = Buffer.from(base64, 'base64');
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: type });
};


async function saveImageToS3BucketFolder(imageContent, ticketId, fileExt) {
    let result = null;
    if (imageContent) {
        try {

            result = await S3OHImageBucketHelper.saveBase64VehicleImage(imageContent, ticketId, fileExt);
            // console.log(`updateVehicle SQL: ${JSON.stringify(results)}`);
        } catch (ex) {
            console.error(`An Exception have occurred while trying to dal.vehicledal.saveImageToVehicleFolder(imageContent: ${imageContent}, ticketId: ${ticketId}) - ${ex}`);
            throw ex;
        }
    }
    return result;
}
module.exports.saveImageToVehicleFolder = saveImageToS3BucketFolder;