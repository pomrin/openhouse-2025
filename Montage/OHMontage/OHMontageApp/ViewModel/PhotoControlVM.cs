using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Threading;


namespace OHMontageApp.ViewModel
{
    internal class PhotoControlVM : INotifyPropertyChanged
    {
        public PhotoControlVM()
        {
            if (new Random().NextInt64(0, 2) % 2 == 0)
            {
                this.BackgroundColor = Brushes.Red;
            }
            else
            {
                this.BackgroundColor = Brushes.Blue;
            }

            this.imageUrl = "https://openhouse2025-images-repo.s3.ap-southeast-1.amazonaws.com/user_profile/cyber-security.png ";

            DispatcherTimer dt = new DispatcherTimer();
            dt.Interval = new TimeSpan(0, 0, 0, 0, 50);
            dt.Tick += this.Dt_Tick;
            dt.Start();
        }

        private void Dt_Tick(object? sender, EventArgs e)
        {
            int a = (((int)this.BackgroundColor.Color.A) );
            int r = (((int)this.BackgroundColor.Color.R) + 5) % 256;
            int g = (((int)this.BackgroundColor.Color.G) + 0) % 256;
            int b = (((int)this.BackgroundColor.Color.B) + 0) % 256;

            var newColor = System.Windows.Media.Color.FromArgb((byte)a, (byte)r, (byte)g, (byte)b);
            this.BackgroundColor = new SolidColorBrush(newColor);
        }

        /// <summary>
        /// Defauult animation time in seconds.
        /// </summary>
        public static readonly int defaultAnimationDuration = 5;

        private String imageUrl;

        private bool isJiggle;

        private SolidColorBrush backgroundColor;

        public string ImageUrl
        {
            get
            {
                return this.imageUrl;
            }

            set
            {
                this.imageUrl = value;
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
                this.isJiggle = value;
                if (value != this.isJiggle)
                {
                    this.isJiggle = value;
                    NotifyPropertyChanged();
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
