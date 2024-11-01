const WebSocket = require('ws');
const {
    createLambdaResponse,
} = require("../helpers/common");

const S3OHImageBucketHelper = require('../helpers/getImageURLs');

const formsg = require('@opengovsg/formsg-sdk')({
    mode: 'production',
});

var path = require('path');
// const Blob = require('buffer');
const { Readable } = require("stream");
const { default: axios } = require("axios");
const { blob } = require('node:stream/consumers');
var request = require('request');
var fs = require('fs');
const visitorDAL = require("../dal/visitordal");
import AWSSesHelper from "../helpers/AWSSesHelper";

// ##### Form SG
// This is where your domain is hosted, and should match
// the URI supplied to FormSG in the form dashboard

const POST_URI = process.env.FORM_SG_POST_URL;

// Your form's secret key downloaded from FormSG upon form creation

const formSecretKey = process.env.FORM_SECRET_KEY;

// #### Form SG for Demo
const POST_URI_DEMO = process.env.FORM_SG_POST_URL_DEMO;
// Your form's secret key downloaded from FormSG upon form creation
const formSecretKey_DEMO = process.env.FORM_SECRET_KEY_DEMO;

// Set to true if you need to download and decrypt attachments from submissions
// const HAS_ATTACHMENTS = true;

// #### Cut Out Pro
const API_KEY_CUT_OUT_PRO = process.env.CUT_OUT_PRO_API;

// const wsUrl = process.env.WEBSOCKET_API;
// const wsUrl = 'wss://ygfo8jqflc.execute-api.ap-southeast-1.amazonaws.com/production/';
const ws = new WebSocket(process.env.WEBSOCKET_URL);

// Message queues for messages before the connection opens
let messageQueue = [];
let directMessageQueue = [];
let broadcastMessageQueue = [];
let isWebSocketOpen = false;

// Handle WebSocket connection open event
ws.on('open', () => {
    console.log('WebSocket connection established.');
    isWebSocketOpen = true;

    // Process the queued registration messages
    while (messageQueue.length > 0) {
        const message = messageQueue.shift();
        registerMessage(message["ticketId"], message["userGroup"]);
    }

    // Process the queued direct messages
    while (directMessageQueue.length > 0) {
        const message = directMessageQueue.shift();
        // console.log(`message: ${message}`);
        sendDirectMessage(message["message"], message["ticketId"], message["command"]);
    }

    // Process the queued broadcast messages
    while (broadcastMessageQueue.length > 0) {
        const message = broadcastMessageQueue.shift();
        broadcastMessage(message["message"], message["userGroup"], message["command"]);
    }
});

// Handle WebSocket errors
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
    isWebSocketOpen = false;
});

// function ping() {
//     const registerPayload = JSON.stringify({
//         action: "ping"
//     });

//     // Check if WebSocket is open before sending
//     if (isWebSocketOpen) {
//         ws.send(registerPayload, (err) => {
//             if (err) {
//                 console.error('Error registering:', err);
//             } else {
//                 console.log('Ping sent');
//             }
//         });
//     } else {
//         console.error('WebSocket is not open. Queueing the message.');
//     }
// }

function registerMessage(message, userGroup) {

    const payload = {
        action: "register",
        message: message,
        usergroup: userGroup
    };

    const registerPayload = JSON.stringify(payload);

    // Check if WebSocket is open before sending
    if (isWebSocketOpen) {
        ws.send(registerPayload, (err) => {
            if (err) {
                console.error('Error registering:', err);
            } else {
                console.log('Register message sent:', message);
            }
        });
    } else {
        console.error('WebSocket is not open. Queueing the message.');
        messageQueue.push(payload);
    }
}

