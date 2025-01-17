﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Media;


namespace OHMontageUWP.ViewModel
{
    internal class PhotoControlVM : INotifyPropertyChanged
    {

        public static readonly double MAX_OPACITIY = 0.9;
        public static readonly double MIN_OPACITIY = 0.6;

        public static readonly String DEFAULT_TICKET_ID = "Empty";

        private DispatcherTimer timer = new DispatcherTimer()
        {
            Interval = new TimeSpan(0, 0, 3),
        };

        private DispatcherTimer opacityTimer = new DispatcherTimer()
        {
            Interval = new TimeSpan(0, 0, 0, 0, 100)
        };


        public PhotoControlVM()
        {

            //if (new Random().NextInt64(0, 2) == 1)
            //{
            //    this.BackgroundColor = Brushes.Transparent;
            //    this.IsJiggle = false;
            //}
            //else
            //{
            //    this.BackgroundColor = Brushes.Transparent;
            //    this.IsJiggle = true;
            //}

            //this.imageUrl = "https://openhouse2025-images-repo.s3.ap-southeast-1.amazonaws.com/user_profile/cyber-security.png";
            this.ImageUrl = ProjectHelper.GetDefaultUserPhotoImage();
            this.AnimationImageUrl = "";
            timer.Tick += Timer_Tick;
            this.IsJiggle = false;
            this.opacity = MAX_OPACITIY;

            this.opacityTimer.Tick += OpacityTimer_Tick;
            //this.opacityTimer.Start();
        }

        private void OpacityTimer_Tick(object sender, object e)
        {
            this.Opacity += opacityDiff;
            if (this.Opacity >= MAX_OPACITIY)
            {
                this.Opacity = MAX_OPACITIY;
                opacityDiff = opacityDiff * -1;
            }
            else if (this.Opacity <= MIN_OPACITIY)
            {
                this.Opacity = MIN_OPACITIY;
                opacityDiff = opacityDiff * -1;
            }
        }

        private void Timer_Tick(object sender, object e)
        {

            if (this.IsJiggle)
            {
                this.AnimationImageUrl = "";
                this.IsJiggle = false;
            }
            this.timer.Stop();
            //else
            //{
            //    var random = new Random().NextInt64(0, 10);
            //    switch (random)
            //    {
            //        case 1:
            //            this.IsJiggle = true;
            //            break;
            //        case 2:
            //            this.IsJiggle = true;
            //            break;
            //        default:
            //            break;
            //    }
            //}

            //int a = (((int)this.BackgroundColor.Color.A) );
            //int r = (((int)this.BackgroundColor.Color.R) + 5) % 256;
            //int g = (((int)this.BackgroundColor.Color.G) + 0) % 256;
            //int b = (((int)this.BackgroundColor.Color.B) + 0) % 256;

            //var newColor = System.Windows.Media.Color.FromArgb((byte)a, (byte)r, (byte)g, (byte)b);
            //this.BackgroundColor = new SolidColorBrush(newColor);
        }

        public void startOpacityAnimation()
        {
            this.opacityTimer.Start();
        }

        public void stopOpacityAnimation()
        {
            this.Opacity = 1;
            this.opacityTimer.Stop();
        }

        /// <summary>
        /// Defauult animation time in seconds.
        /// </summary>
        public static readonly int defaultAnimationDuration = 5;

        private String imageUrl;

        private bool isJiggle;

        private SolidColorBrush backgroundColor;

        private String animationImageUrl;

        private String ticketId;

        private Double opacity;

        private double opacityDiff = 0.05;

        public string ImageUrl
        {
            get
            {
                return this.imageUrl;
            }

            set
            {
                if (value != this.imageUrl)
                {
                    this.imageUrl = value;
                    NotifyPropertyChanged();
                }
            }
        }

        public bool IsJiggle
        {
            get
            {
                return this.isJiggle;
            }

            set
            {
                if (value != this.isJiggle)
                {
                    this.isJiggle = value;

                    if (value)
                    {
                        if (!this.timer.IsEnabled)
                        {
                            this.timer.Start();
                            switch (new Random().Next(1, 8))
                            {
                                case 1:
                                    this.AnimationImageUrl = ProjectHelper.GetDefaultAnimationUrl();
                                    break;
                                case 2:
                                    this.AnimationImageUrl = ProjectHelper.GetDefaultAnimationUrl2();
                                    break;
                                case 3:
                                    this.AnimationImageUrl = ProjectHelper.GetDefaultAnimationUrl3();
                                    break;
                                case 4:
                                    this.AnimationImageUrl = ProjectHelper.GetDefaultAnimationUrl4();
                                    break;
                                case 5:
                                    this.AnimationImageUrl = ProjectHelper.GetDefaultAnimationUrl5();
                                    break;
                                case 6:
                                    this.AnimationImageUrl = ProjectHelper.GetDefaultAnimationUrl6();
                                    break;
                                case 7:
                                    this.AnimationImageUrl = ProjectHelper.GetDefaultAnimationUrl7();
                                    break;
                            }
                        }
                        else // Reset the timer if already started so animation continues for another x Seconds.
                        {
                            this.timer.Stop();
                            this.timer.Start();
                        }
                    }
                    else
                    {
                        this.AnimationImageUrl = "";
                        this.timer.Stop();
                    }
                    NotifyPropertyChanged();
                    NotifyPropertyChanged("IsJiggleVisibility");
                }
                else
                {
                    if (this.timer.IsEnabled)// Reset the timer if already started so animation continues for another x Seconds.
                    {
                        this.timer.Stop();
                        this.timer.Start();
                    }
                }
            }
        }

        public Visibility IsJiggleVisibility
        {
            get
            {
                if (this.isJiggle)
                {
                    return Visibility.Visible;
                }
                else
                {
                    return Visibility.Collapsed;
                }
            }
        }


        public SolidColorBrush BackgroundColor
        {
            get
            {
                return this.backgroundColor;
            }

            set
            {
                if (value != this.backgroundColor)
                {
                    this.backgroundColor = value;
                    NotifyPropertyChanged();
                }
            }
        }

        public string AnimationImageUrl
        {
            get
            {
                return animationImageUrl;
            }

            set
            {
                if (value != this.animationImageUrl)
                {
                    this.animationImageUrl = value;
                    NotifyPropertyChanged();
                }
            }
        }

        public string TicketId
        {
            get
            {
                if (!String.IsNullOrEmpty(this.ticketId))
                {
                    return this.ticketId;
                }
                else
                {
                    return DEFAULT_TICKET_ID;
                }
            }

            set
            {
                if (value != this.ticketId)
                {
                    this.ticketId = value;
                    NotifyPropertyChanged();
                }
            }
        }

        public double Opacity
        {
            get
            {
                return opacity;
            }

            set
            {
                if (value != this.opacity)
                {
                    opacity = value;
                    NotifyPropertyChanged();
                }
            }
        }

        public bool OpacityTimerStatus
        {
            get
            {
                return this.opacityTimer.IsEnabled;
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        // This method is called by the Set accessor of each property.  
        // The CallerMemberName attribute that is applied to the optional propertyName  
        // parameter causes the property name of the caller to be substituted as an argument.  
        private void NotifyPropertyChanged([CallerMemberName] String propertyName = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
