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
    
    public partial class Apl_Menus
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Apl_Menus()
        {
            this.Apl_Accesos = new HashSet<Apl_Accesos>();
        }
    
        public int Menu_ID { get; set; }
        public int Estatus_ID { get; set; }
        public Nullable<int> Modulo_ID { get; set; }
        public string Parent_ID { get; set; }
        public string Menu_Descripcion { get; set; }
        public string URL_LINK { get; set; }
        public string Nombre_Mostrar { get; set; }
        public Nullable<decimal> Orden { get; set; }
        public string Usuario_Creo { get; set; }
        public Nullable<System.DateTime> Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public Nullable<System.DateTime> Fecha_Modifico { get; set; }
        public string Icono { get; set; }
        public Nullable<bool> Visible { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Apl_Accesos> Apl_Accesos { get; set; }
        public virtual Apl_Modulos Apl_Modulos { get; set; }
    }
}
