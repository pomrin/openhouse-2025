const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("@aws-sdk/client-apigatewaymanagementapi");

exports.handler = async function (event) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);


  console.log(`Enterered`);

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

  const { action, authKey } = body;

  // Check if authKey is valid
  if (action !== "register" && action !== "ping" && authKey !== "Av3ryS3cr3tK3y") {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden: Invalid authKey" }),
    };
  }

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

  if (action === "register") {
    var { ticketId, userGroup } = body;
    const senderConnectionId = event.requestContext.connectionId;
    const apiClient = new ApiGatewayManagementApiClient({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });

    // Ensure proper parameter values for ticket id and user group
    var errorMessage = "";
    if ((ticketId == null || ticketId === "")) {
      errorMessage += `Ticket ID (ticketId: ${ticketId}) cannot be null or empty`;
    } else {
      ticketId = ticketId.toUpperCase();
    }
    if ((userGroup == null || userGroup === "")) {
      if (errorMessage.length > 0) {
        errorMessage += ".\n";
      }
      errorMessage += `User Group (userGroup: ${userGroup}) cannot be null or empty`;
    } else {
      userGroup = userGroup.toUpperCase();
    }
    if (errorMessage) {
      try {
        await apiClient.send(new PostToConnectionCommand({
          ConnectionId: senderConnectionId,
          Data: JSON.stringify({ message: `Unable to Register: ${errorMessage}}` }),
        }));
      }
      catch (err) {
        console.error("Error processing registration:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    } else {
      try {

        await docClient.send(new UpdateCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            connectionId: senderConnectionId,
          },
          UpdateExpression: "SET ticketId = :ticketId, #ug = :userGroup",
          ExpressionAttributeValues: {
            ":ticketId": ticketId,
            ":userGroup": userGroup,
          },
          ExpressionAttributeNames: {
            "#ug": "userGroup",
          },
        }));

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Ticket ID and userGroup updated for the sender",
          }),
        };
      } catch (err) {
        console.error("Error processing registration:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    }
  }

  if (action === "direct") {
    var { command, message, ticketId } = body; // Include ticketId in the request body
    const senderConnectionId = event.requestContext.connectionId;
    const apiClient = new ApiGatewayManagementApiClient({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });

    // Ensure proper parameter values for ticket id and message
    var errorMessage = "";
    if ((command === undefined || command == null || command === "")) {
      errorMessage += `Command (command: ${command}) cannot be null or empty`;
    } else {
      command = command.toUpperCase();
    }
    if ((ticketId == null || ticketId === "")) {
      if (errorMessage.length > 0) {
        errorMessage += ".\n";
      }
      errorMessage += `Ticket ID (ticketId: ${ticketId}) cannot be null or empty`;
    } else {
      ticketId = ticketId.toUpperCase();
    }

    if (errorMessage) {
      try {
        await apiClient.send(new PostToConnectionCommand({
          ConnectionId: senderConnectionId,
          Data: JSON.stringify({ message: `Unable to Send Direct Message: ${errorMessage}}` }),
        }));
      }
      catch (err) {
        console.error("Error processing Send Direct Message:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    } else {
      try {

        // Scan the DynamoDB table to get all connections with the provided ticketId
        const scanResult = await docClient.send(new ScanCommand({
          TableName: process.env.TABLE_NAME,
          FilterExpression: "ticketId = :ticketId",
          ExpressionAttributeValues: {
            ":ticketId": ticketId,
          },
        }));

        // Send the direct message to all connections with matching ticketId, excluding the sender
        const sendMessages = scanResult.Items
          .filter(item => item.connectionId !== senderConnectionId) // Exclude the sender's connection ID
          .map(item => {
            const connectionId = item.connectionId;

            const directMessage = {
              // action: "sendmessage",
              // recipientId: connectionId,
              ticketId: ticketId,
              command: command,
              message: message, // Use the message from the request body
            };

            return apiClient.send(new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: JSON.stringify(directMessage),
            })).catch(err => {
              console.error(`Failed to send message to ${connectionId}:`, err);
            });
          });

        await Promise.all(sendMessages); // Wait for all messages to be sent

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Direct message sent to all connections linked by ticket ID",
          }),
        };
      } catch (err) {
        console.error("Error processing direct message:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    }

  }



  // Handle broadcast action for all connections
  if (action === "broadcast") {
    var { command, message, userGroup } = body; // Get userGroup from the body
    const senderConnectionId = event.requestContext.connectionId;
    const apiClient = new ApiGatewayManagementApiClient({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });


    // Ensure proper parameter values for ticket id and message
    var errorMessage = "";
    if ((command === undefined || command == null || command === "")) {
      errorMessage += `Command (command: ${command}) cannot be null or empty`;
    } else {
      command = command.toUpperCase();
    }
    if ((userGroup == null || userGroup === "")) {
      if (errorMessage.length > 0) {
        errorMessage += ".\n";
      }
      errorMessage += `User Group (userGroup: ${userGroup}) cannot be null or empty`;
    } else {
      userGroup = userGroup.toUpperCase();
    }

    // await apiClient.send(new PostToConnectionCommand({
    //   ConnectionId: senderConnectionId,
    //   Data: JSON.stringify({ temp:`command: ${command}, message: ${message}, userGroup: ${userGroup}` }),
    // }));

    if (errorMessage) {
      try {
        await apiClient.send(new PostToConnectionCommand({
          ConnectionId: senderConnectionId,
          Data: JSON.stringify({ message: `Unable to broadcast: ${errorMessage}}` }),
        }));
      }
      catch (err) {
        console.error("Error processing broadcast:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    } else {
      try {
        // Scan all connections from the table
        const scanResult = await docClient.send(new ScanCommand({
          TableName: process.env.TABLE_NAME,
        }));

        // Filter connections by userGroup and exclude the sender
        const sendMessages = scanResult.Items
          .filter(item => item.userGroup === userGroup && item.connectionId !== senderConnectionId)
          .map(async (item) => {
            const connectionId = item.connectionId;

            // Broadcast the message to each connection in the same userGroup
            return apiClient.send(new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: JSON.stringify({ command: command, message: message }),
            }));
          });

        await Promise.all(sendMessages); // Wait for all messages to be sent

        return {
          statusCode: 200,
          body: JSON.stringify({ message: `Broadcast message sent to all connections in the same userGroup (${userGroup})` }),
        };
      } catch (err) {
        console.error("Error processing broadcast to userGroup:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    }
  }

  if (action === "ping") {
    const senderConnectionId = event.requestContext.connectionId;
    const apiClient = new ApiGatewayManagementApiClient({
      endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });

    try {
      // Send the "pong" message back to the connection that called the action
      await apiClient.send(new PostToConnectionCommand({
        ConnectionId: senderConnectionId,
        Data: JSON.stringify({ message: "pong" }),
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "pong" }),
      };
    } catch (err) {
      console.error("Error processing ping:", err);
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
