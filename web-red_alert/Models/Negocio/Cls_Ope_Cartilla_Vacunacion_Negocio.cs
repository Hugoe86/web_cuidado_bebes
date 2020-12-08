using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Ope_Cartilla_Vacunacion_Negocio : Cls_Auditoria
    {
        public int? Relacion_Id { get; set; }
        public int? Mes_Id { get; set; }
        public int? Vacuna_Id { get; set; }

        public String Vacuna { get; set; }
        public String Dosis { get; set; }
        public String Enfermedad { get; set; }

        
    }
}