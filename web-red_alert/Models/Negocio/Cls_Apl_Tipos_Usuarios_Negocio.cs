using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Apl_Tipos_Usuarios_Negocio
    {
        public int Tipo_Usuario_ID { get; set; }
        public string Nombre { get; set; }
        public string Usuario_Creo { get; set; }
        public string Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
    }
}