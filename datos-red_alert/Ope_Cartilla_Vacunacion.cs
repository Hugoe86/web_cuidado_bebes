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
    
    public partial class Ope_Cartilla_Vacunacion
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Ope_Cartilla_Vacunacion()
        {
            this.Ope_Aplicacion_Vacunas = new HashSet<Ope_Aplicacion_Vacunas>();
        }
    
        public int Relacion_Id { get; set; }
        public int Mes_Id { get; set; }
        public int Vacuna_Id { get; set; }
        public string Usuario_Creo { get; set; }
        public Nullable<System.DateTime> Fecha_Creo { get; set; }
        public string Usuario_Modifico { get; set; }
        public Nullable<System.DateTime> Fecha_Modifico { get; set; }
        public string Dosis { get; set; }
        public string Enfermedad { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Ope_Aplicacion_Vacunas> Ope_Aplicacion_Vacunas { get; set; }
    }
}
