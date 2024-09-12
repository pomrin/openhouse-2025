using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OHMontageApp.ViewModel
{
    internal class MontageVM
    {
        public MontageVM()
        {
            this.generateSamplePhotosVM();
        }

        private void generateSamplePhotosVM()
        {
            if (this.Photos == null)
            {
                this.Photos = new ObservableCollection<PhotoControlVM>();
            }
        }

        internal bool AddNewPhoto()
        {
            bool result = false;
            if (this.Photos.Count() < 20)
            {
                this.Photos.Add(new PhotoControlVM());
                result = true;
            }
            return result;
        }

        public ObservableCollection<PhotoControlVM> Photos { get; private set; }
    }
}
