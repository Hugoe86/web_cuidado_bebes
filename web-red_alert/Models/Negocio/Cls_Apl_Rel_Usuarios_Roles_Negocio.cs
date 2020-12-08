using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Apl_Rel_Usuarios_Roles_Negocio
    {
        public int Usuario_ID { get; set; }
        public int Rol_ID { get; set; }
        public Nullable <int> Sucursal_ID { get; set; }
        public int Empresa_ID { get; set; }
        public int Rel_Usuario_Rol_ID { get; set; }
    }
}