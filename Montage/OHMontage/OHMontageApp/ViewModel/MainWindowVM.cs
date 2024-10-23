using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Windows.Threading;

namespace OHMontageApp.ViewModel
{
    internal class MainWindowVM
    {

        private DispatcherTimer timer = new DispatcherTimer(DispatcherPriority.Render);
        public MainWindowVM()
        {
            this.MontageViewModel = new MontageVM();
            //this.Photos = new ObservableCollection<PhotoControlVM>();

            while (this.MontageViewModel.Photos.Count < MontageVM.DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
            {
                this.MontageViewModel.AddNewPhoto();
            }

            timer.Tick += this.Timer_Tick;
            timer.Interval = new TimeSpan(0, 0, 0, 0, 100);
            timer.Start();
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            var qCurrentAnimation = from q in this.MontageViewModel.Photos
                                    where q.IsJiggle == true
                                    select q;
            if (qCurrentAnimation != null && qCurrentAnimation.Count() <= 70)
            {
                Trace.WriteLine($"qCurrentAnimation.Count() = {qCurrentAnimation.Count()}");
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
