using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace web_trazabilidad.Models.Ayudante
{
    public class AppSettings
    {

        public static string Servicio_Notifiaciones
        {
            get
            {
                return WebConfigurationManager.AppSettings["Servicio_Notifiaciones"];
            }
        }


        //public static string FtpUrlServer
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpUrlServer"];
        //    }
        //}

        //public static string FtpPortServer
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpPortServer"];
        //    }
        //}

        //public static string FtpUserServer
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpUserServer"];
        //    }
        //}

        //public static string FtpPasswordServer
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpPasswordServer"];
        //    }
        //}

        //public static string FtpKeepAlive
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpKeepAlive"];
        //    }
        //}

        //public static string FtpUsePassive
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpUsePassive"];
        //    }
        //}

        //public static string FtpUseBinary
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpUseBinary"];
        //    }
        //}

        //public static string FtpTimeout
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpTimeout"];
        //    }
        //}

        //public static string FtpUrlUpload
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FtpUrlUpload"];
        //    }
        //}

        //public static string FolderUpload
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FolderUpload"];
        //    }
        //}

        //public static string[] FileExtensions
        //{
        //    get
        //    {
        //        return WebConfigurationManager.AppSettings["FileExtensions"].ToString().Split(',');
        //    }
        //}

    }
}