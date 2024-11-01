import { SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../config/sesClient";
import { TEMPLATE_NAME_REGISTRATION_PREVIEW } from "../emailtemplates/EmailTemplateNames";


/**
 * Replace this with the name of an existing template.
 */
const TEMPLATE_NAME = TEMPLATE_NAME_REGISTRATION_PREVIEW;

const CC_EMAIL = process.env.CC_EMAILS.split(",");

/**
 * Replace these with existing verified emails.
 */
const VERIFIED_FROM_EMAIL = process.env.FROM_EMAIL;

// const USER = { firstName: "Bilbo", emailAddress: VERIFIED_EMAIL, photoUrl: `sample.png` };

/**
 *
 * @param { { emailAddress: string, firstName: string } } user
 * @param { string } templateName - The name of an existing template in Amazon SES.
 * @returns { SendTemplatedEmailCommand }
 */
const createReminderEmailCommand = (username, useremail, imageUrl, templateName) => {
    return new SendTemplatedEmailCommand({
        /**
         * Here's an example of how a template would be replaced with user data:
         * Template: <h1>Hello {{contact.firstName}},</h1><p>Don't forget about the party gifts!</p>
         * Destination: <h1>Hello Bilbo,</h1><p>Don't forget about the party gifts!</p>
         */
        Destination: { ToAddresses: [useremail], CcAddresses: CC_EMAIL },
        TemplateData: JSON.stringify({ name: username, url: imageUrl }),
        Source: VERIFIED_FROM_EMAIL,
        Template: templateName,
    });
};

async function sendRegistrationCompleteEmail(username, useremail, imageUrl) {
    console.log(`TEMPLATE_NAME - ${TEMPLATE_NAME}`);
    const sendReminderEmailCommand = createReminderEmailCommand(
        username,
        useremail,
        imageUrl,
        TEMPLATE_NAME,
    );
    try {
        return await sesClient.send(sendReminderEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            /** @type { import('@aws-sdk/client-ses').MessageRejected} */
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

module.exports.sendRegistrationCompleteEmail = sendRegistrationCompleteEmail;