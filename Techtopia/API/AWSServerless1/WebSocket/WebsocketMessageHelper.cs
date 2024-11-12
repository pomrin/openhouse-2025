using AWSServerless1.Constants;
using AWSServerless1.Controllers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.WebSockets;
using System.Reflection.Metadata.Ecma335;
using System.Text;

namespace AWSServerless1.WebSocket
{
    public static class WebsocketMessageHelper
    {
        public enum WEBSOCKET_GROUP_TYPES { VISITOR, BOOTHADMIN, MONTAGE };
        public enum WEBSOCKET_ACTION_TYPES { ping, direct, broadcast, register };
        public enum WEBSOCKET_COMMAND_TYPES { UPDATE_PHOTO, UPDATE_STAMP, UPDATE_WORKSHOP, UPDATE_REDEMPTION_STATUS, JIGGLE, UPDATE_PHOTOS, UPDATE_QUEUES };

        private static readonly String authKey;
        private static readonly String wsURL;

        static WebsocketMessageHelper()
        {

            var configuration = new ConfigurationBuilder().AddJsonFile($"appsettings.json");

            var config = configuration.Build();
            authKey = config[OHAPIAppSettings.APP_SETTINGS_KEY_WEBSOCKET_AUTH_KEY];
            wsURL = config[OHAPIAppSettings.APP_SETTINGS_KEY_WEBSOCKET_URL_PROD];
        }

        public static async Task<String> Ping()
        {
            String result = null;
            var tempMessage = new
            {
                action = WEBSOCKET_ACTION_TYPES.ping.ToString()
            };
            var serializedWebSocketMessage = JsonConvert.SerializeObject(tempMessage);
            try
            {
                var bytes = Encoding.UTF8.GetBytes(serializedWebSocketMessage);
                var arraySegment = new ArraySegment<byte>(bytes);
                var wsClient = new ClientWebSocket();


                await wsClient.ConnectAsync(new Uri(wsURL), CancellationToken.None);
                if (wsClient.State == WebSocketState.Open)
                {
                    await wsClient.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                    var asResponseMessage = new ArraySegment<byte>(bytes);
                    WebSocketReceiveResult receiveResult;
                    do
                    {
                        receiveResult = await wsClient.ReceiveAsync(asResponseMessage, CancellationToken.None);
                        result += Encoding.Default.GetString(asResponseMessage);
                    } while (!receiveResult.EndOfMessage);
                }
                await wsClient.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, String.Empty, CancellationToken.None);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred while trying to Ping, serializedWebSocketMessage: {serializedWebSocketMessage} - {ex.ToString()}");
            }

            return result;
        }

        public static async Task<String> Register(WEBSOCKET_GROUP_TYPES group)
        {
            String result = null;

            var tempMessage = new
            {
                action = WEBSOCKET_ACTION_TYPES.register.ToString(),
                userGroup = group.ToString()
            };
            var serializedWebSocketMessage = JsonConvert.SerializeObject(tempMessage);
            try
            {
                var bytes = Encoding.UTF8.GetBytes(serializedWebSocketMessage);
                var arraySegment = new ArraySegment<byte>(bytes);
                var wsClient = new ClientWebSocket();
                await wsClient.ConnectAsync(new Uri(wsURL), CancellationToken.None);
                if (wsClient.State == WebSocketState.Open)
                {
                    await wsClient.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                    var asResponseMessage = new ArraySegment<byte>(bytes);
                    //WebSocketReceiveResult receiveResult;
                    //do
                    //{
                    //    receiveResult = await wsClient.ReceiveAsync(asResponseMessage, CancellationToken.None);
                    //    result += Encoding.Default.GetString(asResponseMessage);
                    //} while (!receiveResult.EndOfMessage);
                }
                await wsClient.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, String.Empty, CancellationToken.None);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred while trying to RegisterController(group: {group.ToString()}), serializedWebSocketMessage: {serializedWebSocketMessage}- {ex.ToString()}");
            }

