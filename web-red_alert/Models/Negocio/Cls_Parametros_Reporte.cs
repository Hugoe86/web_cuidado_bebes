using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_trazabilidad.Models.Negocio.IngProd_Proyectos
{
    public class Cls_Parametros_Reporte
    {
        public static string RequstForm(string name)

        {

            return (HttpContext.Current.Request.Form[name] == null ? string.Empty : HttpContext.Current.Request.Form[name].ToString().Trim());

        }

        public static string RequstString(string sParam)

        {

            return (HttpContext.Current.Request[sParam] == null ? string.Empty : HttpContext.Current.Request[sParam].ToString().Trim());

        }

        public static string Consulta

        {

            get { return RequstString("Consulta"); }

        }
    }

}