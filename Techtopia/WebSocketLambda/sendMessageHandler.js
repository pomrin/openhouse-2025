const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("@aws-sdk/client-apigatewaymanagementapi");

exports.handler = async function(event) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  // Parse the message
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON" }),
    };
  }

  const { action } = body;

  // Handle send message action
  if (action === "sendmessage") {
    const { recipientId, message } = body;
    const senderConnectionId = event.requestContext.connectionId;

    try {
      // Retrieve the recipient connectionId from DynamoDB
      const recipientConnection = await docClient.send(new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          connectionId: recipientId,
        },
      }));

      if (!recipientConnection.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Recipient not found" }),
        };
      }

      const connectionId = recipientConnection.Item.connectionId;

      // Send the message to the recipient's connection
      const apiClient = new ApiGatewayManagementApiClient({
        endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
      });

      await apiClient.send(new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify({ message: message, connectionId: senderConnectionId }),
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Message sent" }),
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  // Handle broadcast message action
  if (action === "broadcast") {
    const { message } = body;
    const apiClient = new ApiGatewayManagementApiClient({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });

    try {
      // Scan the DynamoDB table to get all connections
      const scanResult = await docClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
      }));

      const sendMessages = scanResult.Items.map(async (item) => {
        const connectionId = item.connectionId;
        // Send the message to each connectionId
        return apiClient.send(new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({ message: message, connectionId: event.requestContext.connectionId }),
        }));
      });

      await Promise.all(sendMessages); // Wait for all messages to be sent

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Broadcast message sent" }),
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Invalid action" }),
  };
};