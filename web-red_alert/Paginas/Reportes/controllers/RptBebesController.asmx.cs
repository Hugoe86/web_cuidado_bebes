using datos_red_alert;
using LitJson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using web_red_alert.Models.Negocio;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Data;
using OfficeOpenXml;



namespace web_red_alert.Paginas.Reportes.controllers
{
    /// <summary>
    /// Descripción breve de RptBebesController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class RptBebesController : System.Web.Services.WebService
    {

        #region Consultas


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Bebes_Filtro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Apl_Bebes_Negocio Obj = new Cls_Apl_Bebes_Negocio();

            DateTime fecha_inicio = DateTime.MinValue;
            DateTime fecha_termino = DateTime.MinValue;

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Apl_Bebes_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    if (!string.IsNullOrEmpty(Obj.Fecha_Inicio))
                    {
                        DateTime.TryParseExact(Obj.Fecha_Inicio, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out fecha_inicio);
                    }
                    if (!string.IsNullOrEmpty(Obj.Fecha_Termino))
                    {
                        DateTime.TryParseExact(Obj.Fecha_Termino, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out fecha_termino);
                        fecha_termino = fecha_termino.AddDays(1);
                    }


                    var _rptBebes = (from _bebe in dbContext.Apl_Bebes                                     

                                     where ((Obj.BebeId > 0) ? _bebe.BebeId == Obj.BebeId : true)
                                     && ((Obj.Nombre != "") ? _bebe.Nombre.ToString().Contains(Obj.Nombre.ToString()) : true)
                                     && ((Obj.Apellidos != "") ? _bebe.Apellidos.ToString().Contains(Obj.Apellidos.ToString()) : true)
                                      


                                     //entre dos fechas
                                        && (((!string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (!string.IsNullOrEmpty(Obj.Fecha_Termino))) ? ((_bebe.FechaNacimiento >= fecha_inicio) && (_bebe.FechaNacimiento <= fecha_termino)) : true)

                                        //mayor a la fecha de inicio
                                        && (((!string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (string.IsNullOrEmpty(Obj.Fecha_Termino))) ? (_bebe.FechaNacimiento >= fecha_inicio) : true)

                                        //menor a la fecha de termino
                                        && (((string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (!string.IsNullOrEmpty(Obj.Fecha_Termino))) ? (_bebe.FechaNacimiento <= fecha_termino) : true)



                                     select new Cls_Apl_Bebes_Negocio
                                     {
                                         BebeId = _bebe.BebeId,
                                         Apellidos = _bebe.Apellidos,
                                         Nombre = _bebe.Nombre,
                                         StrFechaNacimiento = "",
                                         FechaNacimiento = _bebe.FechaNacimiento.Value,
                                         //Peso = _datos_bebe.Peso ?? 0,
                                         //EstaturaCm = _datos_bebe.Estatura ?? 0,
                                         Sexo = _bebe.Sexo ?? false,
                                         Padecimientos = _bebe.Padecimientos,

                                     }).OrderBy(x => x.Apellidos).ToList();


                    foreach (var Registro in _rptBebes.ToList())
                    {
                        Registro.StrFechaNacimiento = Registro.FechaNacimiento.ToString("dd/MMM/yyyy");


                        var _peso_bebe = dbContext.Apl_Historial_Bebes
                            .Where(c => c.BebeId == Registro.BebeId && c.Tipo == "PESO")
                            .OrderByDescending(t => t.FechaCreo)
                            .FirstOrDefault();
                        Registro.Peso = _peso_bebe.Peso.Value;


                        var _estatura_bebe = dbContext.Apl_Historial_Bebes
                            .Where(c => c.BebeId == Registro.BebeId && c.Tipo == "ESTATURA")
                            .OrderByDescending(t => t.FechaCreo)
                            .FirstOrDefault();
                        Registro.EstaturaCm = _estatura_bebe.Estatura.Value;
                    }


                    Json_Resultado = JsonConvert.SerializeObject(_rptBebes.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }

        #endregion



        #region Pdf
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Cls_Mensaje Genere_Reporte_PDF_Bebes(string jsonObject)
        {
            iTextSharp.text.Document Documento = new iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER.Rotate(), 25, 25, 20, 20);
            Cls_Apl_Bebes_Negocio Obj = new Cls_Apl_Bebes_Negocio();
            bool Generado = false;
            Cls_Mensaje Mensaje = new Cls_Mensaje();


            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Apl_Bebes_Negocio>(jsonObject);

                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                string Fecha = DateTime.Now.ToString("dd-MM-yyyy__HH_mm_ss");
                string Nombre_Archivo = "Bebes_" + Fecha + ".pdf";
                string Ruta_Archivo = Server.MapPath("../../../Reportes/Bebes/") + Nombre_Archivo;
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                FileStream Archivo = new FileStream(Ruta_Archivo, FileMode.Create, FileAccess.Write, FileShare.ReadWrite);
                iTextSharp.text.pdf.PdfWriter pw = iTextSharp.text.pdf.PdfWriter.GetInstance(Documento, Archivo);
                pw.PageEvent = new FooterPDf();

                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Documento.Open();
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Exportar_Datos_Pdf(Obj, Documento);
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Documento.Close();
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Generado = true;
                Mensaje.Estatus = "success";
                Mensaje.isCreatePDF = true;
                Mensaje.Url_PDF = "../../Reportes/Bebes/" + Nombre_Archivo;
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


            }
            catch (Exception e)
            {
                Generado = false;
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "Error al generar el documento";

            }

            return Mensaje;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="No_Venta"></param>
        /// <param name="Documento"></param>
        public void Exportar_Datos_Pdf(Cls_Apl_Bebes_Negocio Obj, iTextSharp.text.Document Documento)
        {
            DataTable Dt_Encabezado = new DataTable();
            DataTable Dt_Detalle = new DataTable();
            DataTable Dt_Empresa = new DataTable();
            String Str_Encabezado_Productos = "";
            float[] Ancho_6valores = new float[] { 1f, 2f, 1f, 1f, 1f, 1f };
            float[] Ancho_7valores = new float[] { 1f, 1f, 1f, 0.5f, 0.5f, 1f, 2f };
            float[] Ancho_2valores = new float[] { 2f, 0.3f };
            float[] Ancho_2valores_Cliente = new float[] { 0.3f, 2f };
            float[] Ancho_3valores_Total_Partidas = new float[] { 0.3f, 0.07f, 1f };
            float[] Ancho_3valores = new float[] { 1f, 1f, 1f };



            Int32 Int_Tamaño_Letra_Titulo = 12;
            Int32 Int_Tamaño_Letra_Encabezado_Guion = 8;
            Int32 Int_Tamaño_Letra_Encabezado_Bebes = 9;
            Int32 Int_Tamaño_Letra_Detalles = 8;

            try
            {
                Str_Encabezado_Productos = "-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    iTextSharp.text.FontFactory.RegisterDirectory(@"C:\Windows\Fonts");


                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    #region Consultas


                    DateTime fecha_inicio = DateTime.MinValue;
                    DateTime fecha_termino = DateTime.MinValue;


                    if (!string.IsNullOrEmpty(Obj.Fecha_Inicio))
                    {
                        DateTime.TryParseExact(Obj.Fecha_Inicio, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out fecha_inicio);
                    }
                    if (!string.IsNullOrEmpty(Obj.Fecha_Termino))
                    {
                        DateTime.TryParseExact(Obj.Fecha_Termino, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out fecha_termino);
                        fecha_termino = fecha_termino.AddDays(1);
                    }



                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  Encabezado de la venta
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    var _rptBebes = (from _bebe in dbContext.Apl_Bebes

                                     where ((Obj.BebeId > 0) ? _bebe.BebeId == Obj.BebeId : true)
                                     && ((Obj.Nombre != "") ? _bebe.Nombre.ToString().Contains(Obj.Nombre.ToString()) : true)
                                     && ((Obj.Apellidos != "") ? _bebe.Apellidos.ToString().Contains(Obj.Apellidos.ToString()) : true)
                                     //entre dos fechas
                                     && (((!string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (!string.IsNullOrEmpty(Obj.Fecha_Termino))) ? ((_bebe.FechaNacimiento >= fecha_inicio) && (_bebe.FechaNacimiento <= fecha_termino)) : true)
                                     //mayor a la fecha de inicio
                                     && (((!string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (string.IsNullOrEmpty(Obj.Fecha_Termino))) ? (_bebe.FechaNacimiento >= fecha_inicio) : true)
                                     //menor a la fecha de termino
                                     && (((string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (!string.IsNullOrEmpty(Obj.Fecha_Termino))) ? (_bebe.FechaNacimiento <= fecha_termino) : true)

                                     select new Cls_Apl_Bebes_Negocio
                                     {
                                         BebeId = _bebe.BebeId,
                                         Apellidos = _bebe.Apellidos,
                                         Nombre = _bebe.Nombre,
                                         StrFechaNacimiento = "",
                                         FechaNacimiento = _bebe.FechaNacimiento.Value,
                                         //Peso = _bebe.Peso ?? 0,
                                         //EstaturaCm = _bebe.EstaturaCm ?? 0,
                                         Sexo = _bebe.Sexo ?? false,
                                         Padecimientos = _bebe.Padecimientos,

                                     }).OrderBy(x => x.Apellidos).ToList();


                    foreach (var Registro in _rptBebes.ToList())
                    {
                        Registro.StrFechaNacimiento = Registro.FechaNacimiento.ToString("dd/MMM/yyyy");

                        var _peso_bebe = dbContext.Apl_Historial_Bebes
                            .Where(c => c.BebeId == Registro.BebeId && c.Tipo == "PESO")
                            .OrderByDescending(t => t.FechaCreo)
                            .FirstOrDefault();
                        Registro.Peso = _peso_bebe.Peso.Value;


                        var _estatura_bebe = dbContext.Apl_Historial_Bebes
                            .Where(c => c.BebeId == Registro.BebeId && c.Tipo == "ESTATURA")
                            .OrderByDescending(t => t.FechaCreo)
                            .FirstOrDefault();
                        Registro.EstaturaCm = _estatura_bebe.Estatura.Value;
                    }


                    #endregion
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    #region Titulos

                    iTextSharp.text.pdf.PdfPTable T_Tabla_Titulos = new iTextSharp.text.pdf.PdfPTable(1);
                    T_Tabla_Titulos.WidthPercentage = 100;
                    T_Tabla_Titulos.DefaultCell.Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER;

                    //  nombre del reporte
                    iTextSharp.text.Phrase Phr_Titulo_Reporte = new iTextSharp.text.Phrase("Reporte de Bebes");
                    Phr_Titulo_Reporte.Font.Size = Int_Tamaño_Letra_Titulo;
                    Phr_Titulo_Reporte.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    T_Tabla_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Titulo_Reporte)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });

                  
                    #endregion
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    #region encabezado ------


                    iTextSharp.text.pdf.PdfPTable Tbl_Tabla_Bebes_Encabezado = new iTextSharp.text.pdf.PdfPTable(1);
                    Tbl_Tabla_Bebes_Encabezado.WidthPercentage = 100;
                    Tbl_Tabla_Bebes_Encabezado.DefaultCell.Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER;



                    iTextSharp.text.Phrase Prh_Usuarios_Encabezado = new iTextSharp.text.Phrase(Str_Encabezado_Productos);
                    Prh_Usuarios_Encabezado.Font.Size = Int_Tamaño_Letra_Encabezado_Guion;
                    Prh_Usuarios_Encabezado.Font.SetStyle(iTextSharp.text.Font.NORMAL);


                    Tbl_Tabla_Bebes_Encabezado.AddCell(new iTextSharp.text.pdf.PdfPCell(Prh_Usuarios_Encabezado)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });

                    #endregion
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    #region bebes encabezado

                    iTextSharp.text.pdf.PdfPTable Tbl_Tabla_Bebes_Encabezado_Titulos = new iTextSharp.text.pdf.PdfPTable(7);
                    Tbl_Tabla_Bebes_Encabezado_Titulos.WidthPercentage = 100;
                    Tbl_Tabla_Bebes_Encabezado_Titulos.DefaultCell.Border = iTextSharp.text.pdf.PdfPCell.RECTANGLE;

                    Tbl_Tabla_Bebes_Encabezado_Titulos.SetWidths(Ancho_7valores);
                    //  -----------------------------------------------------------------------------------------------------------
                    //  -----------------------------------------------------------------------------------------------------------
                    iTextSharp.text.Phrase Phr_Bebes_Encabezado_Apellidos = new iTextSharp.text.Phrase("APELLIDOS");
                    Phr_Bebes_Encabezado_Apellidos.Font.Size = Int_Tamaño_Letra_Encabezado_Bebes;
                    Phr_Bebes_Encabezado_Apellidos.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    Tbl_Tabla_Bebes_Encabezado_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Bebes_Encabezado_Apellidos)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });
                    //  -----------------------------------------------------------------------------------------------------------
                    //  -----------------------------------------------------------------------------------------------------------
                    iTextSharp.text.Phrase Phr_Bebes_Encabezado_Nombre = new iTextSharp.text.Phrase("NOMBRE");
                    Phr_Bebes_Encabezado_Nombre.Font.Size = Int_Tamaño_Letra_Encabezado_Bebes;
                    Phr_Bebes_Encabezado_Nombre.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    Tbl_Tabla_Bebes_Encabezado_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Bebes_Encabezado_Nombre)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });

                    //  -----------------------------------------------------------------------------------------------------------
                    //  -----------------------------------------------------------------------------------------------------------
                    iTextSharp.text.Phrase Phr_Bebe_Encabezado_Fecha = new iTextSharp.text.Phrase("FECHA DE NACIMIENTO");
                    Phr_Bebe_Encabezado_Fecha.Font.Size = Int_Tamaño_Letra_Encabezado_Bebes;
                    Phr_Bebe_Encabezado_Fecha.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    Tbl_Tabla_Bebes_Encabezado_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Bebe_Encabezado_Fecha)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });

                    //  -----------------------------------------------------------------------------------------------------------
                    //  -----------------------------------------------------------------------------------------------------------
                    iTextSharp.text.Phrase Phr_Bebe_Encabezado_Peso = new iTextSharp.text.Phrase("PESO");
                    Phr_Bebe_Encabezado_Peso.Font.Size = Int_Tamaño_Letra_Encabezado_Bebes;
                    Phr_Bebe_Encabezado_Peso.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    Tbl_Tabla_Bebes_Encabezado_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Bebe_Encabezado_Peso)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });


                    //  -----------------------------------------------------------------------------------------------------------
                    //  -----------------------------------------------------------------------------------------------------------
                    iTextSharp.text.Phrase Phr_Bebe_Encabezado_Estatura = new iTextSharp.text.Phrase("ESTATURA EN CM");
                    Phr_Bebe_Encabezado_Estatura.Font.Size = Int_Tamaño_Letra_Encabezado_Bebes;
                    Phr_Bebe_Encabezado_Estatura.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    Tbl_Tabla_Bebes_Encabezado_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Bebe_Encabezado_Estatura)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });

                    //  -----------------------------------------------------------------------------------------------------------
                    //  -----------------------------------------------------------------------------------------------------------
                    iTextSharp.text.Phrase Phr_Bebe_Encabezado_Sexo = new iTextSharp.text.Phrase("SEXO");
                    Phr_Bebe_Encabezado_Sexo.Font.Size = Int_Tamaño_Letra_Encabezado_Bebes;
                    Phr_Bebe_Encabezado_Sexo.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    Tbl_Tabla_Bebes_Encabezado_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Bebe_Encabezado_Sexo)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });

                    //  -----------------------------------------------------------------------------------------------------------
                    //  -----------------------------------------------------------------------------------------------------------
                    iTextSharp.text.Phrase Phr_Bebe_Encabezado_Padecimientos = new iTextSharp.text.Phrase("PADECIMIENTOS");
                    Phr_Bebe_Encabezado_Padecimientos.Font.Size = Int_Tamaño_Letra_Encabezado_Bebes;
                    Phr_Bebe_Encabezado_Padecimientos.Font.SetStyle(iTextSharp.text.Font.BOLD);


                    Tbl_Tabla_Bebes_Encabezado_Titulos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Bebe_Encabezado_Padecimientos)
                    {
                        HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT,
                        Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                    });
                    #endregion
                    ////  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    ////  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    #region Detalles
                    iTextSharp.text.pdf.PdfPTable Tbl_Tabla_Productos = new iTextSharp.text.pdf.PdfPTable(7);
                    Tbl_Tabla_Productos.WidthPercentage = 100;
                    Tbl_Tabla_Productos.DefaultCell.Border = iTextSharp.text.pdf.PdfPCell.RECTANGLE;

                    Tbl_Tabla_Productos.SetWidths(Ancho_7valores);

                    foreach (var Registro in _rptBebes)
                    {

                        //  -----------------------------------------------------------------------------------------------------------
                        //  -----------------------------------------------------------------------------------------------------------
                        //  Apellidos
                        //  -----------------------------------------------------------------------------------------------------------
                        iTextSharp.text.Phrase Phr_Detalle_Apellidos = new iTextSharp.text.Phrase(Registro.Apellidos.ToString());
                        Phr_Detalle_Apellidos.Font.Size = Int_Tamaño_Letra_Detalles;
                        Phr_Detalle_Apellidos.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                        Tbl_Tabla_Productos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Detalle_Apellidos)
                        {
                            HorizontalAlignment = iTextSharp.text.Element.ALIGN_JUSTIFIED,
                            Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                        });

                        //  -----------------------------------------------------------------------------------------------------------
                        //  -----------------------------------------------------------------------------------------------------------
                        //  Nombre
                        //  -----------------------------------------------------------------------------------------------------------
                        iTextSharp.text.Phrase Phr_Detalle_Nombre = new iTextSharp.text.Phrase(Registro.Nombre.ToString());
                        Phr_Detalle_Nombre.Font.Size = Int_Tamaño_Letra_Detalles;
                        Phr_Detalle_Nombre.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                        Tbl_Tabla_Productos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Detalle_Nombre)
                        {
                            HorizontalAlignment = iTextSharp.text.Element.ALIGN_JUSTIFIED,
                            Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                        });

                        //  -----------------------------------------------------------------------------------------------------------
                        //  -----------------------------------------------------------------------------------------------------------
                        //  fecha de nacimiento
                        //  -----------------------------------------------------------------------------------------------------------
                        iTextSharp.text.Phrase Phr_Detalle_Fecha = new iTextSharp.text.Phrase(Registro.StrFechaNacimiento.ToString());
                        Phr_Detalle_Fecha.Font.Size = Int_Tamaño_Letra_Detalles;
                        Phr_Detalle_Fecha.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                        Tbl_Tabla_Productos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Detalle_Fecha)
                        {
                            HorizontalAlignment = iTextSharp.text.Element.ALIGN_JUSTIFIED,
                            Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                        });


                        //  -----------------------------------------------------------------------------------------------------------
                        //  -----------------------------------------------------------------------------------------------------------
                        //  peso
                        //  -----------------------------------------------------------------------------------------------------------
                        iTextSharp.text.Phrase Phr_Detalle_Peso = new iTextSharp.text.Phrase(Registro.Peso.ToString());
                        Phr_Detalle_Peso.Font.Size = Int_Tamaño_Letra_Detalles;
                        Phr_Detalle_Peso.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                        Tbl_Tabla_Productos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Detalle_Peso)
                        {
                            HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT,
                            Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                        });

                        //  -----------------------------------------------------------------------------------------------------------
                        //  -----------------------------------------------------------------------------------------------------------
                        //  Estatura
                        //  -----------------------------------------------------------------------------------------------------------
                        iTextSharp.text.Phrase Phr_Detalle_Estatura = new iTextSharp.text.Phrase(Registro.Peso.ToString());
                        Phr_Detalle_Estatura.Font.Size = Int_Tamaño_Letra_Detalles;
                        Phr_Detalle_Estatura.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                        Tbl_Tabla_Productos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Detalle_Estatura)
                        {
                            HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT,
                            Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                        });


                        //  -----------------------------------------------------------------------------------------------------------
                        //  -----------------------------------------------------------------------------------------------------------
                        //  sexo
                        //  -----------------------------------------------------------------------------------------------------------
                        iTextSharp.text.Phrase Phr_Detalle_Sexo = new iTextSharp.text.Phrase(
                                    (
                                        Convert.ToBoolean(Registro.Sexo) == true ? "FEMENINO" : "MASCULINO")
                                    );
                        Phr_Detalle_Sexo.Font.Size = Int_Tamaño_Letra_Detalles;
                        Phr_Detalle_Sexo.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                        Tbl_Tabla_Productos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Detalle_Sexo)
                        {
                            HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER,
                            Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                        });
                        //  -----------------------------------------------------------------------------------------------------------
                        //  -----------------------------------------------------------------------------------------------------------
                        //  Estatura
                        //  -----------------------------------------------------------------------------------------------------------
                        iTextSharp.text.Phrase Phr_Detalle_Padecimientos = new iTextSharp.text.Phrase(Registro.Padecimientos.ToString());
                        Phr_Detalle_Padecimientos.Font.Size = Int_Tamaño_Letra_Detalles;
                        Phr_Detalle_Padecimientos.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                        Tbl_Tabla_Productos.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Detalle_Padecimientos)
                        {
                            HorizontalAlignment = iTextSharp.text.Element.ALIGN_JUSTIFIED,
                            Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                        }); 


                    }


                    #endregion
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    #region Agregar tablas al documento

                    //  --------------------------------------------------------------------------------------------------
                    Documento.Add(T_Tabla_Titulos);
                    Documento.Add(new iTextSharp.text.Paragraph("\n"));
                    //  --------------------------------------------------------------------------------------------------
                    Documento.Add(Tbl_Tabla_Bebes_Encabezado);
                    //  --------------------------------------------------------------------------------------------------
                    Documento.Add(Tbl_Tabla_Bebes_Encabezado_Titulos);
                    //  --------------------------------------------------------------------------------------------------
                    Documento.Add(Tbl_Tabla_Bebes_Encabezado);
                    //  --------------------------------------------------------------------------------------------------
                    Documento.Add(Tbl_Tabla_Productos);
                    //  --------------------------------------------------------------------------------------------------
                    Documento.Add(Tbl_Tabla_Bebes_Encabezado);
                    ////  --------------------------------------------------------------------------------------------------

                    ////  --------------------------------------------------------------------------------------------------


                    #endregion
                }
            }
            catch (Exception Ex)
            {

            }
        }

        #endregion


        #region Excel


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public Cls_Mensaje Genere_Reporte_Excel_Usuarios(string jsonObject)
        {
            Cls_Apl_Bebes_Negocio Obj = new Cls_Apl_Bebes_Negocio();
            bool Generado = false;
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            String Str_Carpeta_Final = "";
            FileInfo template;
            String Str_Columna_Tope = "";
            Int32 Cont_Filas = 6;
            try
            {
                Str_Columna_Tope = "G";


                Obj = JsonConvert.DeserializeObject<Cls_Apl_Bebes_Negocio>(jsonObject);

                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                string Fecha = DateTime.Now.ToString("dd-MM-yyyy__HH_mm_ss");
                string Nombre_Archivo = "Reporte_Bebes_" + Fecha + ".xlsx";
                string Ruta_Archivo = Server.MapPath("../../../Reportes/Bebes/") + Nombre_Archivo;
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                String Ruta_Plantilla = HttpContext.Current.Server.MapPath("~") + "\\PlantillaExcel\\Plantilla_Excel.xlsx";
                string nombre_archivo = "Reporte_Bebes_" + Fecha + ".xlsx";

                Str_Carpeta_Final = Obtener_Carpeta_Destino("Bebes");
                string Ruta_Almacenamiento = Obtener_Ruta_Para_Guardar(nombre_archivo, Str_Carpeta_Final);
                template = new FileInfo(Ruta_Plantilla);


                #region Excel

                FileInfo Fli_Nuevo_Archivo = new FileInfo(Ruta_Plantilla);


                using (ExcelPackage Excel_Doc_ = new ExcelPackage(template, true))
                {


                    using (var dbContext = new ERP_EJE_CENTRALEntities())
                    {
                        //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                        #region Consultas

                        DateTime fecha_inicio = DateTime.MinValue;
                        DateTime fecha_termino = DateTime.MinValue;


                        if (!string.IsNullOrEmpty(Obj.Fecha_Inicio))
                        {
                            DateTime.TryParseExact(Obj.Fecha_Inicio, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out fecha_inicio);
                        }
                        if (!string.IsNullOrEmpty(Obj.Fecha_Termino))
                        {
                            DateTime.TryParseExact(Obj.Fecha_Termino, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out fecha_termino);
                            fecha_termino = fecha_termino.AddDays(1);
                        }

                        //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //  Encabezado de la venta
                        //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        var _rptBebes = (from _bebe in dbContext.Apl_Bebes

                                        where ((Obj.BebeId > 0) ? _bebe.BebeId == Obj.BebeId : true)
                                        && ((Obj.Nombre != "") ? _bebe.Nombre.ToString().Contains(Obj.Nombre.ToString()) : true)
                                        && ((Obj.Apellidos != "") ? _bebe.Apellidos.ToString().Contains(Obj.Apellidos.ToString()) : true)
                                        //entre dos fechas
                                        && (((!string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (!string.IsNullOrEmpty(Obj.Fecha_Termino))) ? ((_bebe.FechaNacimiento >= fecha_inicio) && (_bebe.FechaNacimiento <= fecha_termino)) : true)

                                        //mayor a la fecha de inicio
                                        && (((!string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (string.IsNullOrEmpty(Obj.Fecha_Termino))) ? (_bebe.FechaNacimiento >= fecha_inicio) : true)

                                        //menor a la fecha de termino
                                        && (((string.IsNullOrEmpty(Obj.Fecha_Inicio)) && (!string.IsNullOrEmpty(Obj.Fecha_Termino))) ? (_bebe.FechaNacimiento <= fecha_termino) : true)
                                        

                                         select new Cls_Apl_Bebes_Negocio
                                         {
                                             BebeId = _bebe.BebeId,
                                             Apellidos = _bebe.Apellidos,
                                             Nombre = _bebe.Nombre,
                                             StrFechaNacimiento = "",
                                             FechaNacimiento = _bebe.FechaNacimiento.Value,
                                             //Peso = _bebe.Peso ?? 0,
                                             //EstaturaCm = _bebe.EstaturaCm ?? 0,
                                             Sexo = _bebe.Sexo ?? false,
                                             Padecimientos = _bebe.Padecimientos,

                                         }).OrderBy(x => x.Apellidos).ToList();

                        foreach (var Registro in _rptBebes.ToList())
                        {
                            Registro.StrFechaNacimiento = Registro.FechaNacimiento.ToString("dd/MMM/yyyy");

                            var _peso_bebe = dbContext.Apl_Historial_Bebes
                            .Where(c => c.BebeId == Registro.BebeId && c.Tipo == "PESO")
                            .OrderByDescending(t => t.FechaCreo)
                            .FirstOrDefault();
                            Registro.Peso = _peso_bebe.Peso.Value;


                            var _estatura_bebe = dbContext.Apl_Historial_Bebes
                                .Where(c => c.BebeId == Registro.BebeId && c.Tipo == "ESTATURA")
                                .OrderByDescending(t => t.FechaCreo)
                                .FirstOrDefault();
                            Registro.EstaturaCm = _estatura_bebe.Estatura.Value;
                        }

                        #endregion
                        //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<




                        Excel_Doc_.Workbook.Worksheets.Delete("HOJA1");

                        ExcelWorksheet Detallado = Excel_Doc_.Workbook.Worksheets.Add("Bebes");



                        //  encabezado *****************************************************************************************************************
                        Detallado.Cells["A1:" + Str_Columna_Tope + "2"].Style.Font.Bold = true;

                        Detallado.Cells["A1"].Value = "Reporte de bebes " + DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss");
                        Detallado.Cells["A1:" + Str_Columna_Tope + "3"].Merge = true;
                        Detallado.Cells["A1:" + Str_Columna_Tope + "3"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["A1:" + Str_Columna_Tope + "3"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["A1:" + Str_Columna_Tope + "3"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["A1:" + Str_Columna_Tope + "3"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;



                        //  encabezados de la tabla
                        Detallado.Cells["A5:" + Str_Columna_Tope + "5"].Style.Font.Bold = true;
                        Detallado.Cells["A5"].Value = "Apellidos";
                        Detallado.Cells["A5"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["A5"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["A5"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["A5"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        
                        Detallado.Cells["B5"].Value = "Nombre";
                        Detallado.Cells["B5"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["B5"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["B5"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["B5"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                        Detallado.Cells["C5"].Value = "Fecha de nacimiento";
                        Detallado.Cells["C5"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["C5"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["C5"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["C5"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;


                        Detallado.Cells["D5"].Value = "Peso";
                        Detallado.Cells["D5"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["D5"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["D5"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["D5"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                        Detallado.Cells["E5"].Value = "Estatura en cm";
                        Detallado.Cells["E5"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["E5"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["E5"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["E5"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                        Detallado.Cells["F5"].Value = "Sexo";
                        Detallado.Cells["F5"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["F5"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["F5"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["F5"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;


                        Detallado.Cells["G5"].Value = "Padecimientos";
                        Detallado.Cells["G5"].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["G5"].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["G5"].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        Detallado.Cells["G5"].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                        foreach (var Registro in _rptBebes)
                        {
                            Detallado.Cells["A" + Cont_Filas].Value = Registro.Apellidos;
                            Detallado.Cells["A" + Cont_Filas].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["A" + Cont_Filas].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["A" + Cont_Filas].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["A" + Cont_Filas].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                            Detallado.Cells["B" + Cont_Filas].Value = Registro.Nombre;
                            Detallado.Cells["B" + Cont_Filas].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["B" + Cont_Filas].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["B" + Cont_Filas].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["B" + Cont_Filas].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                            Detallado.Cells["C" + Cont_Filas].Value = Registro.StrFechaNacimiento;
                            Detallado.Cells["C" + Cont_Filas].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["C" + Cont_Filas].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["C" + Cont_Filas].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["C" + Cont_Filas].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                            Detallado.Cells["D" + Cont_Filas].Value = Registro.Peso;
                            Detallado.Cells["D" + Cont_Filas].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["D" + Cont_Filas].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["D" + Cont_Filas].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["D" + Cont_Filas].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                            Detallado.Cells["E" + Cont_Filas].Value = Registro.EstaturaCm;
                            Detallado.Cells["E" + Cont_Filas].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["E" + Cont_Filas].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["E" + Cont_Filas].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["E" + Cont_Filas].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                            Detallado.Cells["F" + Cont_Filas].Value = Convert.ToBoolean(Registro.Sexo) == true ? "FEMENINO" : "MASCULINO";
                            Detallado.Cells["F" + Cont_Filas].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["F" + Cont_Filas].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["F" + Cont_Filas].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["F" + Cont_Filas].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                            Detallado.Cells["G" + Cont_Filas].Value = Registro.Padecimientos;
                            Detallado.Cells["G" + Cont_Filas].Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["G" + Cont_Filas].Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["G" + Cont_Filas].Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            Detallado.Cells["G" + Cont_Filas].Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;

                            Cont_Filas++;
                        }

                        // guarda los cambios
                        Byte[] bin = Excel_Doc_.GetAsByteArray();
                        string file = Ruta_Almacenamiento;
                        File.WriteAllBytes(file, bin);
                    }
                }
                #endregion

                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Generado = true;
                Mensaje.Estatus = "success";
                Mensaje.isCreateExcel = true;
                Mensaje.Url_Excel = Ruta_Almacenamiento;
                Mensaje.Ruta_Archivo_Excel = "../../Reportes/Usuarios/" + Nombre_Archivo; ;
                Mensaje.Nombre_Excel = nombre_archivo;
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


            }
            catch (Exception e)
            {
                Generado = false;
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "Error al generar el documento";

            }

            return Mensaje;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="sFileName"></param>
        /// <param name="Carpeta_Final"></param>
        /// <returns></returns>
        public string Obtener_Ruta_Para_Guardar(string sFileName, String Carpeta_Final)
        {
            String respuesta = "";
            String nombre_archivo_extension = "";

            try
            {
                if (!Path.IsPathRooted(sFileName))
                {
                    sFileName = Path.Combine(HttpContext.Current.Server.MapPath("~") + Carpeta_Final, sFileName);
                }

                if (File.Exists(sFileName))
                {
                    String sDateTime = DateTime.Now.ToString("yyyyMMdd\\_HHmmss");
                    String FilenameExtension = Path.GetFileNameWithoutExtension(sFileName) + Path.GetExtension(sFileName);
                    nombre_archivo_extension = FilenameExtension;
                    sFileName = Path.Combine(Path.GetDirectoryName(sFileName), FilenameExtension);
                }
                else
                {
                    nombre_archivo_extension = sFileName;
                    Directory.CreateDirectory(Path.GetDirectoryName(sFileName));
                }

                respuesta = sFileName;
            }
            catch (Exception Ex)
            {
                //Mostrar_Informacion(1, "Error: (Obtener_Ruta_Para_Guardar)" + Ex.ToString());
            }
            return respuesta;
        }


        public string Obtener_Carpeta_Destino(String Destino)
        {

            String Str_Carpeta_Final = "\\Reportes\\" + Destino + "\\";

            //  se crea la carpeta que contrendra al reporte final
            if (!System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~") + Str_Carpeta_Final))
            {
                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~") + Str_Carpeta_Final);
            }

            return Str_Carpeta_Final;
        }


        #endregion



        class FooterPDf : iTextSharp.text.pdf.PdfPageEventHelper
        {
            public override void OnEndPage(PdfWriter writer, Document document)
            {
                iTextSharp.text.pdf.PdfPTable Tabla_Footer = new iTextSharp.text.pdf.PdfPTable(1);
                Tabla_Footer.TotalWidth = document.PageSize.Width - document.LeftMargin - document.RightMargin;
                Tabla_Footer.DefaultCell.Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER;


                iTextSharp.text.Phrase Phr_Paginas = new iTextSharp.text.Phrase("Pagina " + writer.PageNumber);
                Phr_Paginas.Font.Size = 8;
                Phr_Paginas.Font.SetStyle(iTextSharp.text.Font.NORMAL);

                Tabla_Footer.AddCell(new iTextSharp.text.pdf.PdfPCell(Phr_Paginas)
                {
                    HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT,
                    Border = iTextSharp.text.pdf.PdfPCell.NO_BORDER
                });


                Tabla_Footer.WriteSelectedRows(0, -1, document.LeftMargin, writer.PageSize.GetBottom(document.BottomMargin) + 20, writer.DirectContent);

            }
        }
    }
}
