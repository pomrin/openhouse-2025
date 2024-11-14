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

        internal bool AddNewPhoto(String imageUrl = null, String ticketId = null)
        {
            bool result = false;
            if (this.Photos.Count() < DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
            {
                var photoControlVM = new PhotoControlVM();
                if (!String.IsNullOrEmpty(imageUrl))
                {
                    photoControlVM.ImageUrl = imageUrl;
                }
                if (!String.IsNullOrEmpty(ticketId))
                {
                    photoControlVM.TicketId = ticketId;
                }
                this.Photos.Add(photoControlVM);
                result = true;
            }
            return result;
        }

        internal bool InsertNewPhoto(int index, String imageUrl = null, String ticketId = null)
        {
            bool result = false;
            if (this.Photos.Count() < DEFAULT_NUMBER_OF_PHOTOS_TO_DISPLAY)
            {
                var photoControlVM = new PhotoControlVM();
                if (!String.IsNullOrEmpty(imageUrl))
                {
                    photoControlVM.ImageUrl = imageUrl;
                }
                if (!String.IsNullOrEmpty(ticketId))
                {
                    photoControlVM.TicketId = ticketId;
                }
                index = Math.Min(index, this.Photos.Count()); // If the index to insert is larger than the list, it will append to the last
                this.Photos.Insert(index, photoControlVM);
                result = true;
            }
            return result;
        }

        public ObservableCollection<PhotoControlVM> Photos { get; private set; }
    }
}
