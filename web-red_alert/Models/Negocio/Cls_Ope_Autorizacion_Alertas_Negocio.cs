using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Ope_Autorizacion_Alertas_Negocio
    {
        public int No_Autorizacion { get; set; }
        public int No_Extension { set; get; }
        public int No_Cambio { set; get; }
        public string Empleado { get; set; }
        public string Email { get; set; }
        public int Departamento_ID { set; get; }
        public int Empleado_ID { set; get; }
        public DateTime? Fecha_Creo { get; set; }
        public string Aprobado { set; get; }
        public string Departamento { set; get; }
        public string Descripcion_Cambio { set; get; }
        public int Nivel { set; get; }
        public string Motivo_Rechazo { set; get; }
        public int Validador_ID { set; get; }
        public string Cierre { set; get; }
    }
}