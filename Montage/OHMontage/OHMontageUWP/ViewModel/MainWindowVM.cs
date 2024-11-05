﻿using AWSServerless1.WebSocketHelper;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Windows.UI.Xaml;

namespace OHMontageUWP.ViewModel
{
    internal class MainWindowVM
    {

        private DispatcherTimer timer = new DispatcherTimer();
        public MainWindowVM()
        {
            this.MontageViewModel = new MontageVM();
            //this.Photos = new ObservableCollection<PhotoControlVM>();

            while (this.MontageViewModel.Photos.Count < MontageVM.DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
            {
                this.MontageViewModel.AddNewPhoto();
            }

            timer.Tick += Timer_Tick1;
            timer.Interval = new TimeSpan(0, 0, 0, 0, 10);
            timer.Start();

            WebsocketMessageHelper helper = new WebsocketMessageHelper();
            helper.AddMessageListener(LoadUserImage);
            helper.InitiateWebSocketClientAsync();
        }

        public async Task<bool> LoadUserImage(string websocketPayload)
        {
            var payload = JsonArray.Parse(websocketPayload);
            var commandNode = payload["command"];
            if (commandNode == null)
            {
                // TODO: Unrecognized command!
            }
            else
            {
                var command = commandNode.AsValue().ToString();
                if (String.Compare(command, "JIGGLE", true) == 0)
                {
                    MainPage.ShowToastNotification("Hello World", "Some things are too good to be true");
                }
            }
            var temp = "ticketId";
            return false;
        }

        private void Timer_Tick1(object sender, object e)
        {
            var qCurrentAnimation = from q in this.MontageViewModel.Photos
                                    where q.IsJiggle == true
                                    select q;
            if (qCurrentAnimation != null && qCurrentAnimation.Count() <= 70)
            {
                //Trace.WriteLine($"qCurrentAnimation.Count() = {qCurrentAnimation.Count()}");
                int random = new Random().Next(0, this.MontageViewModel.Photos.Count);
                this.MontageViewModel.Photos[random].IsJiggle = true;
            }

            //for (int i = 0; i < 50; i++)
            //{
            //}
        }

        public ViewModel.MontageVM MontageViewModel { get; set; }




    }
}
