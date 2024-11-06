using AWSServerless1.WebSocketHelper;
using Newtonsoft.Json;
using OHMontageUWP.ApiDTO;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Windows.Media.Devices.Core;
using Windows.UI.ViewManagement;
using Windows.UI.Xaml;

namespace OHMontageUWP.ViewModel
{
    internal class MainWindowVM
    {

        private DispatcherTimer timer = new DispatcherTimer();
        public MainWindowVM()
        {
            this.MontageViewModel = new MontageVM();
            ////this.Photos = new ObservableCollection<PhotoControlVM>();

            //while (this.MontageViewModel.Photos.Count < MontageVM.DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
            //{
            //    this.MontageViewModel.AddNewPhoto();
            //}

            timer.Tick += Timer_Tick1;
            timer.Interval = new TimeSpan(0, 0, 0, 0, 10);
            timer.Start();

            WebsocketMessageHelper helper = new WebsocketMessageHelper();
            helper.AddMessageListener(LoadUserImage);
            helper.InitiateWebSocketClientAsync();

            LoadAllVisitorsFromDB();
        }

        private async Task LoadAllVisitorsFromDB()
        {
            var appConfig = new AppConfig();
            var s3BucketConfig = appConfig.GetS3BucketConfig();
            var apiSettings = appConfig.GetAPISettingsConfig();
            String visitorContent = null;
            using (var httpClient = new HttpClient()
            {
                BaseAddress = new Uri(apiSettings.Url)
            })
            {
                var response = await httpClient.GetAsync($"{ApiHelper.API_MONTAGE_VISITORS}?apiKey={apiSettings.API_KEY}");
                visitorContent = await response.Content.ReadAsStringAsync();
            }

            if (visitorContent != null)
            {
                var visitors = ApiHelper.DeserializeJson<List<VisitorInfoDTO>>(visitorContent);

                var qVisitorWithImage = from q in visitors
                                        where (!String.IsNullOrEmpty(q.ProfileImageUrl))
                                        select q;
                var visitorList = qVisitorWithImage.ToList();

                foreach (VisitorInfoDTO visitor in visitorList)
                {
                    if (!String.IsNullOrEmpty(visitor.ProfileImageUrl))
                    {
                        var fullImagePath = Path.Combine(s3BucketConfig.URL, visitor.TicketId, visitor.ProfileImageUrl);

                        this.MontageViewModel.AddNewPhoto(fullImagePath, visitor.TicketId);
                    }
                }
                // Populate the remaining of the grid with a default photo
                while (this.MontageViewModel.Photos.Count < MontageVM.DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
                {
                    this.MontageViewModel.AddNewPhoto();
                }
            }

        }

        public async Task<bool> LoadUserImage(string websocketPayload)
        {
            var appConfig = new AppConfig();
            var s3BucketConfig = appConfig.GetS3BucketConfig();
            var apiSettings = appConfig.GetAPISettingsConfig();


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
                    var ticketIdNode = payload["ticketId"];
                    if (ticketIdNode != null)
                    {
                        var ticketId = ticketIdNode.AsValue().ToString();
                        PhotoControlVM vmToUpdate = null;
                        var qExistingPhotoVM = from q in this.MontageViewModel.Photos
                                               where String.Compare(ticketId, q.TicketId, true) == 0
                                               select q;
                        if (qExistingPhotoVM != null && qExistingPhotoVM.Count() > 0)
                        {
                            vmToUpdate = qExistingPhotoVM.First();
                            vmToUpdate.IsJiggle = true;
                        }
                    }

                    MainPage.ShowToastNotification("Hello World", "Some things are too good to be true");
                }
                else if (String.Compare(command, "UPDATE_PHOTO", true) == 0)
                {
                }
                else if (String.Compare(command, "UPDATE_PHOTOS", true) == 0)
                {
                    var ticketIdNode = payload["message"];
                    if (ticketIdNode != null)
                    {
                        var ticketId = ticketIdNode.AsValue().ToString();
                        PhotoControlVM vmToUpdate = null;
                        // TODO: Check if ticketId already exist in the current Montage. If exist, update the photo. If don't exist, replace any emtpy one
                        var qExistingPhotoVM = from q in this.MontageViewModel.Photos
                                               where String.Compare(ticketId, q.TicketId, true) == 0
                                               select q;
                        if (qExistingPhotoVM != null && qExistingPhotoVM.Count() > 0)
                        {
                            vmToUpdate = qExistingPhotoVM.First();

                        }
                        else
                        {
                            var qFirstEmptyVM = from q in this.MontageViewModel.Photos
                                                where String.Compare(q.TicketId, "Empty", true) == 0
                                                select q;
                            if (qFirstEmptyVM != null && qFirstEmptyVM.Count() > 0)
                            {
                                vmToUpdate = qFirstEmptyVM.First();
                            }
                            else
                            {
                                vmToUpdate = qExistingPhotoVM.First();
                            }
                        }

                        if (vmToUpdate != null)
                        {
                            vmToUpdate.TicketId = ticketId;
                            String visitorContent = null;
                            using (var httpClient = new HttpClient()
                            {
                                BaseAddress = new Uri(apiSettings.Url)
                            })
                            {
                                var response = await httpClient.GetAsync($"{ApiHelper.API_MONTAGE_VISITORByTicketId}?ticketId={ticketId}&apiKey={apiSettings.API_KEY}");
                                visitorContent = await response.Content.ReadAsStringAsync();
                            }
                            if (visitorContent != null)
                            {
                                var visitor = ApiHelper.DeserializeJson<VisitorInfoDTO>(visitorContent);

                                if (!String.IsNullOrEmpty(visitor.ProfileImageUrl))
                                {
                                    var fullImagePath = Path.Combine(s3BucketConfig.URL, visitor.TicketId, visitor.ProfileImageUrl);
                                    vmToUpdate.ImageUrl = null;
                                    vmToUpdate.ImageUrl = fullImagePath;
                                }
                            }
                        }

                    }
                }
            }
            var temp = "ticketId";
            return false;
        }

        private void Timer_Tick1(object sender, object e)
        {
            //var qCurrentAnimation = from q in this.MontageViewModel.Photos
            //                        where q.IsJiggle == true
            //                        select q;
            //if (qCurrentAnimation != null && qCurrentAnimation.Count() <= 70)
            //{
            //    //Trace.WriteLine($"qCurrentAnimation.Count() = {qCurrentAnimation.Count()}");
            //    int random = new Random().Next(0, this.MontageViewModel.Photos.Count);
            //    this.MontageViewModel.Photos[random].IsJiggle = true;
            //}

            //for (int i = 0; i < 50; i++)
            //{
            //}
        }

        public ViewModel.MontageVM MontageViewModel { get; set; }




    }
}
