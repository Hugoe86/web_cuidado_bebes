using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Ope_Inspecciones_Negocio
    {
        public int Inspeccion_ID { get; set; }
        public string Dispositivo_ID { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public int Nivel_Bateria { get; set; }
        public string Codigo_Barras { get; set; }
        public string Comentarios { get; set; }
        public DateTime Fecha_Creo { get; set; }
        public string Dispositivo { get; set; }
    }
}