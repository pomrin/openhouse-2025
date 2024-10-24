using System;
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
using System.Windows.Media;
using System.Windows.Threading;


namespace OHMontageApp.ViewModel
{
    internal class PhotoControlVM : INotifyPropertyChanged
    {


        DispatcherTimer timer = new DispatcherTimer(DispatcherPriority.Render)
        {
            Interval = new TimeSpan(0, 0, 3),
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
            timer.Tick += Dt_Tick;
            this.IsJiggle = false;
        }

        private void Dt_Tick(object? sender, EventArgs e)
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

        /// <summary>
        /// Defauult animation time in seconds.
        /// </summary>
        public static readonly int defaultAnimationDuration = 5;

        private String imageUrl;

        private bool isJiggle;

        private SolidColorBrush backgroundColor;

        private String animationImageUrl;

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
                            switch (new Random().NextInt64(1, 4))
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
                    return Visibility.Hidden;
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
