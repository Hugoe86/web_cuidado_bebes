using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Criterios_Negocio
    {
        public int Criterio_ID { get; set; }
        public int Estatus_ID { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Usuario_Creo { get; set; }
        public string Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
        public string Estatus { get; set; }
    }
}