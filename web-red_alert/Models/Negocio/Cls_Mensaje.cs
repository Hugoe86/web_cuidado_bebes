﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Mensaje
    {
        public string Titulo { set; get; }
        public string Mensaje { set; get; }
        public string Estatus { set; get; }
        public string Url_PDF { set; get; }
        public string Url_Excel { set; get; }
        public string Consejo_Medico_Id { set; get; }
        public string Ruta_Archivo_Excel { set; get; }
        public string Nombre_Excel { set; get; }
        public bool isCreatePDF { set; get; }
        public bool isCreateExcel { set; get; }
        public bool isSendEmail { set; get; }
        public string ID { set; get; }
        public string Informe_Tecnico { set; get; }

    }
}
