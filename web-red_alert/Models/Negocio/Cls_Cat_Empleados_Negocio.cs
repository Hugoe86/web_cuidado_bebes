using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Empleados_Negocio
    {
        public int Empleado_ID { get; set; }
        public int Empresa_ID { set; get; }
        public int Estatus_ID { set; get; }
        public string No_Empleado { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Email { get; set; }
        public int Nivel { get; set; }
        public string Planta { get; set; }
        public string Observaciones { get; set; }
        public string Usuario_Creo { set; get; }
        public string Fecha_Creo { set; get; }
        public string Usuario_Modifico { set; get; }
        public string Fecha_Modifico { set; get; }
        public string Estatus { get; set; }
        public string Empresa { get; set; }
        public string Empleado { get; set; }
        
    }
}