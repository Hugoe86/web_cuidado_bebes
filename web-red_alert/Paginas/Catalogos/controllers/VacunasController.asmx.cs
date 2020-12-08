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
    /// Descripción breve de VacunasController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class VacunasController : System.Web.Services.WebService
    {

        #region Operaciones

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Vacunas_Negocio Obj_Datos = new Cls_Cat_Vacunas_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Vacunas_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Vacunas Obj_Vacunas = new Cat_Vacunas();

                            Obj_Vacunas.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Vacunas.Nombre = Obj_Datos.Nombre;
                            //Obj_Vacunas.Meses_Aplicacion = Obj_Datos.Meses_Aplicacion;
                            Obj_Vacunas.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_Vacunas.Fecha_Creo = DateTime.Now;

                            dbContext.Cat_Vacunas.Add(Obj_Vacunas);

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
            Cls_Cat_Vacunas_Negocio Obj_Datos = new Cls_Cat_Vacunas_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Vacunas_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Vacunas Obj_Vacunas = new Cat_Vacunas();
                            Obj_Vacunas = dbContext.Cat_Vacunas.Where(w => w.Vacuna_Id == Obj_Datos.Vacuna_Id).FirstOrDefault();

                            Obj_Vacunas.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Vacunas.Nombre = Obj_Datos.Nombre;
                            //Obj_Vacunas.Meses_Aplicacion = Obj_Datos.Meses_Aplicacion;
                            Obj_Vacunas.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Vacunas.Fecha_Modifico = DateTime.Now;
                            
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
            Cls_Cat_Vacunas_Negocio Obj_Datos = new Cls_Cat_Vacunas_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Vacunas_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Vacunas Obj_Vacuna = new Cat_Vacunas();

                            Obj_Vacuna = dbContext.Cat_Vacunas.Where(w => w.Vacuna_Id == Obj_Datos.Vacuna_Id).FirstOrDefault();

                            dbContext.Cat_Vacunas.Remove(Obj_Vacuna);
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
        public string Consultar_VacunasFiltro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Vacunas_Negocio Obj = new Cls_Cat_Vacunas_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Vacunas_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _vacunas = (from _vac in dbContext.Cat_Vacunas

                                    join _estatus in dbContext.Apl_Estatus on _vac.Estatus_Id equals _estatus.Estatus_ID

                                    
                                    select new Cls_Cat_Vacunas_Negocio
                                    {
                                        Vacuna_Id = _vac.Vacuna_Id,
                                        Nombre = _vac.Nombre ?? "",
                                        Estatus_Id = _vac.Estatus_Id,
                                        //Meses_Aplicacion = _vac.Meses_Aplicacion ?? 0,
                                        Estatus = _estatus.Estatus ?? "",
                                    })
                                          .OrderBy(x => x.Nombre).ToList();


                    //  filtro nombre
                    if (!String.IsNullOrEmpty(Obj.Nombre))
                    {
                        _vacunas = _vacunas.Where(x => x.Nombre.ToUpper().Trim().Contains(Obj.Nombre.Trim().ToUpper())).ToList();
                    }

                    //  filtro especialidad
                    if (Obj.Vacuna_Id > 0)
                    {
                        _vacunas = _vacunas.Where(x => x.Vacuna_Id.ToString().ToUpper().Trim().Equals(Obj.Vacuna_Id.ToString().Trim().ToUpper())).ToList();
                    }

                    //  filtro especialidad
                    if (Obj.Estatus_Id > 0)
                    {
                        _vacunas = _vacunas.Where(x => x.Estatus_Id.ToString().ToUpper().Trim().Equals(Obj.Estatus_Id.ToString().Trim().ToUpper())).ToList();
                    }
                    
                    Json_Resultado = JsonMapper.ToJson(_vacunas.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ConsultarVacunasCombo()
        {
            string Json_Resultado = string.Empty;
            List<Apl_Estatus> Lista_estatus = new List<Apl_Estatus>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            try
            {

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Estatus = from _select in dbContext.Cat_Vacunas
                                  select new { _select.Nombre, _select.Vacuna_Id };

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
