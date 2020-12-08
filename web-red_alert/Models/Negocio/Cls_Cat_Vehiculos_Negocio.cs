using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_cambios_procesos.Models.Negocio
{
    public class Cls_Cat_Vehiculos_Negocio
    {
        public int Vehiculo_ID { get; set; }
        public int Empresa_ID { set; get; }
        public int Sitio_Cliente_ID { get; set; }
        public int Estatus_ID { set; get; }
        public string Nombre { get; set; }
        public string Observaciones { get; set; }
        public string Usuario_Creo { set; get; }
        public string Fecha_Creo { set; get; }
        public string Usuario_Modifico { set; get; }
        public string Fecha_Modifico { set; get; }
        public string Estatus { get; set; }
        public string Sitio_Cliente { get; set; } 
    }
}