            return result;
        }


        public static async Task<String> SendDirectMessage(String ticketId, WEBSOCKET_COMMAND_TYPES command, String message = null)
        {
            String result = null;

            var action = WEBSOCKET_ACTION_TYPES.direct;
            dynamic tempMessage = null;
            if (String.IsNullOrEmpty(ticketId) && String.IsNullOrEmpty(message))
            {
                tempMessage = new
                {
                    action = action.ToString(),
                    command = command.ToString(),
                    authKey = authKey,
                };
            }
            else if (!String.IsNullOrEmpty(ticketId) && String.IsNullOrEmpty(message))
            {
                tempMessage = new
                {
                    action = action.ToString(),
                    ticketId = ticketId,
                    command = command.ToString(), // Message to the recipient
                    authKey = authKey,
                };
            }
            else if (String.IsNullOrEmpty(ticketId) && !String.IsNullOrEmpty(message))
            {
                tempMessage = new
                {
                    action = action.ToString(),
                    message = message,
                    command = command.ToString(), // Message to the recipient
                    authKey = authKey,
                };
            }
            else
            {
                tempMessage = new
                {
                    action = action.ToString(),
                    ticketId = ticketId,
                    command = command.ToString(), // Message to the recipient
                    authKey = authKey,
                    message = message,
                };
            }
            var serializedWebSocketMessage = JsonConvert.SerializeObject(tempMessage);
            try
            {
                var bytes = Encoding.UTF8.GetBytes(serializedWebSocketMessage);
                var arraySegment = new ArraySegment<byte>(bytes);
                var wsClient = new ClientWebSocket();
                await wsClient.ConnectAsync(new Uri(wsURL), CancellationToken.None);
                if (wsClient.State == WebSocketState.Open)
                {
                    await wsClient.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                    var asResponseMessage = new ArraySegment<byte>(bytes);
                    //WebSocketReceiveResult receiveResult;
                    //do
                    //{
                    //    receiveResult = await wsClient.ReceiveAsync(asResponseMessage, CancellationToken.None);
                    //    result += Encoding.Default.GetString(asResponseMessage);
                    //} while (!receiveResult.EndOfMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred while trying to SendDirectMessage(ticketId: {ticketId}, message: {command.ToString()}), serializedWebSocketMessage: {serializedWebSocketMessage} - {ex.ToString()}");
            }

            return result;
        }


        public static async Task<String> BroadcastMessage(WEBSOCKET_GROUP_TYPES group, WEBSOCKET_COMMAND_TYPES command, String ticketId = null, String message = null)
        {
            String result = null;

            var action = WEBSOCKET_ACTION_TYPES.broadcast;
            dynamic tempMessage = null;

            if (!String.IsNullOrEmpty(ticketId) && !String.IsNullOrEmpty(message))
            {
                tempMessage = new
                {
                    action = action.ToString(), // ping, direct, broadcast, register
                    userGroup = group.ToString(), // intended group to receive the message eg Visitor, Admin, All, Montage
                    command = command.ToString(), // Message to the recipient
                    message = message,
                    ticketId = ticketId,
                    authKey = authKey,
                };
            }
            else if (!String.IsNullOrEmpty(ticketId) && String.IsNullOrEmpty(message))
            {
                tempMessage = new
                {
                    action = action.ToString(), // ping, direct, broadcast, register
                    userGroup = group.ToString(), // intended group to receive the message eg Visitor, Admin, All, Montage
                    command = command.ToString(), // Message to the recipient
                    ticketId = ticketId,
                    authKey = authKey,
                };
            }
            else if (String.IsNullOrEmpty(ticketId) && !String.IsNullOrEmpty(message))
            {
                tempMessage = new
                {
                    action = action.ToString(), // ping, direct, broadcast, register
                    userGroup = group.ToString(), // intended group to receive the message eg Visitor, Admin, All, Montage
                    command = command.ToString(), // Message to the recipient
                    message = message,
                    authKey = authKey,
                };
            }
            else
            {
                tempMessage = new
                {
                    action = action.ToString(), // ping, direct, broadcast, register
                    userGroup = group.ToString(), // intended group to receive the message eg Visitor, Admin, All, Montage
                    command = command.ToString(), // Message to the recipient
                    authKey = authKey,
                };
            }

            var serializedWebSocketMessage = JsonConvert.SerializeObject(tempMessage);
            try
            {
                var bytes = Encoding.UTF8.GetBytes(serializedWebSocketMessage);
                var arraySegment = new ArraySegment<byte>(bytes);
                var wsClient = new ClientWebSocket();
                await wsClient.ConnectAsync(new Uri(wsURL), CancellationToken.None);
                if (wsClient.State == WebSocketState.Open)
                {
                    await wsClient.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                    var asResponseMessage = new ArraySegment<byte>(bytes);
                    //WebSocketReceiveResult receiveResult;
                    //do
                    //{
                    //    receiveResult = await wsClient.ReceiveAsync(asResponseMessage, CancellationToken.None);
                    //    result += Encoding.Default.GetString(asResponseMessage);
                    //} while (!receiveResult.EndOfMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred while trying to BroadcastMessage(group: {group.ToString()}, message: {command.ToString()}, ticketId: {ticketId}), serializedWebSocketMessage: {serializedWebSocketMessage} - {ex.ToString()}");
            }

            return result;
        }
    }
}
