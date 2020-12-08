﻿using datos_red_alert;
using LitJson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using web_red_alert.Models.Ayudante;
using web_red_alert.Models.Negocio;

namespace web_red_alert.Paginas.Paginas_Generales.controllers
{
    /// <summary>
    /// Summary description for Modulos_Controller
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Modulos_Controller : System.Web.Services.WebService
    {
        #region (Métodos)
        /// <summary>
        /// Método que realiza el alta de la Tipos_Productos.
        /// </summary>
        /// <returns>Objeto serializado con los resultados de la operación</returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(string jsonObject)
        {
            Cls_Apl_Modulos_Negocio Obj_Modulos = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Alta";
                Obj_Modulos = JsonMapper.ToObject<Cls_Apl_Modulos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _modulos = new Apl_Modulos();
                    _modulos.Nombre = Obj_Modulos.Nombre;
                    _modulos.Orden = Int32.Parse(Obj_Modulos.Orden);
                    _modulos.Icono = (Obj_Modulos.Icono == null || Obj_Modulos.Icono == string.Empty) ? null : Obj_Modulos.Icono;
                    _modulos.Usuario_Creo = Cls_Sesiones.Datos_Usuario.Usuario;
                    _modulos.Fecha_Creo = new DateTime?(DateTime.Now).Value;

                    dbContext.Apl_Modulos.Add(_modulos);
                    dbContext.SaveChanges();
                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "La operación se completó sin problemas.";
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Titulo = "Technical report";
                Mensaje.Estatus = "error";
                if (Ex.InnerException.Message.Contains("String or binary data would be truncated"))
                    Mensaje.Mensaje =
                        "Any of the fields you are trying to insert have a size larger than that set in the database. <br /><br />" +
                        "<i class='fa fa-angle-double-right' ></i>&nbsp;&nbsp; String or binary data would be truncated";
                else if (Ex.InnerException.InnerException.Message.Contains("Cannot insert duplicate key row in object"))
                    Mensaje.Mensaje =
                        "There are fields defined as names that can not be duplicated. <br />" +
                        "<i class='fa fa-angle-double-right' ></i>&nbsp;&nbsp; Please check that you are not entering duplicate data.";
                else
                    Mensaje.Mensaje = "Technical report: " + Ex.Message;
            }
            finally
            {
                Json_Resultado = JsonMapper.ToJson(Mensaje);
            }
            return Json_Resultado;
        }
        /// <summary>
        /// Método que realiza la actualización de los datos de la Tipos_Productos seleccionada.
        /// </summary>
        /// <returns>Objeto serializado con los resultados de la operación</returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Actualizar(string jsonObject)
        {
            Cls_Apl_Modulos_Negocio Obj_Modulos = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Actualización";
                Obj_Modulos = JsonMapper.ToObject<Cls_Apl_Modulos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _modulos = dbContext.Apl_Modulos.Where(u => u.Modulo_ID == Obj_Modulos.Modulo_ID).First();

                    _modulos.Nombre = Obj_Modulos.Nombre;
                    _modulos.Orden = Int32.Parse(Obj_Modulos.Orden);
                    _modulos.Icono = (Obj_Modulos.Icono == null || Obj_Modulos.Icono == string.Empty) ? null : Obj_Modulos.Icono;
                    _modulos.Usuario_Modifico = Cls_Sesiones.Datos_Usuario.Usuario;
                    _modulos.Fecha_Modifico = new DateTime?(DateTime.Now);

                    dbContext.SaveChanges();
                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "La operación se completó sin problemas.";
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Titulo = "Technical report";
                Mensaje.Estatus = "error";
                if (Ex.InnerException.Message.Contains("String or binary data would be truncated"))
                    Mensaje.Mensaje =
                        "Any of the fields you are trying to insert have a size larger than that set in the database. <br /><br />" +
                        "<i class='fa fa-angle-double-right' ></i>&nbsp;&nbsp; String or binary data would be truncated";
                else if (Ex.InnerException.InnerException.Message.Contains("Cannot insert duplicate key row in object"))
                    Mensaje.Mensaje =
                        "There are fields defined as names that can not be duplicated. <br />" +
                        "<i class='fa fa-angle-double-right' ></i>&nbsp;&nbsp; Please check that you are not entering duplicate data.";
                else
                    Mensaje.Mensaje = "Technical report: " + Ex.Message;
            }
            finally
            {
                Json_Resultado = JsonMapper.ToJson(Mensaje);
            }
            return Json_Resultado;
        }
        /// <summary>
        /// Método que elimina el registro seleccionado.
        /// </summary>
        /// <returns>Objeto serializado con los resultados de la operación</returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Eliminar(string jsonObject)
        {
            Cls_Apl_Modulos_Negocio Obj_Modulos = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Eliminar";
                Obj_Modulos = JsonMapper.ToObject<Cls_Apl_Modulos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _modulos = dbContext.Apl_Modulos.Where(u => u.Modulo_ID == Obj_Modulos.Modulo_ID).First();
                    dbContext.Apl_Modulos.Remove(_modulos);
                    dbContext.SaveChanges();
                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "La operación se completó sin problemas.";
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "Technical report: " + Ex.Message;
            }
            finally
            {
                Json_Resultado = JsonMapper.ToJson(Mensaje);
            }
            return Json_Resultado;
        }
        /// <summary>
        /// Método que realiza la búsqueda de Tipos_Productos.
        /// </summary>
        /// <returns>Listado de Tipos_Productos filtradas por clave</returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Modulos_Por_Nombre(string jsonObject)
        {
            Cls_Apl_Modulos_Negocio Obj_Modulos = null;
            string Json_Resultado = string.Empty;
            List<Cls_Apl_Modulos_Negocio> Lista_Modulos = new List<Cls_Apl_Modulos_Negocio>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Validaciones";
                Obj_Modulos = JsonMapper.ToObject<Cls_Apl_Modulos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _modulos = (from _Modulos in dbContext.Apl_Modulos
                                            where
                                            _Modulos.Nombre.Equals(Obj_Modulos.Nombre)
                                            select new Cls_Apl_Modulos_Negocio
                                            {
                                                Modulo_ID = _Modulos.Modulo_ID,
                                                Nombre = _Modulos.Nombre,
                                                Icono = _Modulos.Icono,
                                                Orden = _Modulos.Orden.ToString()
                                            }).OrderByDescending(u => u.Modulo_ID);

                    if (_modulos.Any())
                    {
                        if (Obj_Modulos.Modulo_ID == 0)
                        {
                            Mensaje.Estatus = "error";
                            if (!string.IsNullOrEmpty(Obj_Modulos.Nombre))
                                Mensaje.Mensaje = "El nombre introducido ya está registrado.";
                        }
                        else
                        {
                            var item_edit = _modulos.Where(u => u.Modulo_ID == Obj_Modulos.Modulo_ID);

                            if (item_edit.Count() == 1)
                                Mensaje.Estatus = "success";
                            else
                            {
                                Mensaje.Estatus = "error";
                                if (!string.IsNullOrEmpty(Obj_Modulos.Nombre))
                                    Mensaje.Mensaje = "El nombre introducido ya está registrado.";
                            }
                        }
                    }
                    else
                        Mensaje.Estatus = "success";

                    Json_Resultado = JsonMapper.ToJson(Mensaje);
                }
            }
            catch (Exception Ex)
            {

            }
            return Json_Resultado;
        }
        /// <summary>
        /// Método que realiza la búsqueda de Tipos_Productos.
        /// </summary>
        /// <returns>Listado serializado con las Tipos_Productos según los filtros aplícados</returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Modulos_Por_Filtros(string jsonObject)
        {
            Cls_Apl_Modulos_Negocio Obj_Modulos = null;
            string Json_Resultado = string.Empty;
            List<Cls_Apl_Modulos_Negocio> Lista_Modulos = new List<Cls_Apl_Modulos_Negocio>();

            try
            {
                Obj_Modulos = JsonMapper.ToObject<Cls_Apl_Modulos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Modulos = (from _modulos in dbContext.Apl_Modulos
                                    where
                                     (!string.IsNullOrEmpty(Obj_Modulos.Nombre) ? _modulos.Nombre.ToLower().Contains(Obj_Modulos.Nombre.ToLower()) : true)
                                    select new Cls_Apl_Modulos_Negocio
                                    {
                                        Modulo_ID = _modulos.Modulo_ID,
                                        Nombre = _modulos.Nombre,
                                        Icono = _modulos.Icono,
                                        Orden = _modulos.Orden.ToString(),
                                    }).OrderByDescending(u => u.Modulo_ID);

                    foreach (var p in Modulos)
                        Lista_Modulos.Add((Cls_Apl_Modulos_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_Modulos);
                }
            }
            catch (Exception Ex)
            {

            }
            return Json_Resultado;
        }
        #endregion
    }
}
