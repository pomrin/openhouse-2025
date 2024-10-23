using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OHMontageUWP.ViewModel
{
    internal class MontageVM
    {
        public static readonly int DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY = 1000;

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
            //while (this.Photos.Count < DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
            //{
            //    this.AddNewPhoto();
            //}
        }

        internal bool AddNewPhoto()
        {
            bool result = false;
            if (this.Photos.Count() < DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
            {
                this.Photos.Add(new PhotoControlVM());
                result = true;
            }
            return result;
        }

        public ObservableCollection<PhotoControlVM> Photos { get; private set; }
    }
}