function sendDirectMessage(message, ticketId, command) {
    console.log('Entered Direct Message');

    const payload = {
        action: "direct",
        ticketId: ticketId,
        command: command,
        message: message,
        authKey: process.env.WEBSOCKET_SECRET_KEY
    };

    const directPayload = JSON.stringify(payload);
    console.log(`Direct PayLoad: ${directPayload}`);

    // Check if WebSocket is open before sending
    if (isWebSocketOpen) {
        console.log(`Starting direct message send...`);
        ws.send(directPayload, (err) => {
            if (err) {
                console.error('Error sending direct message:', err);
            } else {
                console.log('Direct message sent:', directPayload);
            }
        });
    } else {
        console.error('WebSocket is not open. Queueing the direct message.');
        // Queue the direct message if the WebSocket is not open
        directMessageQueue.push(payload);
    }
}

function broadcastMessage(message, userGroup, command) {
    console.log('Entered broadcastMessage');
    const payload = {
        action: "broadcast",
        userGroup: userGroup,
        command: command,
        message: message,
        authKey: process.env.WEBSOCKET_SECRET_KEY
    };
    const directPayload = JSON.stringify(payload);
    console.log(`Broadcast PayLoad: ${directPayload}`);

    // Check if WebSocket is open before sending
    if (isWebSocketOpen) {
        console.log(`Starting broadcast message send...`);
        ws.send(directPayload, (err) => {
            if (err) {
                console.error('Error sending broadcast message:', err);
            } else {
                console.log('broadcast message sent:', message);
            }
        });
    } else {
        console.error('WebSocket is not open. Unable to send broadcast message.');
        broadcastMessageQueue.push(payload);
    }
}

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
    // console.log(`submissionWithAttachments.content.responses[1]: ${JSON.stringify(submissionWithAttachments.content.responses[1])}`);
    const email = submissionWithAttachments.content.responses[1].answer;
    console.log(`email: ${email}`);
    // console.log(`submissionWithAttachments.content.responses[2]: ${JSON.stringify(submissionWithAttachments.content.responses[2])}`);
    const visitorName = submissionWithAttachments.content.responses[2].answer;
    console.log(`visitorName: ${visitorName}`);
    // console.log(`submissionWithAttachments.content.responses[3]: ${JSON.stringify(submissionWithAttachments.content.responses[3])}`);
    // registerMessage(ticketId);
    // sendDirectMessage(ticketId, "updateImage");
    const photoInfo = submissionWithAttachments.content.responses[3].answer;
    console.log(`photoInfo: ${photoInfo}`);
    if (photoInfo) {
        const photoExt = path.extname(photoInfo)?.substring(1);
        console.log(`photoExt: ${photoExt}`);

        // console.log(`submissionWithAttachments.attachments: ${JSON.stringify(submissionWithAttachments.attachments)}`);
        // console.log(`submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"]: ${JSON.stringify(submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"])}`);
        // console.log(`submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content: ${JSON.stringify(submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content)}`);
        const imageBase64 = submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content;
        // console.log(`imageBase64: ${JSON.stringify(imageBase64)}`);
        // const test_blob = base64ToBlob(imageBase64, `image/${photoExt}`);
        // const formData = new FormData();
        // formData.append('file', test_blob, 'filename.png'); // Specify filename
        // console.log(`${JSON.stringify(formData)}`);


        const byteCharacters = Buffer.from(imageBase64, 'base64');
        const stream = Readable.from(byteCharacters);
        const myFile = await blob(stream);

        const formData = new FormData();
        formData.append('file', myFile, "bar.png"); // Specify filename

        try {
            console.log(`Calling Cutout Pro API!`);
            // TODO 2: Pass the image to cutout pro
            const response = await axios.post('https://www.cutout.pro/api/v1/cartoonSelfie2?cartoonType=1', formData, {
                headers: {
                    'APIKEY': API_KEY_CUT_OUT_PRO, // Replace with your API key
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                },
                encoding: null,
            });

            var responseCode = response.data.code;
            console.log(`responseCode - ${responseCode}`);
            if (responseCode == 4001) {
                console.log("Insufficient Credit!");
            } else {

                // var responseBody = JSON.parse(response.data.code);
                // console.log(`response.data.data - ${response.data.data}`);
                // console.log(`response.data.data.imageBase64 - ${response.data.data.imageBase64}`);
                var base64String = response.data.data.imageBase64;
                console.log(`response.data.data.imageUrl - ${response.data.data.imageUrl}`); // CYL: Possible to save this to User database

                if (base64String) {
                    var response2 = await saveImageToS3BucketFolder(base64String, ticketId, photoExt);
                    console.log(`response: ${response2}`);
                    await visitorDAL.updateProfileImageUrlByTicketId(ticketId, "cartoonprofile." + photoExt);
                    sendDirectMessage("cartoonprofile." + photoExt, ticketId, "UPDATE_PHOTO");
                    broadcastMessage(ticketId, "MONTAGE", "UPDATE_PHOTOS");
                } else {
                    console.log(`Unable to read the Cutout Pro response`);
                }
            }

            // console.log(`response - ${(response)}`);

            // console.log(`response.data - ${JSON.stringify(response.data)}`);

            // var resposeData = Buffer.from(response.data);
            // console.log(`resposeData.data - ${resposeData.data}`);

            // const byteArray = new Uint8Array(resposeData.data);
            // const base64String = uint8ArrayToBase64(byteArray);
            // console.log(`base64String - ${base64String}`);
            // if (base64String !== undefined) {
            //     // TODO 3: Save the image into S3 based on the <S3_Bucket>/user_profile/<ticket_id>/cartoonify.png
            //     var response2 = await saveImageToS3BucketFolder(base64String, ticketId, photoExt);
            //     console.log(`response: ${response2}`);
            // } else {
            //     console.log(`Unable to read the Cutout Pro response`);
            // }

        } catch (err) {
            console.error(err);
            return createLambdaResponse(event, 500, `Cutoutpro Failed - ${JSON.stringify(err)}!!`);
        }
    }

    // const submission = formsg.crypto.decrypt(formSecretKey, dataToParse);
    // console.log(`submission without attachment: ${JSON.stringify(submission)}`);
    // TODO 4 (optional): Update a value in Database to indicate user have signed on.

    return createLambdaResponse(event, 200, 'Post Success!');
};


