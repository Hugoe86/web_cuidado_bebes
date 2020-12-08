using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Responsables_Autorizacion_Negocio
    {
        public int Responsable_ID { get; set; }
        public int Criterio_Autorizacion_ID { set; get; }
        public string No_Empleado { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Usuario_Creo { get; set; }
        public string Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
    }
}