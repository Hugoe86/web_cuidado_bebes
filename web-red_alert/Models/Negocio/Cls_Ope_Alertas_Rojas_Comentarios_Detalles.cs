using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Ope_Alertas_Rojas_Comentarios_Detalles
    {
        public int No_Alerta_Roja_Comentario_Detalles { get; set; }
        public int Empresa_ID { get; set; }
        public int No_Alerta_Roja { get; set; }
        public string Comentario { get; set; }
        public string No_Empleado { get; set; }
        public string Usuario_Creo { get; set; }
        public string Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
        public string Datos_Detalles_Comentarios { get; set; }
    }
}