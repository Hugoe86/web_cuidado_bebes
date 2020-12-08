using datos_red_alert;
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
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class Menu_Controller : System.Web.Services.WebService
    {
        #region (Métodos)

        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Consultar_Menus_Por_Filtros
        ///DESCRIPCIÓN          : Metodo para consultar el listado de Menus guardados
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Menus_Por_Filtros(string jsonObject)
        {
            Cls_Tra_Cat_Menus_Negocio Obj_Menus = null;
            string Json_Resultado = string.Empty;
            List<Cls_Tra_Cat_Menus_Negocio> Lista_Menus = new List<Cls_Tra_Cat_Menus_Negocio>();

            try
            {
                Obj_Menus = JsonMapper.ToObject<Cls_Tra_Cat_Menus_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Menus = (from _menus in dbContext.Apl_Menus
                                 join _estatus in dbContext.Apl_Estatus
                                 on _menus.Estatus_ID equals _estatus.Estatus_ID
                                 where
                                      (
                                      (!string.IsNullOrEmpty(Obj_Menus.Nombre_Mostrar) ? _menus.Nombre_Mostrar.ToLower().Contains(Obj_Menus.Nombre_Mostrar.ToLower()) : true) &&
                                      (!string.IsNullOrEmpty(Obj_Menus.Estatus_ID.ToString()) ? _menus.Estatus_ID.ToString().Equals(Obj_Menus.Estatus_ID.ToString()) : true)
                                      )
                                 select new Cls_Tra_Cat_Menus_Negocio
                                 {
                                     Menu_ID = _menus.Menu_ID.ToString(),
                                     Nombre_Mostrar = _menus.Nombre_Mostrar,
                                     URL_LINK = _menus.URL_LINK,
                                     Icono = _menus.Icono,
                                     Orden = _menus.Orden.ToString(),
                                     Estatus = _estatus.Estatus,
                                     Modulo_ID = _menus.Modulo_ID.ToString(),
                                     Estatus_ID = _menus.Estatus_ID.ToString(),
                                     Parent_ID = _menus.Parent_ID,
                                     Visible = ((bool)(_menus.Visible) ? true : false)
                                 }).OrderByDescending(m => m.Menu_ID);

                    foreach (var p in Menus)
                        Lista_Menus.Add((Cls_Tra_Cat_Menus_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_Menus);
                }
            }
            catch (Exception Ex)
            {
                throw new Exception("Error en el método (Consultar_Menus_Por_Filtros) de la clase (Menu_Controller). Descripción: " + Ex.Message);
            }
            return Json_Resultado;
        }
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Consultar_Menus_Padres
        ///DESCRIPCIÓN          : Metodo para consultar el listado de Menus guardados
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Menus_Padres(string jsonObject)
        {
            Cls_Tra_Cat_Menus_Negocio Obj_Menus = null;
            string Json_Resultado = string.Empty;
            List<Cls_Tra_Cat_Menus_Negocio> Lista_Menus = new List<Cls_Tra_Cat_Menus_Negocio>();

            try
            {
                Obj_Menus = JsonMapper.ToObject<Cls_Tra_Cat_Menus_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Menus = (from _menus in dbContext.Apl_Menus
                                 join _estatus in dbContext.Apl_Estatus
                                 on _menus.Estatus_ID equals _estatus.Estatus_ID
                                 where (_menus.Parent_ID.Trim() == "0" && (!string.IsNullOrEmpty(Obj_Menus.Modulo_ID) ? _menus.Modulo_ID.ToString() == Obj_Menus.Modulo_ID.ToString() : _menus.Parent_ID.Trim() == "0"))
                                 select new Cls_Tra_Cat_Menus_Negocio
                                 {
                                     Menu_ID = _menus.Menu_ID.ToString(),
                                     Nombre_Mostrar = _menus.Nombre_Mostrar,
                                     URL_LINK = _menus.URL_LINK,
                                     Icono = _menus.Icono,
                                     Orden = _menus.Orden.ToString(),
                                     Estatus = _estatus.Estatus,
                                     Modulo_ID = _menus.Modulo_ID.ToString(),
                                     Estatus_ID = _menus.Estatus_ID.ToString(),
                                     Parent_ID = (_menus.Parent_ID == null) ? null : _menus.Parent_ID,
                                     Visible = ((bool)(_menus.Visible) ? true : false)
                                 }).OrderByDescending(m => m.Menu_ID);

                    foreach (var p in Menus)
                        Lista_Menus.Add((Cls_Tra_Cat_Menus_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_Menus);
                }
            }
            catch (Exception Ex)
            {
                throw new Exception("Error en el método (Consultar_Menus_Padres) de la clase (Menu_Controller). Descripción: " + Ex.Message);
            }
            return Json_Resultado;
        }
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Consultar_Menus_Hijos
        ///DESCRIPCIÓN          : Metodo para consultar el listado de Menus guardados
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Menus_Hijos(string jsonObject)
        {
            Cls_Tra_Cat_Menus_Negocio Obj_Menus = null;
            string Json_Resultado = string.Empty;
            List<Cls_Tra_Cat_Menus_Negocio> Lista_Menus = new List<Cls_Tra_Cat_Menus_Negocio>();

            try
            {
                Obj_Menus = JsonMapper.ToObject<Cls_Tra_Cat_Menus_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Menus = (from _menus in dbContext.Apl_Menus
                                 join _estatus in dbContext.Apl_Estatus
                                 on _menus.Estatus_ID equals _estatus.Estatus_ID
                                 where (_menus.Parent_ID == Obj_Menus.Menu_ID)
                                 select new Cls_Tra_Cat_Menus_Negocio
                                 {
                                     Menu_ID = _menus.Menu_ID.ToString(),
                                     Nombre_Mostrar = _menus.Nombre_Mostrar,
                                     URL_LINK = _menus.URL_LINK,
                                     Icono = _menus.Icono,
                                     Orden = _menus.Orden.ToString(),
                                     Estatus = _estatus.Estatus,
                                     Modulo_ID = _menus.Modulo_ID.ToString(),
                                     Estatus_ID = _menus.Estatus_ID.ToString(),
                                     Parent_ID = (_menus.Parent_ID == null) ? null : _menus.Parent_ID,
                                     Visible = ((bool)(_menus.Visible) ? true : false)
                                 }).OrderByDescending(m => m.Menu_ID);

                    foreach (var p in Menus)
                        Lista_Menus.Add((Cls_Tra_Cat_Menus_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_Menus);
                }
            }
            catch (Exception Ex)
            {
                throw new Exception("Error en el método (Consultar_Menus_Padres) de la clase (Menu_Controller). Descripción: " + Ex.Message);
            }
            return Json_Resultado;
        }
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Consultar_Modulos
        ///DESCRIPCIÓN          : Metodo para consultar el listado de modulos guardados
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Modulos()
        {
            string Json_Resultado = string.Empty;
            List<Cls_Apl_Modulos_Negocio> Lista_Modulos = new List<Cls_Apl_Modulos_Negocio>();

            try
            {
                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Modulos = (from _modulos in dbContext.Apl_Modulos
                                   select new Cls_Apl_Modulos_Negocio
                                   {
                                       Modulo_ID = _modulos.Modulo_ID,
                                       Nombre = _modulos.Nombre.ToString()
                                   }).OrderByDescending(m => m.Modulo_ID);

                    foreach (var p in Modulos)
                        Lista_Modulos.Add((Cls_Apl_Modulos_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_Modulos);
                }
            }
            catch (Exception Ex)
            {
                throw new Exception("Error en el método (Consultar_Modulos) de la clase (Menu_Controller). Descripción: " + Ex.Message);
            }
            return Json_Resultado;
        }
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Consultar_Existencia
        ///DESCRIPCIÓN          : Metodo para consultar la existencia
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Existencia(string jsonObject)
        {
            Cls_Tra_Cat_Menus_Negocio Obj_Menus = null;
            string Json_Resultado = string.Empty;
            List<Cls_Tra_Cat_Menus_Negocio> Lista_Unidades = new List<Cls_Tra_Cat_Menus_Negocio>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Validations";
                Obj_Menus = JsonMapper.ToObject<Cls_Tra_Cat_Menus_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var menus_ = (from _menus in dbContext.Apl_Menus
                                  where _menus.Modulo_ID.ToString().Equals(Obj_Menus.Modulo_ID.ToString()) &&
                                ((Obj_Menus.Menu_ID == null) ? _menus.Modulo_ID.ToString().Equals(Obj_Menus.Modulo_ID.ToString()) : _menus.Menu_ID.ToString().Equals(Obj_Menus.Menu_ID.ToString())) &&
                                  _menus.Nombre_Mostrar.ToString().Equals(Obj_Menus.Nombre_Mostrar.ToString())
                                  select new Cls_Tra_Cat_Menus_Negocio
                                  {
                                      Menu_ID = _menus.Menu_ID.ToString(),
                                      Modulo_ID = _menus.Modulo_ID.ToString(),
                                      Nombre_Mostrar = _menus.Nombre_Mostrar.ToString()
                                  }).OrderByDescending(m => m.Menu_ID);

                    if (menus_.Any())
                    {
                        if (Obj_Menus.Menu_ID == null)
                        {
                            Mensaje.Estatus = "error";
                            Mensaje.Mensaje = "A menu with this name already exists in the selected module.";
                        }
                        else
                        {
                            Mensaje.Estatus = "success";
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
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Alta
        ///DESCRIPCIÓN          : Metodo para alta de menu
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(string jsonObject)
        {
            Cls_Tra_Cat_Menus_Negocio Obj_Menus = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Insert data";
                Obj_Menus = JsonMapper.ToObject<Cls_Tra_Cat_Menus_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _menus = new Apl_Menus();
                    _menus.Estatus_ID = Int32.Parse(Obj_Menus.Estatus_ID);
                    _menus.Modulo_ID = Int32.Parse(Obj_Menus.Modulo_ID);
                    _menus.Parent_ID = (Obj_Menus.Parent_ID == null || Obj_Menus.Parent_ID == string.Empty) ? "0" : Obj_Menus.Parent_ID;
                    _menus.Menu_Descripcion = Obj_Menus.Nombre_Mostrar;
                    _menus.Nombre_Mostrar = Obj_Menus.Nombre_Mostrar;
                    _menus.URL_LINK = (Obj_Menus.URL_LINK == null || Obj_Menus.URL_LINK == string.Empty) ? null : Obj_Menus.URL_LINK;
                    _menus.Orden = Int32.Parse(Obj_Menus.Orden);
                    _menus.Usuario_Modifico = Cls_Sesiones.Usuario;
                    _menus.Fecha_Modifico = new DateTime?(DateTime.Now).Value;
                    _menus.Icono = (Obj_Menus.Icono == null || Obj_Menus.Icono == string.Empty) ? null : Obj_Menus.Icono;
                    _menus.Visible = (bool)(Obj_Menus.Visible);

                    dbContext.Apl_Menus.Add(_menus);
                    dbContext.SaveChanges();
                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "The operation completed without problems.";
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
                        "There are defined fields as keys that can not be duplicated. <br />" +
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
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Actualizar
        ///DESCRIPCIÓN          : Metodo para actualizar de menu
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Actualizar(string jsonObject)
        {
            Cls_Tra_Cat_Menus_Negocio Obj_Menus = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Update data";
                Obj_Menus = JsonMapper.ToObject<Cls_Tra_Cat_Menus_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _menus = dbContext.Apl_Menus.Where(m => m.Menu_ID.ToString() == Obj_Menus.Menu_ID).First();

                    _menus.Menu_ID = Int32.Parse(Obj_Menus.Menu_ID);
                    _menus.Estatus_ID = Int32.Parse(Obj_Menus.Estatus_ID);
                    _menus.Modulo_ID = Int32.Parse(Obj_Menus.Modulo_ID);
                    _menus.Parent_ID = (Obj_Menus.Parent_ID == null || Obj_Menus.Parent_ID == string.Empty) ? "0" : Obj_Menus.Parent_ID;
                    _menus.Menu_Descripcion = Obj_Menus.Nombre_Mostrar;
                    _menus.Nombre_Mostrar = Obj_Menus.Nombre_Mostrar;
                    _menus.URL_LINK = (Obj_Menus.URL_LINK == null || Obj_Menus.URL_LINK == string.Empty) ? null : Obj_Menus.URL_LINK;
                    _menus.Orden = Int32.Parse(Obj_Menus.Orden);
                    _menus.Usuario_Modifico = Cls_Sesiones.Usuario;
                    _menus.Fecha_Modifico = new DateTime?(DateTime.Now).Value;
                    _menus.Icono = (Obj_Menus.Icono == null || Obj_Menus.Icono == string.Empty) ? null : Obj_Menus.Icono;
                    _menus.Visible = (bool)(Obj_Menus.Visible);

                    dbContext.SaveChanges();
                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "The operation completed without problems.";
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
                        "There are defined fields as keys that can not be duplicated. <br />" +
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
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : Eliminar
        ///DESCRIPCIÓN          : Metodo para eliminar de menu
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Eliminar(string jsonObject)
        {
            Cls_Tra_Cat_Menus_Negocio Obj_Menus = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Remove data";
                Obj_Menus = JsonMapper.ToObject<Cls_Tra_Cat_Menus_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _menus = dbContext.Apl_Menus.Where(m => m.Menu_ID.ToString() == Obj_Menus.Menu_ID).First();
                    dbContext.Apl_Menus.Remove(_menus);
                    dbContext.SaveChanges();
                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "The operation completed without problems.";
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Titulo = "Technical report";
                Mensaje.Estatus = "error";
                if (Ex.InnerException.InnerException.Message.Contains("The DELETE statement conflicted with the REFERENCE constraint"))
                    Mensaje.Mensaje =
                        "The delete record operation was revoked. <br /><br />" +
                        "<i class='fa fa-angle-double-right' ></i>&nbsp;&nbsp; The record you are trying to delete is already in use.";
                else
                    Mensaje.Mensaje = "Technical report: " + Ex.Message;
            }
            finally
            {
                Json_Resultado = JsonMapper.ToJson(Mensaje);
            }
            return Json_Resultado;
        }
        ///*************************************************************************************
        ///NOMBRE DE LA FUNCIÓN : ConsultarFiltroEstatus
        ///DESCRIPCIÓN          : Metodo para consultar estatus
        ///PARÁMETROS           : JsonObject con los filtros de busqueda
        ///CREO                 : Juan Alberto Hernandez Negrete
        ///FECHA_CREO           : 07/Julio/2016
        ///MODIFICO             :
        ///FECHA_MODIFICO       :
        ///CAUSA_MODIFICACIÓN   :
        ///*************************************************************************************
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ConsultarFiltroEstatus()
        {
            string Json_Resultado = string.Empty;
            List<Apl_Estatus> Lista_fase = new List<Apl_Estatus>();

            try
            {

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var estatus = from _estatus in dbContext.Apl_Estatus
                                  select new { _estatus.Estatus_ID, _estatus.Estatus };


                    Json_Resultado = JsonMapper.ToJson(estatus.ToList());


                }
            }
            catch (Exception Ex)
            {
            }
            return Json_Resultado;
        }

        #endregion (Métodos)
    }
}
