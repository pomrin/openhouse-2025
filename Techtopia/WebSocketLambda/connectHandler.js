const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = async function(event) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  
  // Extracting connectionId for clarity
  const connectionId = event.requestContext.connectionId;

  // Log the connectionId for reference
  console.log(`New connection established with connectionId: ${connectionId}`);

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: connectionId,
    },
  });

  try {
    // Sending command to DynamoDB
    await docClient.send(command);
    console.log(`Successfully stored connectionId: ${connectionId}`);
  } catch (err) {
    console.error(`Error storing connectionId ${connectionId}:`, err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to store connection ID', connectionId }), // Include connectionId in error response for troubleshooting
    };
  }

  // Return the connectionId in the response body for ReactJS
  return {
    statusCode: 200,
    body: JSON.stringify({ connectionId }), // Return connectionId in the response
  };
};