using datos_red_alert;
using LitJson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using web_red_alert.Models.Ayudante;
using web_red_alert.Models.Negocio;


namespace web_red_alert.Paginas.Catalogos.controllers
{
    /// <summary>
    /// Descripción breve de ConsejosMedicosController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class ConsejosMedicosController : System.Web.Services.WebService
    {

        #region Eventos

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Consejos_Medicos_Negocio Obj_Datos = new Cls_Cat_Consejos_Medicos_Negocio();
            string jsonResultado = "";
            String Url = "";

            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Consejos_Medicos_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Consejos_Medicos Obj_Consejos = new Cat_Consejos_Medicos();
                            Cat_Consejos_Medicos obj_consejos_nuevo = new Cat_Consejos_Medicos();

                            Obj_Consejos.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Consejos.Consejo = Obj_Datos.Consejo;
                            Obj_Consejos.Descripcion = Obj_Datos.Descripcion;
                            Obj_Consejos.Url = Obj_Datos.Url;
                            Obj_Consejos.Tags = Obj_Datos.Tags;
                            Obj_Consejos.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_Consejos.Fecha_Creo = DateTime.Now;

                            obj_consejos_nuevo = dbContext.Cat_Consejos_Medicos.Add(Obj_Consejos);

                            dbContext.SaveChanges();


                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";
                            Mensaje.Consejo_Medico_Id = obj_consejos_nuevo.Consejo_Id.ToString();

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
        public string Consumir_Servicio_Notificacion(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Consejos_Medicos_Negocio Obj_Datos = new Cls_Cat_Consejos_Medicos_Negocio();
            string jsonResultado = "";
            String Url = "";
            Boolean Estatus = true;

            try
            {
                Mensaje.Titulo = "Servicio";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Consejos_Medicos_Negocio>(jsonObject);

                //  se obtiene la ruta del servicio
                Url = ConfigurationManager.AppSettings["Servicio_Notifiaciones"].ToString();
                Url = Url + Obj_Datos.Consejo_Id;

                var json = new WebClient().DownloadString(Url);
                Cls_Servicio_Notificacion_Negocio valor_dinamico = JsonConvert.DeserializeObject<Cls_Servicio_Notificacion_Negocio>(json);

                if (valor_dinamico.Estatus == "Ok")
                {
                    Estatus = true;
                }
                else
                {
                    Estatus = false;
                }



                Mensaje.Mensaje = "La operación se realizo correctamente.";

                if (Estatus == true)
                {
                    Mensaje.Estatus = "success";
                }
                else
                {
                    Mensaje.Estatus = "error";
                }

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
            Cls_Cat_Consejos_Medicos_Negocio Obj_Datos = new Cls_Cat_Consejos_Medicos_Negocio();
            string jsonResultado = "";
            Int32 int_Id = 0;
            String Url = "";

            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Consejos_Medicos_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Consejos_Medicos Obj_Consejo = new Cat_Consejos_Medicos();
                            int_Id = Convert.ToInt32(Obj_Datos.Consejo_Id);

                            Obj_Consejo = dbContext.Cat_Consejos_Medicos.Where(w => w.Consejo_Id == int_Id).FirstOrDefault();

                            Obj_Consejo.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Consejo.Consejo = Obj_Datos.Consejo == "" ? null : Obj_Datos.Consejo;
                            Obj_Consejo.Descripcion = Obj_Datos.Descripcion == "" ? null : Obj_Datos.Descripcion;
                            Obj_Consejo.Url = Obj_Datos.Url == "" ? null : Obj_Datos.Url;
                            Obj_Consejo.Tags = Obj_Datos.Tags == "" ? null : Obj_Datos.Tags;
                            Obj_Consejo.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Consejo.Fecha_Modifico = DateTime.Now;

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
            Cls_Cat_Consejos_Medicos_Negocio Obj_Datos = new Cls_Cat_Consejos_Medicos_Negocio();
            string jsonResultado = "";
            Int32 Int_Id = 0;

            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Consejos_Medicos_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Consejos_Medicos Obj_Medico = new Cat_Consejos_Medicos();
                            Int_Id = Convert.ToInt32(Obj_Datos.Consejo_Id);

                            Obj_Medico = dbContext.Cat_Consejos_Medicos.Where(w => w.Consejo_Id == Int_Id).FirstOrDefault();
                            dbContext.Cat_Consejos_Medicos.Remove(Obj_Medico);
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





        #region Consultas


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Consejos_Filtro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Consejos_Medicos_Negocio Obj = new Cls_Cat_Consejos_Medicos_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Consejos_Medicos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _consejos = (from _con in dbContext.Cat_Consejos_Medicos

                                     join _estatus in dbContext.Apl_Estatus on _con.Estatus_Id equals _estatus.Estatus_ID

                                     where ((Obj.Consejo_Id > 0) ? _con.Consejo_Id == Obj.Consejo_Id : true)
                                     && ((Obj.Estatus_Id > 0) ? _con.Estatus_Id == Obj.Estatus_Id : true)
                                     && ((Obj.Consejo != "") ? _con.Consejo.ToString().Contains(Obj.Consejo.ToString()) : true)
                                     && ((Obj.Tags != "") ? _con.Tags.ToString().Contains(Obj.Tags.ToString()) : true)
                                     && ((Obj.Url != "") ? _con.Url.ToString().Contains(Obj.Url.ToString()) : true)

                                     select new Cls_Cat_Consejos_Medicos_Negocio
                                     {
                                         Consejo_Id = _con.Consejo_Id,
                                         Estatus_Id = _con.Estatus_Id,
                                         Consejo = _con.Consejo,
                                         Descripcion = _con.Descripcion,
                                         Url = _con.Url,
                                         Tags = _con.Tags,
                                         Estatus = _estatus.Estatus,
                                     })
                                          .OrderBy(x => x.Consejo).ToList();


                    Json_Resultado = JsonConvert.SerializeObject(_consejos.ToList());
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
