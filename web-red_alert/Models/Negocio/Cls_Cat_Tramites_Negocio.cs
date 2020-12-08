using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Tramites_Negocio : Cls_Auditoria
    {
        public int? Tramite_Id { get; set; }
        public String Nombre { get; set; }
        public int Estatus_Id { get; set; }

        public String Estatus { get; set; }
    }
}