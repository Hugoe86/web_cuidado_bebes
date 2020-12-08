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
    /// Descripción breve de Especialidades_Controller
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class Especialidades_Controller : System.Web.Services.WebService
    {



        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Especialidades_Negocio Obj_Datos = new Cls_Cat_Especialidades_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Especialidades_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Especialidades Obj_Especialidades = new Cat_Especialidades();
                            
                            Obj_Especialidades.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Especialidades.Especialidad = Obj_Datos.Especialidad ;
                            Obj_Especialidades.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_Especialidades.Fecha_Creo = DateTime.Now;

                            dbContext.Cat_Especialidades.Add(Obj_Especialidades);

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
            Cls_Cat_Especialidades_Negocio Obj_Datos = new Cls_Cat_Especialidades_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Especialidades_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Especialidades Obj_Especialidades = new Cat_Especialidades();

                            Obj_Especialidades = dbContext.Cat_Especialidades.Where(w => w.Especialidad_Id == Obj_Datos.Especialidad_Id).FirstOrDefault();


                            Obj_Especialidades.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Especialidades.Especialidad = Obj_Datos.Especialidad;
                            Obj_Especialidades.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Especialidades.Fecha_Modifico = DateTime.Now;
                            
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
            Cls_Cat_Especialidades_Negocio Obj_Datos = new Cls_Cat_Especialidades_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Especialidades_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Especialidades Obj_Especialidades = new Cat_Especialidades();

                            Obj_Especialidades = dbContext.Cat_Especialidades.Where(w => w.Especialidad_Id == Obj_Datos.Especialidad_Id).FirstOrDefault();
                            
                            dbContext.Cat_Especialidades.Remove(Obj_Especialidades);
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
        public string Consultar_EspecialidadesFiltro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Especialidades_Negocio Obj = new Cls_Cat_Especialidades_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Especialidades_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _especialidades = (from _esp in dbContext.Cat_Especialidades

                                           join _estatus in dbContext.Apl_Estatus on _esp.Estatus_Id equals _estatus.Estatus_ID

                                           where ((Obj.Especialidad_Id != 0) ? _esp.Especialidad_Id.Equals(Obj.Especialidad_Id) : true)
                                           && ((Obj.Estatus_Id != 0) ? _estatus.Estatus_ID.Equals(Obj.Estatus_Id) : true)
                                           && ((Obj.Especialidad != "") ? _esp.Especialidad.Contains(Obj.Especialidad) : true)

                                           select new Cls_Cat_Especialidades_Negocio
                                           {
                                               Especialidad_Id = _esp.Especialidad_Id,
                                               Especialidad = _esp.Especialidad,
                                               Estatus_Id = _esp.Estatus_Id,
                                               Estatus = _estatus.Estatus,
                                           })
                                          .OrderBy(x => x.Especialidad).ToList();


                    Json_Resultado = JsonMapper.ToJson(_especialidades.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }


    }
}
