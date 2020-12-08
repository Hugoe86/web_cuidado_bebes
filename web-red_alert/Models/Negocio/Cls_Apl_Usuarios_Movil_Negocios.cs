using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Apl_Usuarios_Movil_Negocios : Cls_Auditoria
    {
        public int? UsuarioMovilId { get; set; }

        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Correo { get; set; }
        public string Contrasena { get; set; }
        public string Token { get; set; }

        public string Fecha_Inicio { get; set; }
        public string Fecha_Termino { get; set; }
        public string Fecha_Reporte { get; set; }
    }
}