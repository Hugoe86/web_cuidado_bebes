using datos_red_alert;
using LitJson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using web_red_alert.Models.Ayudante;
using web_red_alert.Models.Negocio;

namespace web_red_alert.Paginas.Catalogos.controllers
{
    /// <summary>
    /// Descripción breve de TramitesController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class TramitesController : System.Web.Services.WebService
    {


        #region Eventos
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tramites_Negocio Obj_Datos = new Cls_Cat_Tramites_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {

                            Cat_Tramites Obj_Tramite = new Cat_Tramites();


                            Obj_Tramite.Nombre = Obj_Datos.Nombre;
                            Obj_Tramite.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_Tramite.Fecha_Creo = DateTime.Now;
                            Obj_Tramite.Estatus_ID = Obj_Datos.Estatus_Id;

                            dbContext.Cat_Tramites.Add(Obj_Tramite);

                            dbContext.SaveChanges();


                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Actualizar(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tramites_Negocio Obj_Datos = new Cls_Cat_Tramites_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Tramites Obj_Mes = new Cat_Tramites();
                            Obj_Mes = dbContext.Cat_Tramites.Where(w => w.Tramite_Id == Obj_Datos.Tramite_Id).FirstOrDefault();

                            Obj_Mes.Nombre = Obj_Datos.Nombre;
                            Obj_Mes.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Mes.Fecha_Modifico = DateTime.Now;
                            Obj_Mes.Estatus_ID = Obj_Datos.Estatus_Id;

                            dbContext.SaveChanges();

                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Eliminar(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tramites_Negocio Obj_Datos = new Cls_Cat_Tramites_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            //  se quitan los datos de la relacino
                            var _relacion = (from _tramite in dbContext.Cat_Tramites_Pasos
                                             where _tramite.Tramite_Id == Obj_Datos.Tramite_Id
                                             select _tramite
                                             ).ToList();


                            if (_relacion.Any())
                            {
                                foreach (var _relacion_pasos_tramite in _relacion.ToList())
                                {
                                    Cat_Tramites_Pasos Obj_Pasos = new Cat_Tramites_Pasos();
                                    Obj_Pasos = dbContext.Cat_Tramites_Pasos.Where(w => w.Tramite_Id == _relacion_pasos_tramite.Tramite_Id).FirstOrDefault();

                                    dbContext.Cat_Tramites_Pasos.Remove(Obj_Pasos);
                                    dbContext.SaveChanges();
                                }
                            }

                            //  se quita el mes
                            Cat_Tramites Obj_Tramites = new Cat_Tramites();

                            Obj_Tramites = dbContext.Cat_Tramites.Where(w => w.Tramite_Id == Obj_Datos.Tramite_Id).FirstOrDefault();

                            dbContext.Cat_Tramites.Remove(Obj_Tramites);
                            dbContext.SaveChanges();


                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta_Pasos(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tramites_Pasos_Negocio Obj_Datos = new Cls_Cat_Tramites_Pasos_Negocio();
            string jsonResultado = "";
            int _orden = 0;

            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Pasos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            if (Obj_Datos.Orden == 0)
                            {
                                _orden = (from _pasos in dbContext.Cat_Tramites_Pasos
                                          where _pasos.Tramite_Id == Obj_Datos.Tramite_Id
                                          select _pasos
                                                ).Max(max => max.Orden).GetValueOrDefault();

                                _orden++;
                            }
                            else
                            {
                                _orden = Obj_Datos.Orden;
                            }

                            Cat_Tramites_Pasos Obj_Tramite_Pasos = new Cat_Tramites_Pasos();

                            Obj_Tramite_Pasos.Tramite_Id = Convert.ToInt32(Obj_Datos.Tramite_Id);
                            Obj_Tramite_Pasos.Descripcion = Obj_Datos.Descripcion;
                            Obj_Tramite_Pasos.Orden = _orden;
                            Obj_Tramite_Pasos.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_Tramite_Pasos.Fecha_Creo = DateTime.Now;

                            dbContext.Cat_Tramites_Pasos.Add(Obj_Tramite_Pasos);

                            dbContext.SaveChanges();


                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Eliminar_Paso_Tramite(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tramites_Pasos_Negocio Obj_Datos = new Cls_Cat_Tramites_Pasos_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Pasos_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {

                            Cat_Tramites_Pasos Obj_Tramite_Paso = new Cat_Tramites_Pasos();
                            Obj_Tramite_Paso = dbContext.Cat_Tramites_Pasos.Where(w => w.Paso_Id == Obj_Datos.Paso_Id).FirstOrDefault();

                            dbContext.Cat_Tramites_Pasos.Remove(Obj_Tramite_Paso);
                            dbContext.SaveChanges();


                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Actualizar_Pasos(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tramites_Pasos_Negocio Obj_Datos = new Cls_Cat_Tramites_Pasos_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Pasos_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Tramites_Pasos Obj_Pasos = new Cat_Tramites_Pasos();
                            Obj_Pasos = dbContext.Cat_Tramites_Pasos.Where(w => w.Paso_Id == Obj_Datos.Paso_Id).FirstOrDefault();

                            Obj_Pasos.Descripcion = Obj_Datos.Descripcion;
                            Obj_Pasos.Orden = Obj_Datos.Orden;
                            Obj_Pasos.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Pasos.Fecha_Modifico = DateTime.Now;

                            dbContext.SaveChanges();

                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Actualizar_Adjunto(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tramites_Pasos_Negocio Obj_Datos = new Cls_Cat_Tramites_Pasos_Negocio();
            string jsonResultado = "";
            String Ruta_Tramite = "../../../.../../Tramites/";
            String Ruta_Importaciones = "../../../.../../Reportes/Importaciones/";

            try
            {

                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Pasos_Negocio>(jsonObject);

                //  ruta final del archivo
                String ruta_auxiliar = Server.MapPath(Ruta_Tramite) + Obj_Datos.Tramite_Id + "/" + Obj_Datos.Paso_Id + ".png";


                //  validacion para la creacion de la carpeta
                if (!Directory.Exists(Server.MapPath(Ruta_Tramite + Obj_Datos.Tramite_Id)))
                {
                    Directory.CreateDirectory(Server.MapPath(Ruta_Tramite + Obj_Datos.Tramite_Id));
                }


                //  validacion para la creacion del archivo
                if (!String.IsNullOrEmpty(Obj_Datos.Url_Archivo))
                {

                    Obj_Datos.Imagen = Convertir_Imagen_Bytes(Obj_Datos.Url_Archivo, 1024, 1024);

                    if (File.Exists(ruta_auxiliar))
                    {
                        File.Delete(ruta_auxiliar);
                    }

                    File.Copy(Server.MapPath(Obj_Datos.Url_Archivo), ruta_auxiliar);

                }

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Tramites_Pasos Obj_Pasos = new Cat_Tramites_Pasos();
                            Obj_Pasos = dbContext.Cat_Tramites_Pasos.Where(w => w.Paso_Id == Obj_Datos.Paso_Id).FirstOrDefault();

                            if (!String.IsNullOrEmpty(Obj_Datos.Url_Archivo))
                            {
                                Obj_Pasos.Imagen = Obj_Datos.Imagen;

                                Obj_Pasos.Url_Imagen = "Tramites/" + Obj_Datos.Tramite_Id + "/" + Obj_Datos.Paso_Id + ".png";

                            }
                            else
                            {
                                Obj_Pasos.Imagen = null;


                                Obj_Pasos.Url_Imagen = null;

                                if (File.Exists(ruta_auxiliar))
                                {
                                    File.Delete(ruta_auxiliar);
                                }
                            }


                            Obj_Pasos.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Pasos.Fecha_Modifico = DateTime.Now;

                            dbContext.SaveChanges();

                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }


        #endregion


        #region Metodos

        /// <summary>
        /// Metodo que conviete imagen en bytes
        /// </summary>
        /// <param name="Ruta"></param>
        /// <param name="Porcentaje_Reducion"></param>
        /// <param name="Resolucion"></param>
        /// <returns></returns>
        public byte[] Convertir_Imagen_Bytes(String Ruta, Double Porcentaje_Reducion, int Resolucion)
        {
            try
            {
                Ruta = Server.MapPath(Ruta);
                System.Drawing.Image Imagen = System.Drawing.Image.FromFile(Ruta);
                MemoryStream Ms = new MemoryStream();

                int Nuevo_Ancho = Convert.ToInt32((Imagen.Width * Resolucion) / Imagen.HorizontalResolution * Porcentaje_Reducion);
                int Nuevo_Alto = Convert.ToInt32((Imagen.Height * Resolucion) / Imagen.VerticalResolution * Porcentaje_Reducion);
                System.Drawing.Bitmap Nueva_Imagen = new System.Drawing.Bitmap(Imagen, new Size(512, 512));
                Nueva_Imagen.SetResolution(Resolucion, Resolucion);
                Nueva_Imagen.Save(Ms, Imagen.RawFormat);

                return Ms.ToArray();
            }
            catch (Exception Ex)
            {
                return new byte[0];
            }
        }

        #endregion

        #region Consulta

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_TramitesFiltro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Tramites_Negocio Obj = new Cls_Cat_Tramites_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _consulta = (from _tramite in dbContext.Cat_Tramites
                                     join _estatus in dbContext.Apl_Estatus on _tramite.Estatus_ID equals _estatus.Estatus_ID



                                     where ((Obj.Tramite_Id > 0) ? _tramite.Tramite_Id == Obj.Tramite_Id : true)
                                     && ((Obj.Nombre != "") ? _tramite.Nombre.Contains(Obj.Nombre) : true)
                                     && ((Obj.Estatus_Id != 0) ? _tramite.Estatus_ID == Obj.Estatus_Id : true)


                                     select new Cls_Cat_Tramites_Negocio
                                     {
                                         Tramite_Id = _tramite.Tramite_Id,
                                         Nombre = _tramite.Nombre,
                                         Estatus = _estatus.Estatus

                                     }).OrderBy(x => x.Nombre).ToList();





                    Json_Resultado = JsonConvert.SerializeObject(_consulta.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Pasos(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Tramites_Negocio Obj = new Cls_Cat_Tramites_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Tramites_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _consulta = (from _tramite in dbContext.Cat_Tramites_Pasos


                                     where ((Obj.Tramite_Id > 0) ? _tramite.Tramite_Id == Obj.Tramite_Id : true)


                                     select new Cls_Cat_Tramites_Pasos_Negocio
                                     {
                                         Paso_Id = _tramite.Paso_Id,
                                         Tramite_Id = _tramite.Tramite_Id,
                                         Descripcion = _tramite.Descripcion,
                                         Orden = _tramite.Orden ?? 0,
                                         Imagen = _tramite.Imagen,
                                         Tiene_Imagen = false,
                                     }).OrderBy(x => x.Orden).ToList();


                    foreach (var registro in _consulta.ToList())
                    {
                        if (registro.Imagen != null)
                        {
                            registro.Tiene_Imagen = true;
                        }
                    }


                    Json_Resultado = JsonConvert.SerializeObject(_consulta.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }


        #endregion

    }
}
