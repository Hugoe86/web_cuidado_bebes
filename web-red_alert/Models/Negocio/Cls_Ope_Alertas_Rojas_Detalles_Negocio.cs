using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Ope_Alertas_Rojas_Detalles_Negocio
    {
        public int No_Alerta_Roja_Detalle { get; set; }
        public int Empresa_ID { get; set; }
        public int No_Alerta_Roja { get; set; }
        public int Criterio_ID { get; set; }
        public int Valor { get; set; }
        public string Observaciones { get; set; }
        public string Usuario_Creo { get; set; }
        public string Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
        public string Criterio { get; set; }
    }
}