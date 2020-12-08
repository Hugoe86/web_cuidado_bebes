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
    /// Descripción breve de CartillaVacunacionController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class CartillaVacunacionController : System.Web.Services.WebService
    {
        #region Eventos
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Mes_Aplicacion_Vacuna_Negocio Obj_Datos = new Cls_Cat_Mes_Aplicacion_Vacuna_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Mes_Aplicacion_Vacuna_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {

                            //  se quitan los datos de la relacino
                            var _existe_registro = (from _mes in dbContext.Cat_Mes_Aplicacion_Vacuna
                                                    where _mes.No_Mes == Obj_Datos.No_Mes
                                                    select _mes
                                             ).ToList();


                            if (!_existe_registro.Any())
                            {
                                
                                Cat_Mes_Aplicacion_Vacuna Obj_Mes = new Cat_Mes_Aplicacion_Vacuna();

                                Obj_Mes.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                                Obj_Mes.No_Mes = Obj_Datos.No_Mes;
                                Obj_Mes.Usuario_Creo = Cls_Sesiones.Usuario;
                                Obj_Mes.Fecha_Creo = DateTime.Now;

                                dbContext.Cat_Mes_Aplicacion_Vacuna.Add(Obj_Mes);

                                dbContext.SaveChanges();


                                transaction.Commit();

                                Mensaje.Mensaje = "La operación se realizo correctamente.";
                                Mensaje.Estatus = "success";
                            }
                            else
                            {
                                Mensaje.Mensaje = "Ya se encuentra registrado.";
                                Mensaje.Estatus = "error";
                            }
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
        public string Alta_Relacion(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Ope_Cartilla_Vacunacion_Negocio Obj_Datos = new Cls_Ope_Cartilla_Vacunacion_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Ope_Cartilla_Vacunacion_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {

                            //  se quitan los datos de la relacino
                            var _existe_registro = (from _relacion in dbContext.Ope_Cartilla_Vacunacion
                                                    where _relacion.Mes_Id == Obj_Datos.Mes_Id
                                                    && _relacion.Vacuna_Id == Obj_Datos.Vacuna_Id
                                                    select _relacion
                                             ).ToList();


                            if (!_existe_registro.Any())
                            {

                                Ope_Cartilla_Vacunacion Obj_Relacion = new Ope_Cartilla_Vacunacion();

                                Obj_Relacion.Mes_Id = Convert.ToInt32(Obj_Datos.Mes_Id);
                                Obj_Relacion.Vacuna_Id = Convert.ToInt32(Obj_Datos.Vacuna_Id);
                                Obj_Relacion.Dosis = Obj_Datos.Dosis;
                                Obj_Relacion.Enfermedad = Obj_Datos.Enfermedad;
                                Obj_Relacion.Usuario_Creo = Cls_Sesiones.Usuario;
                                Obj_Relacion.Fecha_Creo = DateTime.Now;

                                dbContext.Ope_Cartilla_Vacunacion.Add(Obj_Relacion);

                                dbContext.SaveChanges();


                                transaction.Commit();

                                Mensaje.Mensaje = "La operación se realizo correctamente.";
                                Mensaje.Estatus = "success";
                            }
                            else
                            {
                                Mensaje.Mensaje = "Ya se encuentra registrado.";
                                Mensaje.Estatus = "error";
                            }
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
        public string Actualizar_Relacion(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Ope_Cartilla_Vacunacion_Negocio Obj_Datos = new Cls_Ope_Cartilla_Vacunacion_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Actualizacion de relación";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Ope_Cartilla_Vacunacion_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Ope_Cartilla_Vacunacion Obj_Relacion = new Ope_Cartilla_Vacunacion();
                            Obj_Relacion = dbContext.Ope_Cartilla_Vacunacion.Where(w => w.Relacion_Id == Obj_Datos.Relacion_Id).FirstOrDefault();
                            Obj_Relacion.Dosis = Obj_Datos.Dosis;
                            Obj_Relacion.Enfermedad = Obj_Datos.Enfermedad;
                            Obj_Relacion.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Relacion.Fecha_Modifico = DateTime.Now;

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
            Cls_Cat_Mes_Aplicacion_Vacuna_Negocio Obj_Datos = new Cls_Cat_Mes_Aplicacion_Vacuna_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Mes_Aplicacion_Vacuna_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Mes_Aplicacion_Vacuna Obj_Mes = new Cat_Mes_Aplicacion_Vacuna();
                            Obj_Mes = dbContext.Cat_Mes_Aplicacion_Vacuna.Where(w => w.Mes_Id == Obj_Datos.Mes_Id).FirstOrDefault();

                            Obj_Mes.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Mes.No_Mes = Obj_Datos.No_Mes;
                            Obj_Mes.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Mes.Fecha_Modifico = DateTime.Now;

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
            Cls_Cat_Mes_Aplicacion_Vacuna_Negocio Obj_Datos = new Cls_Cat_Mes_Aplicacion_Vacuna_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Mes_Aplicacion_Vacuna_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            //  se quitan los datos de la relacino
                            var _relacion = (from _cartilla in dbContext.Ope_Cartilla_Vacunacion
                                             where _cartilla.Mes_Id == Obj_Datos.Mes_Id
                                             select _cartilla
                                             ).ToList();


                            if (_relacion.Any())
                            {
                                foreach (var _relacion_vacuna_mes in _relacion.ToList())
                                {
                                    Ope_Cartilla_Vacunacion Obj_Cartilla = new Ope_Cartilla_Vacunacion();
                                    Obj_Cartilla = dbContext.Ope_Cartilla_Vacunacion.Where(w => w.Relacion_Id == _relacion_vacuna_mes.Relacion_Id).FirstOrDefault();

                                    dbContext.Ope_Cartilla_Vacunacion.Remove(Obj_Cartilla);
                                    dbContext.SaveChanges();
                                }
                            }



                            //  se quita el mes
                            Cat_Mes_Aplicacion_Vacuna Obj_Mes = new Cat_Mes_Aplicacion_Vacuna();

                            Obj_Mes = dbContext.Cat_Mes_Aplicacion_Vacuna.Where(w => w.Mes_Id == Obj_Datos.Mes_Id).FirstOrDefault();

                            dbContext.Cat_Mes_Aplicacion_Vacuna.Remove(Obj_Mes);
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
        public string Eliminar_Vacuna(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Ope_Cartilla_Vacunacion_Negocio Obj_Datos = new Cls_Ope_Cartilla_Vacunacion_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Ope_Cartilla_Vacunacion_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {

                            Ope_Cartilla_Vacunacion Obj_Cartilla = new Ope_Cartilla_Vacunacion();
                            Obj_Cartilla = dbContext.Ope_Cartilla_Vacunacion.Where(w => w.Relacion_Id == Obj_Datos.Relacion_Id).FirstOrDefault();

                            dbContext.Ope_Cartilla_Vacunacion.Remove(Obj_Cartilla);
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





        #region Consulta

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_MesesFiltro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Mes_Aplicacion_Vacuna_Negocio Obj = new Cls_Cat_Mes_Aplicacion_Vacuna_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Mes_Aplicacion_Vacuna_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _meses = (from _mes in dbContext.Cat_Mes_Aplicacion_Vacuna

                                  join _estatus in dbContext.Apl_Estatus on _mes.Estatus_Id equals _estatus.Estatus_ID

                                  where ((Obj.Mes_Id > 0) ? _mes.Mes_Id == Obj.Mes_Id : true)
                                  && ((Obj.Estatus_Id > 0) ? _mes.Estatus_Id == Obj.Estatus_Id : true)
                                  && ((Obj.No_Mes > 0) ? _mes.No_Mes == Obj.No_Mes : true)

                                  select new Cls_Cat_Mes_Aplicacion_Vacuna_Negocio
                                  {
                                      Mes_Id = _mes.Mes_Id,
                                      No_Mes = _mes.No_Mes ?? 0,
                                      Estatus_Id = _mes.Estatus_Id,
                                      Estatus = _estatus.Estatus ?? "",
                                  }).OrderBy(x => x.No_Mes).ToList();





                    Json_Resultado = JsonConvert.SerializeObject(_meses.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Vacunas_Meses_Relacion(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Mes_Aplicacion_Vacuna_Negocio Obj = new Cls_Cat_Mes_Aplicacion_Vacuna_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Mes_Aplicacion_Vacuna_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _consulta = (from _relaccion in dbContext.Ope_Cartilla_Vacunacion

                                  join _vacuna in dbContext.Cat_Vacunas on _relaccion.Vacuna_Id equals _vacuna.Vacuna_Id

                                  where ((Obj.Mes_Id > 0) ? _relaccion.Mes_Id == Obj.Mes_Id : true)

                                  select new Cls_Ope_Cartilla_Vacunacion_Negocio
                                  {
                                      Relacion_Id = _relaccion.Relacion_Id,
                                      Mes_Id = _relaccion.Mes_Id,
                                      Vacuna_Id = _relaccion.Vacuna_Id,
                                      Vacuna = _vacuna.Nombre,
                                      Dosis = _relaccion.Dosis,
                                      Enfermedad = _relaccion.Enfermedad,

                                  }).OrderBy(x => x.Vacuna).ToList();
                    
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
