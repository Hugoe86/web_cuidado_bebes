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
    
    public partial class Apl_Modulos
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Apl_Modulos()
        {
            this.Apl_Menus = new HashSet<Apl_Menus>();
        }
    
        public int Modulo_ID { get; set; }
        public string Nombre { get; set; }
        public string Usuario_Creo { get; set; }
        public Nullable<System.DateTime> Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public Nullable<System.DateTime> Fecha_Modifico { get; set; }
        public string Icono { get; set; }
        public Nullable<int> Orden { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Apl_Menus> Apl_Menus { get; set; }
    }
}