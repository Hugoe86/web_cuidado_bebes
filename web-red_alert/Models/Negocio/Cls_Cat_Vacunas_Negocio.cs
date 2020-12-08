using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Vacunas_Negocio: Cls_Auditoria
    {
        public int? Vacuna_Id { get; set; }
        public int? Estatus_Id { get; set; }

        public string Estatus { get; set; }
        public string Nombre { get; set; }

        //public int Meses_Aplicacion { get; set; }

    }
}