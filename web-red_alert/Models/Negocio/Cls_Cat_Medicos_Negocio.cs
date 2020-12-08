using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Medicos_Negocio: Cls_Auditoria
    {
        public int? Medico_Id { get; set; }

        public int? Especialidad_Id { get; set; }
        public int? Estatus_Id { get; set; }
        public string Estatus { get; set; }
        public string Especialidad { get; set; }


        public string Nombre { get; set; }
        public string Apellido_Paterno { get; set; }
        public string Apellido_Materno { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string No_Cedula { get; set; }
        public string Imagen { get; set; }
        public bool? Emergencias { get; set; }

        //public string Calle { get; set; }
        //public string Num_Interior { get; set; }
        //public string Num_Exterior { get; set; }
        //public string Colonia { get; set; }
        //public string Cp { get; set; }
        //public string Municipio { get; set; }
        //public string Estado { get; set; }
       
    }
}