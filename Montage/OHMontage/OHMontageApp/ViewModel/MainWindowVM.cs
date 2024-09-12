using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Windows.Threading;

namespace OHMontageApp.ViewModel
{
    internal class MainWindowVM
    {

        private DispatcherTimer timer = new DispatcherTimer();
        public MainWindowVM()
        {
            this.MontageViewModel = new MontageVM();
            //this.Photos = new ObservableCollection<PhotoControlVM>();

            timer.Tick += this.Timer_Tick;
            timer.Interval = new TimeSpan(0, 0, 0,0 , 1);
            timer.Start();
            
        }

        private void Timer_Tick(object? sender, EventArgs e)
        {
            if (!this.MontageViewModel.AddNewPhoto())
            {
                timer.Stop();
            }
        }

        public ViewModel.MontageVM MontageViewModel { get; set; }




    }
}
