using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Tra_Cat_Parametros_Negocio
    {
        public int Parametro_ID { get; set; }
        public int Empresa_ID { get; set; }
        public string Tipo_Usuario { get; set; }
        public string Prefijo { get; set; }
        public string No_Intentos_Acceso { get; set; }
        public int? Menu_ID { get; set; }

    }
}