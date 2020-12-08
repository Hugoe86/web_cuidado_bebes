using System;
using System.Drawing;
using System.IO;

namespace web_red_alert.Models.Ayudante
{
    public class Cls_Base64_Image
    {
        public byte[] ImageToByteArray(System.Drawing.Image imageIn)
        {
            using (var ms = new MemoryStream())
            {
                imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
                return ms.ToArray();
            }
        }
        //public string CreateBase64Image(byte[] imageBytes)
        //{
        //    Image streamImage;

        //    using (MemoryStream ms = new MemoryStream(imageBytes))
        //    {
        //        /* Create a new image, saved as a scaled version of the original */
        //        streamImage = ScaleImage(Image.FromStream(ms));
        //    }
        //    using (MemoryStream ms = new MemoryStream())
        //    {
        //        /* Convert this image back to a base64 string */
        //        streamImage.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
        //        return Convert.ToBase64String(ms.ToArray());
        //    }
        //}
        public string ConvertBytesToBase64(byte[] imageBytes)
        {
            return Convert.ToBase64String(imageBytes);
        }
        public string ImageToBase64(Image image, System.Drawing.Imaging.ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }
        }

    }
}