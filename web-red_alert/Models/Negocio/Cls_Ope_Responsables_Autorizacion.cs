using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_cambios_procesos.Models.Negocio
{
    public class Cls_Ope_Responsables_Autorizacion
    {
        public int No_Responsable_Autorizacion { get; set; }
        public int No_Alerta_Roja { get; set; }
        public int No_Empleado { set; get; }
        public string Aprobado { get; set; }
        public string Usuario_Creo { get; set; }
        public string Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
    }
}