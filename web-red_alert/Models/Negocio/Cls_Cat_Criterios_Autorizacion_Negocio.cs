using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Criterios_Autorizacion_Negocio
    {
        public int Criterio_Autorizacion_ID { get; set; }
        public int Nodo_ID { get; set; }
        public int Departamento_ID { set; get; }
        public int Estatus_ID { get; set; }
        public int Grupo_ID { get; set; }
        public string Nombre { get; set; }
        public string Tipo_Criterio { get; set; }
        public string Usuario_Creo { get; set; }
        public string Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
        public string Departamento { get; set; }
        public string Nodo { get; set; }
        public string Estatus { get; set; }
        public string Grupo { get; set; }
        public string Detalles { get; set; }
    }
}