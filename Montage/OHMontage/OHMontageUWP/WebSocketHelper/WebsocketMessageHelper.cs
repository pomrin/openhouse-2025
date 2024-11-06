
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OHMontageUWP;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Reflection.Metadata.Ecma335;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Windows.Networking.Sockets;
using Windows.Storage.Streams;
using Windows.UI.WindowManagement;
using Windows.Web.UI;

namespace AWSServerless1.WebSocketHelper
{
    public class WebsocketMessageHelper
    {
        public enum WEBSOCKET_GROUP_TYPES { VISITOR, BOOTHADMIN, MONTAGE };
        public enum WEBSOCKET_ACTION_TYPES { ping, direct, broadcast, register };
        public enum WEBSOCKET_COMMAND_TYPES { UPDATE_PHOTO, UPDATE_STAMP, UPDATE_REDEMPTION_STATUS, JIGGLE, UPDATE_PHOTOS, UPDATE_QUEUES };

        private ClientWebSocket websocketClient;


        private List<Func<string, Task<bool>>> listOfHandlers = new List<Func<string, Task<bool>>>();

        public WebsocketMessageHelper()
        {

        }

        public async Task<ClientWebSocket> InitiateWebSocketClientAsync()
        {
            do
            {
                try
                {
                    var wsConfig = new AppConfig().GetWebSocketConfig();
                    String authKey = wsConfig.AuthKey;
                    String wsURL = wsConfig.ProductionUrl;

                    websocketClient = new ClientWebSocket();
                    await websocketClient.ConnectAsync(new Uri(wsURL), CancellationToken.None);
                    Trace.WriteLine($"Connected to WebSocket Server {wsURL}!");
                    // Register to subscribe to a Montage channel
                    await sendRegisterMessageAsync();

                    while (websocketClient.State == WebSocketState.Open)
                    {
                        StringBuilder sbMessage = new StringBuilder();
                        WebSocketReceiveResult temp;
                        ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
                        do
                        {
                            temp = await websocketClient.ReceiveAsync(buffer, CancellationToken.None);
                            sbMessage.Append(Encoding.UTF8.GetString(buffer.Array, 0, temp.Count));
                        }
                        while (!temp.EndOfMessage);
                        Trace.WriteLine($"Message Received: {sbMessage.ToString()}");
                        if (sbMessage.Length > 0)
                        {

                            var tasks = new List<Task<Boolean>>();
                            foreach (var handler in listOfHandlers)
                            {
                                var task = handler.Invoke($"{sbMessage.ToString()}");
                                tasks.Add(task);
                            }
                            await Task.WhenAll(tasks);
                        }
                    }
                }
                catch (Exception ex)
                {
                    websocketClient = null;
                    Trace.WriteLine($"Connection to Websocket Server failed - {ex.Message}");
                }
            } while (websocketClient == null || websocketClient.State != WebSocketState.Open);
           


            return websocketClient;
        }

        private async Task<Boolean> sendRegisterMessageAsync()
        {
            bool result = false;
            if (this.websocketClient != null && this.websocketClient.State == WebSocketState.Open)
            {
                try
                {
                    // Subscribe to a Broadcast Channel for Montage App
                    var tempMessage = new
                    {
                        action = WEBSOCKET_ACTION_TYPES.register.ToString(),
                        userGroup = WEBSOCKET_GROUP_TYPES.MONTAGE.ToString(),
                        ticketId = "-1",
                    };
                    var serializedWebSocketMessage = JsonConvert.SerializeObject(tempMessage);
                    var bytes = Encoding.UTF8.GetBytes(serializedWebSocketMessage);
                    var arraySegment = new ArraySegment<byte>(bytes);
                    await websocketClient.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                    Trace.WriteLine($"Subscribed to MONTAGE channel!");
                    result = true;
                }
                catch (Exception ex)
                {
                    Trace.WriteLine($"Sending Register to Channel message failed - {ex.Message}");
                }
            }
            return result;
        }

        internal void AddMessageListener(Func<string, Task<bool>> loadUserImage)
        {
            this.listOfHandlers.Add(loadUserImage);
        }


        //private static async Task<String> Ping()
        //{
        //    String result = null;
        //    var tempMessage = new
        //    {
        //        action = WEBSOCKET_ACTION_TYPES.ping.ToString()
        //    };
        //    var serializedWebSocketMessage = JsonConvert.SerializeObject(tempMessage);
        //    try
        //    {
        //        var bytes = Encoding.UTF8.GetBytes(serializedWebSocketMessage);
        //        var arraySegment = new ArraySegment<byte>(bytes);
        //        var wsClient = new ClientWebSocket();


        //        await wsClient.ConnectAsync(new Uri(wsURL), CancellationToken.None);
        //        if (wsClient.State == WebSocketState.Open)
        //        {
        //            await wsClient.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
        //            var asResponseMessage = new ArraySegment<byte>(bytes);
        //            WebSocketReceiveResult receiveResult;
        //            do
        //            {
        //                receiveResult = await wsClient.ReceiveAsync(asResponseMessage, CancellationToken.None);
        //                result += Encoding.Default.GetString(asResponseMessage.ToArray());
        //            } while (!receiveResult.EndOfMessage);
        //        }
        //        await wsClient.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, String.Empty, CancellationToken.None);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"An Exception have occurred while trying to Ping, serializedWebSocketMessage: {serializedWebSocketMessage} - {ex.ToString()}");
        //    }

        //    return result;
        //}

        //private static async Task<String> Register(WEBSOCKET_GROUP_TYPES group)
        //{
        //    String result = null;

        //    var tempMessage = new
        //    {
        //        action = WEBSOCKET_ACTION_TYPES.register.ToString(),
        //        userGroup = group.ToString(),
        //        ticketId = "-1",
        //    };
        //    var serializedWebSocketMessage = JsonConvert.SerializeObject(tempMessage);
        //    try
        //    {
        //        var bytes = Encoding.UTF8.GetBytes(serializedWebSocketMessage);
        //        var arraySegment = new ArraySegment<byte>(bytes);
        //        var wsClient = new ClientWebSocket();
        //        await wsClient.ConnectAsync(new Uri(wsURL), CancellationToken.None);
        //        if (wsClient.State == WebSocketState.Open)
        //        {
        //            await wsClient.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);

        //            while (wsClient.State == WebSocketState.Open)
        //            {
        //                StringBuilder sbMessage = new StringBuilder();
        //                WebSocketReceiveResult temp;
        //                ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
        //                do
        //                {
        //                    temp = await wsClient.ReceiveAsync(buffer, CancellationToken.None);
        //                    sbMessage.Append(Encoding.UTF8.GetString(buffer.Array, 0, temp.Count));
        //                }
        //                while (!temp.EndOfMessage);
        //                Trace.WriteLine($"Message Received: {sbMessage.ToString()}");
        //            }
        //        }

        //        await wsClient.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, String.Empty, CancellationToken.None);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"An Exception have occurred while trying to Register(group: {group.ToString()}), serializedWebSocketMessage: {serializedWebSocketMessage}- {ex.ToString()}");
        //    }

        //    return result;
        //}

        //internal void AddMessageListener(Action<string> loadUserImage)
        //{
        //    listOfActions.Add(loadUserImage);
        //}
    }
}
