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
    
    public partial class Cat_Horarios_Registro_Civil
    {
        public int Horario_Registro_Civil_Id { get; set; }
        public Nullable<int> Registro_Civil_Id { get; set; }
        public string Dia { get; set; }
        public Nullable<System.TimeSpan> Horario_Inicio { get; set; }
        public Nullable<System.TimeSpan> Horario_Termino { get; set; }
    
        public virtual Cat_Registro_Civil Cat_Registro_Civil { get; set; }
    }
}
