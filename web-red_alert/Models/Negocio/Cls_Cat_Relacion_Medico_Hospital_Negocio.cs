using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Relacion_Medico_Hospital_Negocio
    {
        public int? Relacion_Id { get; set; }//   variable para el id
        public int? Medico_Id { get; set; }//   variable para el id
        public int? Hospital_Id { get; set; }//   variable para el id

        public String Medico { get; set; }//   variable para el id
        public String Hospital { get; set; }//   variable para el id
        public decimal? Costo_Consulta{get;set;}


    }
}