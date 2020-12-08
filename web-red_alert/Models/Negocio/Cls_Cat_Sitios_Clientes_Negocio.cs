using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_cambios_procesos.Models.Negocio
{
    public class Cls_Cat_Sitios_Clientes_Negocio
    {
        public int Sitio_Cliente_ID { get; set; }
        public int Empresa_ID { set; get; }
        public int Cliente_ID { set; get; }
        public int Estatus_ID { get; set; }
        public string Nombre { get; set; }
        public string Observaciones { get; set; }
        public string Usuario_Creo { set; get; }
        public string Fecha_Creo { set; get; }
        public string Usuario_Modifico { set; get; }
        public string Fecha_Modifico { set; get; }
        public string Estatus { get; set; }
        public string Cliente { get; set; }
    }
}