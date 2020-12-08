using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Procesos_Criterios_Negocio
    {
        public int Proceso_Criterio_ID { get; set; }
        public int Empresa_ID { get; set; }
        public int Criterio_ID { set;get; }
        public int Estatus_ID { set; get; }
        public string Nombre { get; set; }
        public string Descripcion { get;set; }
        public string Estatus { get; set; }
        public string Criterio { set; get; }
        public string Usuario_Creo { set; get; }
        public string Fecha_Creo { set; get; }
        public string Usuario_Modifico { set; get; }
        public string Fecha_Modifico { set; get; }
    }
}