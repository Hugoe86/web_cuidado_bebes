using System;
using System.Collections.Generic;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Ope_Reproducciones_Negocio
    {
        public int Reproduccion_ID { get; set; }
        public string Video { get; set; }
        public DateTime Fecha_Creo { get; set; }
        public string Longitud { get; set; }
        public string Latitud { get; set; }
        public string folio_reproduccion { get; set; } 
    }
}