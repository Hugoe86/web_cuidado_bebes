//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace datos_red_alert
{
    using System;
    using System.Collections.Generic;
    
    public partial class Tag
    {
        public int Id { get; set; }
        public Nullable<int> UsuarioId { get; set; }
        public string Palabra { get; set; }
        public Nullable<System.DateTime> FechaCreo { get; set; }
    
        public virtual Apl_Usuarios_Movil Apl_Usuarios_Movil { get; set; }
    }
}
