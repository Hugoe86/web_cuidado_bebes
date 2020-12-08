using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Apl_Bebes_Negocio
    {
        public int? BebeId { get; set; }


        public string Nombre { get; set; }
        public string Apellidos { get; set; }

        public DateTime FechaNacimiento { get; set; }
        public String StrFechaNacimiento { get; set; }

        public decimal Peso { get; set; }
        public decimal EstaturaCm { get; set; }

        public Boolean Sexo { get; set; }
        
        public string Padecimientos { get; set; }

        public string Fecha_Inicio { get; set; }
        public string Fecha_Termino { get; set; }
        public string Fecha_Reporte { get; set; }
    }
}