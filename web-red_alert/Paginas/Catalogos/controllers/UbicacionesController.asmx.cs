using datos_red_alert;
using LitJson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
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
    /// Descripción breve de UbicacionesController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class UbicacionesController : System.Web.Services.WebService
    {
        #region Eventos

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Ubicaciones_Negocio Obj_Datos = new Cls_Cat_Ubicaciones_Negocio();
            List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio> lst_Horarios = new List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio>();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Ubicaciones_Negocio>(jsonObject);
                lst_Horarios = JsonConvert.DeserializeObject<List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio>>(Obj_Datos.Lista_Horarios);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Ubicaciones Obj_ = new Cat_Ubicaciones();

                            Obj_.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_.Tipo_Instalacion_Id = Convert.ToInt32(Obj_Datos.Tipo_Instalacion_Id);

                            Obj_.Nombre = Obj_Datos.Nombre;
                            Obj_.Longitud = Obj_Datos.Longitud;
                            Obj_.Latitud = Obj_Datos.Latitud;

                            
                            Obj_.Horario_Inicio = TimeSpan.Zero;
                            Obj_.Horario_Termino = TimeSpan.Zero;

                            Obj_.Lunes = Obj_Datos.Lunes;
                            Obj_.Martes = Obj_Datos.Martes;
                            Obj_.Miercoles = Obj_Datos.Miercoles;
                            Obj_.Jueves = Obj_Datos.Jueves;
                            Obj_.Viernes = Obj_Datos.Viernes;
                            Obj_.Sabado = Obj_Datos.Sabado;
                            Obj_.Domingo = Obj_Datos.Domingo;

                            Obj_.Telefono = Obj_Datos.Telefono;
                            Obj_.Telefono_Urgencias = Obj_Datos.Telefono_Urgencias;
                            Obj_.Sitio_Web_URL = Obj_Datos.Sitio_Web_URL;
                            Obj_.Observaciones = Obj_Datos.Observaciones;
                            Obj_.Emergencias = Obj_Datos.Emergencias;

                            Obj_.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_.Fecha_Creo = DateTime.Now;

                            Cat_Ubicaciones _ubicacion = dbContext.Cat_Ubicaciones.Add(Obj_);

                            foreach (var i in lst_Horarios)
                            {
                                Cat_Horarios_Ubicaciones detalles = new Cat_Horarios_Ubicaciones();

                                detalles.Ubicacion_Id = _ubicacion.Ubicacion_Id;

                                detalles.Dia = i.Dia;
                                detalles.Horario_Inicio = i.Horario_Inicio;
                                detalles.Horario_Termino = i.Horario_Termino;

                                dbContext.Cat_Horarios_Ubicaciones.Add(detalles);
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
            Cls_Cat_Ubicaciones_Negocio Obj_Datos = new Cls_Cat_Ubicaciones_Negocio();
            List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio> lst_Horarios = new List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio>();
            List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio> lst_HorariosE = new List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio>();
            string jsonResultado = "";
            Int32 int_Id = 0;

            try
            {
                Mensaje.Titulo = "Actualizar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Ubicaciones_Negocio>(jsonObject);
                lst_Horarios = JsonConvert.DeserializeObject<List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio>>(Obj_Datos.Lista_Horarios);
                lst_HorariosE = JsonConvert.DeserializeObject<List<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio>>(Obj_Datos.Lista_HorariosE);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {

                            Cat_Ubicaciones Obj_ = new Cat_Ubicaciones();
                            Obj_ = dbContext.Cat_Ubicaciones.Where(w => w.Ubicacion_Id == Obj_Datos.Ubicacion_Id).FirstOrDefault();
                            Obj_.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_.Tipo_Instalacion_Id = Convert.ToInt32(Obj_Datos.Tipo_Instalacion_Id);

                            Obj_.Nombre = Obj_Datos.Nombre;
                            Obj_.Longitud = Obj_Datos.Longitud;
                            Obj_.Latitud = Obj_Datos.Latitud;

                            Obj_.Horario_Inicio = TimeSpan.Zero;
                            Obj_.Horario_Termino = TimeSpan.Zero;

                            Obj_.Lunes = Obj_Datos.Lunes;
                            Obj_.Martes = Obj_Datos.Martes;
                            Obj_.Miercoles = Obj_Datos.Miercoles;
                            Obj_.Jueves = Obj_Datos.Jueves;
                            Obj_.Viernes = Obj_Datos.Viernes;
                            Obj_.Sabado = Obj_Datos.Sabado;
                            Obj_.Domingo = Obj_Datos.Domingo;

                            Obj_.Telefono = Obj_Datos.Telefono;
                            Obj_.Telefono_Urgencias = Obj_Datos.Telefono_Urgencias;
                            Obj_.Sitio_Web_URL = Obj_Datos.Sitio_Web_URL;
                            Obj_.Observaciones = Obj_Datos.Observaciones;
                            Obj_.Emergencias = Obj_Datos.Emergencias;

                            Obj_.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_.Fecha_Modifico = DateTime.Now;

                            foreach (var i in lst_Horarios)
                            {
                                Cat_Horarios_Ubicaciones detalles;
                                if (i.Estatus == "Nuevo")
                                {
                                    detalles = new Cat_Horarios_Ubicaciones();
                                    detalles.Ubicacion_Id = Obj_.Ubicacion_Id;
                                    detalles.Dia = i.Dia;
                                    detalles.Horario_Inicio = i.Horario_Inicio;
                                    detalles.Horario_Termino = i.Horario_Termino;

                                    dbContext.Cat_Horarios_Ubicaciones.Add(detalles);

                                }

                            }

                            foreach (var i in lst_HorariosE)
                            {
                                var _horario = dbContext.Cat_Horarios_Ubicaciones.Where(u => u.Horario_Ubicacion_ID == i.Horario_Ubicacion_ID).First();
                                dbContext.Cat_Horarios_Ubicaciones.Remove(_horario);
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
            Cls_Cat_Ubicaciones_Negocio Obj_Datos = new Cls_Cat_Ubicaciones_Negocio();
            string jsonResultado = "";
            Int32 Int_Id = 0;

            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Ubicaciones_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Ubicaciones Obj_ = new Cat_Ubicaciones();

                            Obj_ = dbContext.Cat_Ubicaciones.Where(w => w.Ubicacion_Id == Obj_Datos.Ubicacion_Id).FirstOrDefault();
                            var horarios = (from _horario in dbContext.Cat_Horarios_Ubicaciones
                                            where
                                            _horario.Ubicacion_Id == Obj_.Ubicacion_Id
                                            select new Cls_Cat_Cat_Horarios_Ubicaciones_Negocio
                                            {
                                                Ubicacion_Id = _horario.Ubicacion_Id,
                                                Horario_Ubicacion_ID = _horario.Horario_Ubicacion_ID
                                            }).ToList();
                            foreach(var i in horarios)
                            {
                                Cat_Horarios_Ubicaciones _eliminar = new Cat_Horarios_Ubicaciones();
                                _eliminar = dbContext.Cat_Horarios_Ubicaciones.Where(w => w.Horario_Ubicacion_ID == i.Horario_Ubicacion_ID).FirstOrDefault();
                                dbContext.Cat_Horarios_Ubicaciones.Remove(_eliminar);
                            }
                                                 
                            dbContext.Cat_Ubicaciones.Remove(Obj_);
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
        public string Consultar_Ubicaciones_Filtro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Ubicaciones_Negocio Obj = new Cls_Cat_Ubicaciones_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Ubicaciones_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _Ubicaciones = (from _ubic in dbContext.Cat_Ubicaciones

                                        join _estatus in dbContext.Apl_Estatus on _ubic.Estatus_Id equals _estatus.Estatus_ID
                                        join _tipo in dbContext.Cat_Tipo_Instalacion on _ubic.Tipo_Instalacion_Id equals _tipo.Tipo_Instalacion_Id

                                        where ((Obj.Tipo_Instalacion_Id > 0) ? _ubic.Tipo_Instalacion_Id == Obj.Tipo_Instalacion_Id : true)
                                        && ((Obj.Nombre != "") ? _ubic.Nombre.ToString().Contains(Obj.Nombre.ToString()) : true)
                                        && ((Obj.Estatus_Id > 0) ? _ubic.Estatus_Id == Obj.Estatus_Id : true)

                                        select new Cls_Cat_Ubicaciones_Negocio
                                        {
                                            Ubicacion_Id = _ubic.Ubicacion_Id,
                                            Estatus_Id = _ubic.Estatus_Id,
                                            Tipo_Instalacion_Id = _ubic.Tipo_Instalacion_Id,
                                            Nombre = _ubic.Nombre,
                                            Longitud = _ubic.Longitud ?? 0,
                                            Latitud = _ubic.Latitud ?? 0,

                                            //Horario_Inicio = _ubic.Horario_Inicio.Value,
                                            //Horario_Termino = _ubic.Horario_Termino.Value,

                                            //Str_Horario_Inicio = _ubic.Horario_Inicio.ToString(),
                                            //Str_Horario_Termino = _ubic.Horario_Termino.ToString(),

                                            //Lunes = _ubic.Lunes ?? false,
                                            //Martes = _ubic.Martes ?? false,
                                            //Miercoles = _ubic.Miercoles ?? false,
                                            //Jueves = _ubic.Jueves ?? false,
                                            //Viernes = _ubic.Viernes ?? false,
                                            //Sabado = _ubic.Sabado ?? false,
                                            //Domingo = _ubic.Domingo ?? false,

                                            Telefono = _ubic.Telefono,
                                            Telefono_Urgencias = _ubic.Telefono_Urgencias,
                                            Sitio_Web_URL = _ubic.Sitio_Web_URL,
                                            Observaciones = _ubic.Observaciones,
                                            Emergencias = _ubic.Emergencias,
                                            Estatus = _estatus.Estatus,
                                            Tipo_Instalacion = _tipo.Nombre,

                                            Abierto = false,

                                        })
                                          .OrderBy(x => x.Nombre).ToList();



                    ////  se obtiene la fecha actual
                    //DateTime Dtime_Fecha_Hora_Actual = DateTime.Now;
                    //TimeSpan Time_Hora_Actual = Dtime_Fecha_Hora_Actual.TimeOfDay;
                    //String Lunes = "";
                    //String Martes = "";
                    //String Miercoles = "";
                    //String Jueves = "";
                    //String Viernes = "";
                    //String Sabado = "";
                    //String Domingo = "";

                    //String Str_Dia_Semana = "";

                    //Str_Dia_Semana = Dtime_Fecha_Hora_Actual.ToString("dddd", new CultureInfo("es-Mx"));

                    //switch (Str_Dia_Semana)
                    //{
                    //    case "lunes":
                    //        Lunes ="Lunes" ;
                    //        break;
                    //    case "martes":
                    //        Martes = "Martes";
                    //        break;
                    //    case "miércoles":
                    //        Miercoles = "Miércoles";
                    //        break;
                    //    case "jueves":
                    //        Jueves = "Jueves";
                    //        break;
                    //    case "viernes":
                    //        Viernes = "Viernes";
                    //        break;
                    //    case "sabado":
                    //        Sabado = "Sábado";
                    //        break;
                    //    case "domingo":
                    //        Domingo = "Domingo";
                    //        break;
                    //};

                    //foreach (var i in _Ubicaciones)
                    //{
                    //    var _Horarios_Ubicaciones = (from _horarios in dbContext.Cat_Horarios_Ubicaciones
                    //                                 where
                    //                                 _horarios.Ubicacion_Id == i.Ubicacion_Id
                    //                                 select new Cls_Cat_Cat_Horarios_Ubicaciones_Negocio
                    //                                 {
                    //                                     Horario_Inicio = _horarios.Horario_Inicio,
                    //                                     Horario_Termino = _horarios.Horario_Termino,
                    //                                     Dia = _horarios.Dia

                    //                                 })
                    //                 .OrderBy(x => x.Dia).ToList();

                    //    _Horarios_Ubicaciones.Where(
                    //                        w => w.Horario_Inicio <= Time_Hora_Actual
                    //                        && w.Horario_Termino >= Time_Hora_Actual
                    //                        && ((Lunes == "Lunes") ? w.Dia == Lunes : true)
                    //                        && ((Martes == "") ? w.Dia == Martes : true)
                    //                        && ((Miercoles == "") ? w.Dia == Miercoles : true)
                    //                        && ((Jueves == "") ? w.Dia == Jueves : true)
                    //                        && ((Viernes == "") ? w.Dia == Viernes : true)
                    //                        && ((Sabado == "") ? w.Dia == Sabado : true)
                    //                        && ((Domingo == "") ? w.Dia == Domingo : true)

                    //                    ).Select(x =>
                    //                    {
                    //                        i.Abierto = true;
                    //                        return x;
                    //                    }).ToList();

                    //}

                    var _Ubicaciones_Filtradas = _Ubicaciones.ToList();



                    Json_Resultado = JsonConvert.SerializeObject(_Ubicaciones.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Horarios_Ubicaciones(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Cat_Horarios_Ubicaciones_Negocio Obj = new Cls_Cat_Cat_Horarios_Ubicaciones_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Cat_Horarios_Ubicaciones_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _Ubicaciones = (from _ubic in dbContext.Cat_Horarios_Ubicaciones

                                        where
                                        _ubic.Ubicacion_Id == Obj.Ubicacion_Id

                                        select new Cls_Cat_Cat_Horarios_Ubicaciones_Negocio
                                        {
                                            Ubicacion_Id = _ubic.Ubicacion_Id,
                                            Horario_Ubicacion_ID = _ubic.Horario_Ubicacion_ID,
                                            Horario_Inicio = _ubic.Horario_Inicio.Value,
                                            Horario_Termino = _ubic.Horario_Termino.Value,
                                            Dia = _ubic.Dia,
                                           

                                        })
                                          .OrderBy(x => x.Horario_Ubicacion_ID).ToList();

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