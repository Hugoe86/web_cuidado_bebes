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
using web_red_alert.Models.Ayudante;
using web_red_alert.Models.Negocio;


namespace web_red_alert.Paginas.Catalogos.controllers
{
    /// <summary>
    /// Descripción breve de TiposInstalacionesController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class TiposInstalacionesController : System.Web.Services.WebService
    {



        #region Operaciones

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Tipo_Instalaciones_Negocio Obj_Datos = new Cls_Cat_Tipo_Instalaciones_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tipo_Instalaciones_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Tipo_Instalacion Obj_ = new Cat_Tipo_Instalacion();

                            Obj_.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_.Nombre = Obj_Datos.Nombre;
                            Obj_.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_.Fecha_Creo = DateTime.Now;

                            dbContext.Cat_Tipo_Instalacion.Add(Obj_);

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
            Cls_Cat_Tipo_Instalaciones_Negocio Obj_Datos = new Cls_Cat_Tipo_Instalaciones_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tipo_Instalaciones_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Tipo_Instalacion Obj_ = new Cat_Tipo_Instalacion();
                            Obj_ = dbContext.Cat_Tipo_Instalacion.Where(w => w.Tipo_Instalacion_Id == Obj_Datos.Tipo_Instalacion_Id).FirstOrDefault();

                            Obj_.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_.Nombre = Obj_Datos.Nombre;
                            Obj_.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_.Fecha_Modifico = DateTime.Now;

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
            Cls_Cat_Tipo_Instalaciones_Negocio Obj_Datos = new Cls_Cat_Tipo_Instalaciones_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Tipo_Instalaciones_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Tipo_Instalacion Obj_ = new Cat_Tipo_Instalacion();

                            Obj_ = dbContext.Cat_Tipo_Instalacion.Where(w => w.Tipo_Instalacion_Id == Obj_Datos.Tipo_Instalacion_Id).FirstOrDefault();

                            dbContext.Cat_Tipo_Instalacion.Remove(Obj_);
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
        public string Consultar_TiposFiltro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Tipo_Instalaciones_Negocio Obj = new Cls_Cat_Tipo_Instalaciones_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Tipo_Instalaciones_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _tipos = (from _tip in dbContext.Cat_Tipo_Instalacion

                                  join _estatus in dbContext.Apl_Estatus on _tip.Estatus_Id equals _estatus.Estatus_ID
                                  
                                  select new Cls_Cat_Tipo_Instalaciones_Negocio
                                  {
                                      Tipo_Instalacion_Id = _tip.Tipo_Instalacion_Id,
                                      Nombre = _tip.Nombre ?? "",
                                      Estatus_Id = _tip.Estatus_Id,
                                      Estatus = _estatus.Estatus ?? "",
                                  }).OrderBy(x => x.Nombre).ToList();


                    //  filtro nombre
                    if (!String.IsNullOrEmpty(Obj.Nombre))
                    {
                        _tipos = _tipos.Where(x => x.Nombre.ToUpper().Trim().Contains(Obj.Nombre.Trim().ToUpper())).ToList();
                    }
                    //  filtro id
                    if (Obj.Tipo_Instalacion_Id > 0)
                    {
                        _tipos = _tipos.Where(x => x.Tipo_Instalacion_Id.Equals(Obj.Tipo_Instalacion_Id)).ToList();
                    }
                    //  filtro estatus id
                    if (Obj.Estatus_Id > 0)
                    {
                        _tipos = _tipos.Where(x => x.Estatus_Id.Equals(Obj.Estatus_Id)).ToList();
                    }


                    Json_Resultado = JsonConvert.SerializeObject(_tipos);
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ConsultarTiposInsatalaciones()
        {
            string Json_Resultado = string.Empty;
            List<Apl_Estatus> Lista_estatus = new List<Apl_Estatus>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            try
            {

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Estatus = from _select in dbContext.Cat_Tipo_Instalacion
                                  select new { _select.Nombre, _select.Tipo_Instalacion_Id };
                    Json_Resultado = JsonMapper.ToJson(Estatus.ToList());
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color: #FF0004;'></i>&nbsp;Technical report: " + Ex.Message;
            }
            return Json_Resultado;
        }

        #endregion


    }
}
