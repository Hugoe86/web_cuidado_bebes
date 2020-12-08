using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;
namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Ubicaciones_Negocio : Cls_Auditoria
    {
        public int? Ubicacion_Id { get; set; }
        public int? Estatus_Id { get; set; }
        public string Estatus { get; set; }
        public int? Tipo_Instalacion_Id { get; set; }
        public string Tipo_Instalacion { get; set; }


        public string Nombre { get; set; }
        public decimal? Longitud { get; set; }
        public decimal? Latitud { get; set; }
        public TimeSpan Horario_Inicio { get; set; }
        public string Str_Horario_Inicio { get; set; }
        public TimeSpan Horario_Termino { get; set; }
        public string Str_Horario_Termino { get; set; }
        public Boolean Lunes { get; set; }
        public Boolean Martes { get; set; }
        public Boolean Miercoles { get; set; }
        public Boolean Jueves { get; set; }
        public Boolean Viernes { get; set; }
        public Boolean Sabado { get; set; }
        public Boolean Domingo { get; set; }
        public Boolean Abierto { get; set; }

        public string Telefono { get; set; }
        public string Telefono_Urgencias { get; set; }
        public string Sitio_Web_URL { get; set; }
        public string Observaciones { get; set; }
        public bool? Emergencias { get; set; }
        //horarios
        public string Lista_Horarios { get; set; }
        public string Lista_HorariosE { get; set; }
    }
}