module.exports.postDemoRequest = async (event, context) => {
    console.log(`API_KEY_CUT_OUT_PRO-  ${API_KEY_CUT_OUT_PRO}`);

    const eventBody = JSON.parse(event.body);
    const dataToParse = eventBody.data;

    // 1: Decrypt the various values from FormSG
    const formSgSignature = event.headers["X-FormSG-Signature"];
    console.log(`event.headers["X-FormSG-Signature"]: ${JSON.stringify(event.headers["X-FormSG-Signature"])}`);
    const authResult = formsg.webhooks.authenticate(formSgSignature, POST_URI_DEMO);
    console.log(`authResult: ${authResult}`);

    const submissionWithAttachments = await formsg.crypto.decryptWithAttachments(formSecretKey_DEMO, dataToParse);
    // console.log(`submissionWithAttachments: ${JSON.stringify(submissionWithAttachments)}`);
    // console.log(`submissionWithAttachments.content: ${JSON.stringify(submissionWithAttachments.content)}`);
    // console.log(`submissionWithAttachments.content.responses: ${JSON.stringify(submissionWithAttachments.content.responses)}`);
    // console.log(`submissionWithAttachments.content.responses[0]: ${JSON.stringify(submissionWithAttachments.content.responses[0])}`);
    const ticketId = submissionWithAttachments.content.responses[0].answer;
    console.log(`ticketId: ${ticketId}`);
    console.log(`submissionWithAttachments.content.responses[1]: ${JSON.stringify(submissionWithAttachments.content.responses[1])}`);
    const email = submissionWithAttachments.content.responses[1].answer;
    console.log(`email: ${email}`);
    // console.log(`submissionWithAttachments.content.responses[2]: ${JSON.stringify(submissionWithAttachments.content.responses[2])}`);
    // const visitorName = submissionWithAttachments.content.responses[2].answer;
    // console.log(`visitorName: ${visitorName}`);
    // console.log(`submissionWithAttachments.content.responses[3]: ${JSON.stringify(submissionWithAttachments.content.responses[3])}`);
    registerMessage(ticketId);
    sendDirectMessage("updateImage");
    const photoInfo = submissionWithAttachments.content.responses[2].answer;
    console.log(`photoInfo: ${photoInfo}`);
    if (photoInfo) {
        const photoExt = path.extname(photoInfo)?.substring(1);
        console.log(`photoExt: ${photoExt}`);

        // console.log(`submissionWithAttachments.attachments: ${JSON.stringify(submissionWithAttachments.attachments)}`);
        // console.log(`submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"]: ${JSON.stringify(submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"])}`);
        // console.log(`submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content: ${JSON.stringify(submissionWithAttachments.attachments["66e14a5fa1d7884a360306fe"].content)}`);
        const imageBase64 = submissionWithAttachments.attachments["671a14e7db4e9bb1471c82c0"].content;
        // console.log(`imageBase64: ${JSON.stringify(imageBase64)}`);
        // const test_blob = base64ToBlob(imageBase64, `image/${photoExt}`);
        // const formData = new FormData();
        // formData.append('file', test_blob, 'filename.png'); // Specify filename
        // console.log(`${JSON.stringify(formData)}`);


        const byteCharacters = Buffer.from(imageBase64, 'base64');
        const stream = Readable.from(byteCharacters);
        const myFile = await blob(stream);

        const formData = new FormData();
        formData.append('file', myFile, "bar.png"); // Specify filename

        try {
            console.log(`Calling Cutout Pro API!`);
            // TODO 2: Pass the image to cutout pro
            const response = await axios.post('https://www.cutout.pro/api/v1/cartoonSelfie2?cartoonType=1', formData, {
                headers: {
                    'APIKEY': API_KEY_CUT_OUT_PRO, // Replace with your API key
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                },
                encoding: null,
            });

            var responseCode = response.data.code;
            console.log(`responseCode - ${responseCode}`);
            if (responseCode == 4001) {
                console.log("Insufficient Credit!");
            } else {

                // var responseBody = JSON.parse(response.data.code);
                // console.log(`response.data.data - ${response.data.data}`);
                // console.log(`response.data.data.imageBase64 - ${response.data.data.imageBase64}`);
                var base64String = response.data.data.imageBase64;
                console.log(`response.data.data.imageUrl - ${response.data.data.imageUrl}`); // CYL: Possible to save this to User database

                if (base64String) {
                    var response2 = await saveImageToS3BucketFolder(base64String, ticketId, photoExt);
                    console.log(`response: ${response2}`);
                    await visitorDAL.updateProfileImageUrlByTicketId(ticketId, "cartoonprofile." + photoExt);
                    sendDirectMessage("cartoonprofile." + photoExt, ticketId, "UPDATE_PHOTO");
                    broadcastMessage(ticketId, "MONTAGE", "UPDATE_PHOTOS");
                    var emailResult = await AWSSesHelper.sendRegistrationCompleteEmail("Budding Techtopian", email, `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${response2}`);
                    console.log(`Email to ${email} - ${JSON.stringify(emailResult)}`);
                } else {
                    console.log(`Unable to read the Cutout Pro response`);
                }
            }

            // console.log(`response - ${(response)}`);

            // console.log(`response.data - ${JSON.stringify(response.data)}`);

            // var resposeData = Buffer.from(response.data);
            // console.log(`resposeData.data - ${resposeData.data}`);

            // const byteArray = new Uint8Array(resposeData.data);
            // const base64String = uint8ArrayToBase64(byteArray);
            // console.log(`base64String - ${base64String}`);
            // if (base64String !== undefined) {
            //     // TODO 3: Save the image into S3 based on the <S3_Bucket>/user_profile/<ticket_id>/cartoonify.png
            //     var response2 = await saveImageToS3BucketFolder(base64String, ticketId, photoExt);
            //     console.log(`response: ${response2}`);
            // } else {
            //     console.log(`Unable to read the Cutout Pro response`);
            // }

        } catch (err) {
            console.error(err);
            return createLambdaResponse(event, 500, `Cutoutpro Failed - ${JSON.stringify(err)}!!`);
        }
    }

    // const submission = formsg.crypto.decrypt(formSecretKey, dataToParse);
    // console.log(`submission without attachment: ${JSON.stringify(submission)}`);
    // TODO 4 (optional): Update a value in Database to indicate user have signed on.

    return createLambdaResponse(event, 200, 'Post Success!');
};

