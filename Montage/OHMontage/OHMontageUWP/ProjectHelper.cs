using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace OHMontageUWP
{
    public static class ProjectHelper
    {

        public static readonly String JIGGLE_ANIMATION_RESOURCE_PATH = "JiggleAnimationResources";
        public static readonly String DEFAULT_USER_IMAGE_NAME = "defaultuser.png";

        public static String GetProjectImageFolder()
        {
            String folderPath = null;
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            if (!String.IsNullOrEmpty(path))
            {
                folderPath = Path.Combine(path, "/Images/");
            }
            return folderPath;
        }

        public static String GetProjectJiggleFolder()
        {
            String folderPath = null;
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            if (!String.IsNullOrEmpty(path))
            {
                folderPath = Path.Combine(path, "/Images/JiggleAnimationResources/");
            }
            return folderPath;
        }

        public static String GetDefaultUserPhotoImage()
        {
            String folderPath = null;
            var imageFolder = GetProjectImageFolder();
            if (imageFolder != null)
            {
                folderPath = Path.Combine(imageFolder, "defaultuser.png");
            }
            return folderPath;
        }

        public static String GetDefaultAnimationUrl()
        {
            String folderPath = null;
            var jiggleFolder = GetProjectJiggleFolder();
            if (jiggleFolder != null)
            {
                folderPath = Path.Combine(jiggleFolder, "floating_balloon.gif");
            }
            return folderPath;
        }

        public static String GetDefaultAnimationUrl2()
        {
            String folderPath = null;
            var jiggleFolder = GetProjectJiggleFolder();
            if (jiggleFolder != null)
            {
                folderPath = Path.Combine(jiggleFolder, "floating_balloon2.gif");
            }
            return folderPath;
        }

        public static String GetDefaultAnimationUrl3()
        {
            String folderPath = null;
            var jiggleFolder = GetProjectJiggleFolder();
            if (jiggleFolder != null)
            {
                folderPath = Path.Combine(jiggleFolder, "floating_balloon3.gif");
            }
            return folderPath;
        }
    }
}
