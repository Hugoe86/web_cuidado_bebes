using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Registro_Civil_Negocio
    {
        public int? Registro_Civil_Id { get; set; }
        public int? Estatus_Id { get; set; }
        public string Estatus { get; set; }

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
        public string Tramite { get; set; }
        public bool? Emergencias { get; set; }
        public String Lista_Horarios { get; set; }
        public String Lista_HorariosE { get; set; }

    }
}