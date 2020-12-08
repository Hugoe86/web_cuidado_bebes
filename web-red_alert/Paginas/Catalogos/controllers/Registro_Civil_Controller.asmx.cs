using datos_red_alert;
using LitJson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using web_red_alert.Models.Ayudante;
using web_red_alert.Models.Negocio;

namespace web_red_alert.Paginas.Catalogos.controllers
{
    /// <summary>
    /// Summary description for Registro_Civil_Controller
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Registro_Civil_Controller : System.Web.Services.WebService
    {
        #region Eventos

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Registro_Civil_Negocio Obj_Datos = new Cls_Cat_Registro_Civil_Negocio();
            List<Cls_Cat_Horarios_Registro_Civil_Negocio> lst_Horarios = new List<Cls_Cat_Horarios_Registro_Civil_Negocio>();
            TimeSpan inicio = TimeSpan.Zero;
            TimeSpan fin = TimeSpan.Zero;
            string jsonResultado = "";
            try
            {
                Mensaje.Titulo = "Alta";



                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Registro_Civil_Negocio>(jsonObject);
                lst_Horarios = JsonConvert.DeserializeObject<List<Cls_Cat_Horarios_Registro_Civil_Negocio>>(Obj_Datos.Lista_Horarios);


                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Registro_Civil Obj_ = new Cat_Registro_Civil();

                            Obj_.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                       

                            Obj_.Nombre = Obj_Datos.Nombre;
                            Obj_.Longitud = Obj_Datos.Longitud;
                            Obj_.Latitud = Obj_Datos.Latitud;

                            Obj_.Horario_Inicio = Obj_Datos.Horario_Inicio;
                            Obj_.Horario_Termino = Obj_Datos.Horario_Termino;

                            Obj_.Lunes = Obj_Datos.Lunes;
                            Obj_.Martes = Obj_Datos.Martes;
                            Obj_.Miercoles = Obj_Datos.Miercoles;
                            Obj_.Jueves = Obj_Datos.Jueves;
                            Obj_.Viernes = Obj_Datos.Viernes;
                            Obj_.Sabado = Obj_Datos.Sabado;
                            Obj_.Domingo = Obj_Datos.Domingo;

                            Obj_.Telefono = Obj_Datos.Telefono;
                            Obj_.Sitio_Web_URL = Obj_Datos.Sitio_Web_URL;
                            Obj_.Observaciones = Obj_Datos.Observaciones;
                            Obj_.Tramite = Obj_Datos.Tramite;

                            Obj_.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_.Fecha_Creo = DateTime.Now;
                            

                            Cat_Registro_Civil _registro = dbContext.Cat_Registro_Civil.Add(Obj_);
                                            
                            foreach (var i in lst_Horarios)
                            {
                                Cat_Horarios_Registro_Civil detalles = new Cat_Horarios_Registro_Civil();

                                detalles.Registro_Civil_Id = _registro.Registro_Civil_Id;

                                detalles.Dia = i.Dia;
                                detalles.Horario_Inicio = i.Horario_Inicio;
                                detalles.Horario_Termino = i.Horario_Termino;

                                dbContext.Cat_Horarios_Registro_Civil.Add(detalles);
                            }

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
            Cls_Cat_Registro_Civil_Negocio Obj_Datos = new Cls_Cat_Registro_Civil_Negocio();
            List<Cls_Cat_Horarios_Registro_Civil_Negocio> lst_Horarios = new List<Cls_Cat_Horarios_Registro_Civil_Negocio>();
            List<Cls_Cat_Horarios_Registro_Civil_Negocio> lst_HorariosE = new List<Cls_Cat_Horarios_Registro_Civil_Negocio>();
            string jsonResultado = "";
            Int32 int_Id = 0;
   
            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Registro_Civil_Negocio>(jsonObject);
                lst_Horarios = JsonConvert.DeserializeObject<List<Cls_Cat_Horarios_Registro_Civil_Negocio>>(Obj_Datos.Lista_Horarios);
                lst_HorariosE = JsonConvert.DeserializeObject<List<Cls_Cat_Horarios_Registro_Civil_Negocio>>(Obj_Datos.Lista_HorariosE);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {

                            Cat_Registro_Civil Obj_ = new Cat_Registro_Civil();
                            Obj_ = dbContext.Cat_Registro_Civil.Where(w => w.Registro_Civil_Id == Obj_Datos.Registro_Civil_Id).FirstOrDefault();
                     

                            Obj_.Nombre = Obj_Datos.Nombre;
                            Obj_.Longitud = Obj_Datos.Longitud;
                            Obj_.Latitud = Obj_Datos.Latitud;

                            Obj_.Horario_Inicio = Obj_Datos.Horario_Inicio;
                            Obj_.Horario_Termino = Obj_Datos.Horario_Termino;

                            Obj_.Lunes = Obj_Datos.Lunes;
                            Obj_.Martes = Obj_Datos.Martes;
                            Obj_.Miercoles = Obj_Datos.Miercoles;
                            Obj_.Jueves = Obj_Datos.Jueves;
                            Obj_.Viernes = Obj_Datos.Viernes;
                            Obj_.Sabado = Obj_Datos.Sabado;
                            Obj_.Domingo = Obj_Datos.Domingo;

                            Obj_.Telefono = Obj_Datos.Telefono;                        
                            Obj_.Sitio_Web_URL = Obj_Datos.Sitio_Web_URL;
                            Obj_.Observaciones = Obj_Datos.Observaciones;
                            Obj_.Tramite = Obj_Datos.Tramite;

                            Obj_.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_.Fecha_Modifico = DateTime.Now;

                            foreach (var i in lst_Horarios)
                            {
                                Cat_Horarios_Registro_Civil detalles;
                                if (i.Estatus == "Nuevo")
                                {
                                    detalles = new Cat_Horarios_Registro_Civil();
                                    detalles.Registro_Civil_Id = Obj_.Registro_Civil_Id;
                                    detalles.Dia = i.Dia;
                                    detalles.Horario_Inicio = i.Horario_Inicio;
                                    detalles.Horario_Termino = i.Horario_Termino;

                                    dbContext.Cat_Horarios_Registro_Civil.Add(detalles);

                                }
                            }

                            foreach (var i in lst_HorariosE)
                            {
                                var _horario = dbContext.Cat_Horarios_Registro_Civil.Where(u => u.Horario_Registro_Civil_Id == i.Horario_Registro_Civil_Id).First();
                                dbContext.Cat_Horarios_Registro_Civil.Remove(_horario);
                            }

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
            Cls_Cat_Registro_Civil_Negocio Obj_Datos = new Cls_Cat_Registro_Civil_Negocio();
            string jsonResultado = "";
            Int32 Int_Id = 0;

            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Registro_Civil_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Registro_Civil Obj_ = new Cat_Registro_Civil();

                            Obj_ = dbContext.Cat_Registro_Civil.Where(w => w.Registro_Civil_Id == Obj_Datos.Registro_Civil_Id).FirstOrDefault();
                   
                            var horarios = (from _horario in dbContext.Cat_Horarios_Registro_Civil
                                            where
                                            _horario.Registro_Civil_Id == Obj_Datos.Registro_Civil_Id
                                            select new Cls_Cat_Horarios_Registro_Civil_Negocio
                                            {
                                                Registro_Civil_Id = _horario.Registro_Civil_Id,
                                                Horario_Registro_Civil_Id = _horario.Horario_Registro_Civil_Id
                                            }).ToList();
                            foreach (var i in horarios)
                            {
                                Cat_Horarios_Registro_Civil _eliminar = new Cat_Horarios_Registro_Civil();
                                _eliminar = dbContext.Cat_Horarios_Registro_Civil.Where(w => w.Horario_Registro_Civil_Id == i.Horario_Registro_Civil_Id).FirstOrDefault();
                                dbContext.Cat_Horarios_Registro_Civil.Remove(_eliminar);
                            }

                            dbContext.Cat_Registro_Civil.Remove(Obj_);
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
        public string Consultar_Registros_Filtro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Registro_Civil_Negocio Obj = new Cls_Cat_Registro_Civil_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Registro_Civil_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _Registro_Civil = (from _ubic in dbContext.Cat_Registro_Civil

                                        join _estatus in dbContext.Apl_Estatus on _ubic.Estatus_Id equals _estatus.Estatus_ID
                                       
                                        where                        
                                         ((Obj.Nombre != "") ? _ubic.Nombre.ToString().Contains(Obj.Nombre.ToString()) : true)
                                        && ((Obj.Estatus_Id > 0) ? _ubic.Estatus_Id == Obj.Estatus_Id : true)

                                        select new Cls_Cat_Registro_Civil_Negocio
                                        {
                                            Registro_Civil_Id = _ubic.Registro_Civil_Id,
                                            Estatus_Id = _ubic.Estatus_Id,
                                            Nombre = _ubic.Nombre,
                                            Longitud = _ubic.Longitud ?? 0,
                                            Latitud = _ubic.Latitud ?? 0,

                                            Telefono = _ubic.Telefono,                                      
                                            Sitio_Web_URL = _ubic.Sitio_Web_URL,
                                            Observaciones = _ubic.Observaciones,                                     
                                            Estatus = _estatus.Estatus,
                                            Tramite = _ubic.Tramite,

                                        })
                                          .OrderBy(x => x.Nombre).ToList();



                  

                    Json_Resultado = JsonConvert.SerializeObject(_Registro_Civil.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Horarios_Registro_Civil(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Horarios_Registro_Civil_Negocio Obj = new Cls_Cat_Horarios_Registro_Civil_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Horarios_Registro_Civil_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _Ubicaciones = (from _ubic in dbContext.Cat_Horarios_Registro_Civil

                                        where
                                        _ubic.Registro_Civil_Id == Obj.Registro_Civil_Id

                                        select new Cls_Cat_Horarios_Registro_Civil_Negocio
                                        {
                                            Registro_Civil_Id = _ubic.Registro_Civil_Id,
                                            Horario_Registro_Civil_Id = _ubic.Horario_Registro_Civil_Id,
                                            Horario_Inicio = _ubic.Horario_Inicio.Value,
                                            Horario_Termino = _ubic.Horario_Termino.Value,
                                            Dia = _ubic.Dia

                                        })
                                          .OrderBy(x => x.Horario_Registro_Civil_Id).ToList();

                    Json_Resultado = JsonConvert.SerializeObject(_Ubicaciones.ToList());
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
