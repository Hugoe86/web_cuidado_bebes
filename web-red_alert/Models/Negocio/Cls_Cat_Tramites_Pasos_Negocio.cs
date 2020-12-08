using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using web_trazabilidad.Models.Ayudante;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Cat_Tramites_Pasos_Negocio : Cls_Auditoria
    {
        public int? Paso_Id { get; set; }
        public int? Tramite_Id { get; set; }

        public String Descripcion { get; set; }
        public int Orden { get; set; }
        public byte[] Imagen { set; get; }

        //  para la carga de los datos adjuntos
        public String Nombre_Archivo { get; set; }
        public String Url_Archivo { get; set; }
        public Boolean Tiene_Imagen { get; set; }
    }
}