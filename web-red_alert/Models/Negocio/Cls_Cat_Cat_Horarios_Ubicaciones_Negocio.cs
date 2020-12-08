using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Cat_Horarios_Ubicaciones_Negocio
    {
        public int? Ubicacion_Id { get; set; }
        public int Horario_Ubicacion_ID { get; set; }
        public string Dia { get; set; }
        public TimeSpan? Horario_Inicio { get; set; }
        public TimeSpan? Horario_Termino { get; set; }
        public string Estatus { get; set; }
    }
}