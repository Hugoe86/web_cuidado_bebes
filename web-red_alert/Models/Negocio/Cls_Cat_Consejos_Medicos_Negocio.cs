using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Consejos_Medicos_Negocio : Cls_Auditoria
    {
        public int? Consejo_Id { get; set; }
        public int? Estatus_Id { get; set; }
        public string Estatus { get; set; }


        public string Consejo { get; set; }
        public string Descripcion { get; set; }
        public string Url { get; set; }
        public string Tags { get; set; }
    }
}