using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Grupos_Criterios_Negocio
    {
        public int Grupo_ID { get; set; }
        public int Estatus_ID { set; get; }
        public string Nombre { get; set; }
        public string Observaciones { get; set; }
        public string Usuario_Creo { set; get; }
        public string Fecha_Creo { set; get; }
        public string Usuario_Modifico { set; get; }
        public string Fecha_Modifico { set; get; }
        public string Estatus { get; set; }
    }
}