module.exports.testLocal = async (event, context) => {

    // const imagePath = path.join(__dirname, 'static', 'images', 'student-initiatives-banner-img.png');
    const readStream = fs.createReadStream(`D:/Users/Cephylite/Pictures/temp - Copy.jpg`);

    var go = true;
    if (go == true) {
        await request.post({
            url: 'https://www.cutout.pro/api/v1/cartoonSelfie2?cartoonType=1',
            formData: {
                file: readStream
            },
            headers: {
                'APIKEY': API_KEY_CUT_OUT_PRO
            },
            encoding: null
        }, function (error, response, body) {
            if (error) {
                console.log('Error!');
            }
            // console.log(`Response - ${response}`);
            console.log(`Response stringify- ${JSON.stringify(response)}`);
            // console.log(`response.body - ${response.body}`);
            console.log(`response.body stringify- ${JSON.stringify(response.body)}`);

            var responseBody = JSON.parse(response.body);
            // console.log(`responseBody - ${responseBody}`);

            // console.log(`--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
            // console.log(`responseBody stringify- ${JSON.stringify(responseBody)}`);

            // console.log(`--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
            // console.log(`responseBody stringify- ${JSON.stringify(responseBody.code)}`);
            if (responseBody.code == 4001) {
                console.log("Insufficient Credit!");
                // // console.log(`responseBody.data - ${responseBody.data}`);
            } else {
                console.log(`--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
                console.log(`responseBody.data.imageBase64 stringify - ${JSON.stringify(responseBody.data.imageBase64)}`);
                console.log(`responseBody.data.imageUrl stringify - ${JSON.stringify(responseBody.data.imageUrl)}`);
                console.log(`--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
            }

        });
    }


    return createLambdaResponse(event, 200, 'Post Success!');
};

module.exports.testLocalAxios = async (event, context) => {

    var result = 'abc';
    if (false) {
    } else {
        var imagePath = "user_profile/NYP0353WED/cartoonprofile.jpg";
        // https://openhouse2025-images-repo-prod.s3.ap-southeast-1.amazonaws.com/user_profile/NYP0353WED/cartoonprofile.jpg
        result = await AWSSesHelper.sendRegistrationCompleteEmail("Axios Local", "chanyuenloong.nyp@outlook.com", `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imagePath}`);
    }

    return createLambdaResponse(event, 200, `Post Success! ${JSON.stringify(result)}`);
};


// function uint8ArrayToBase64(uint8Array) {
//     console.log(`Converting uint8 to Base64`);
//     let binaryString = '';
//     const len = uint8Array.byteLength;
//     for (let i = 0; i < len; i++) {
//         binaryString += String.fromCharCode(uint8Array[i]);
//     }
//     console.log(`End of conversion.`);
//     return Buffer.from(binaryString, 'utf8').toString('base64');
//     // return btoa(binaryString);
// }

// const base64ToBlob = (base64, type) => {
//     const byteCharacters = Buffer.from(base64, 'base64');
//     const byteNumbers = new Array(byteCharacters.length);
//     for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     return new Blob([byteArray], { type: type });
// };


async function saveImageToS3BucketFolder(imageContent, ticketId, fileExt) {
    let result = null;
    if (imageContent) {
        try {

            result = await S3OHImageBucketHelper.saveBase64UserImage(imageContent, ticketId, fileExt);
            // console.log(`updateVehicle SQL: ${JSON.stringify(results)}`);
        } catch (ex) {
            console.error(`An Exception have occurred while trying to saveBase64UserImage(imageContent: ${imageContent}, ticketId: ${ticketId}) - ${ex}`);
            throw ex;
        }
    }
    return result;
}
module.exports.saveImageToVehicleFolder = saveImageToS3BucketFolder;