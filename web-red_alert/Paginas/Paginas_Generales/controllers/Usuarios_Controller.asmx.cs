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

namespace web_red_alert.Paginas.Catalogos.controller
{
    /// <summary>
    /// Summary description for Usuarios_Controller
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Usuarios_Controller : System.Web.Services.WebService
    {
        #region Metodos
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Usuarios_Por_Nombre(string jsonObject)
        {
            Cls_Usuarios_Negocio ObjUsuarios = null;
            string Json_Resultado = string.Empty;
            List<Cls_Usuarios_Negocio> Lista_Usuarios = new List<Cls_Usuarios_Negocio>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Validations";
                ObjUsuarios = JsonMapper.ToObject<Cls_Usuarios_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _usuarios = (from _select in dbContext.Apl_Usuarios
                                           where 
                                           _select.Usuario.Equals(ObjUsuarios.Usuario)
                                           || _select.Email.Equals(ObjUsuarios.Email)
                                           select new Cls_Usuarios_Negocio
                                           {
                                               Usuario_ID = _select.Usuario_ID,
                                               Usuario = _select.Usuario,
                                                Email = _select.Email
                                           }).OrderByDescending(u => u.Usuario_ID);

                    if (_usuarios.Any())
                    {
                        if (ObjUsuarios.Usuario_ID == 0)
                        {
                            Mensaje.Estatus = "error";
                            if (!string.IsNullOrEmpty(ObjUsuarios.Usuario))
                                Mensaje.Mensaje = "The registered user is already registered.";
                            else if (!string.IsNullOrEmpty(ObjUsuarios.Email))
                                Mensaje.Mensaje = "The registered email is already registered.";
                        }
                        else
                        {
                            var item_edit = _usuarios.Where(u => u.Usuario_ID == ObjUsuarios.Usuario_ID);

                            if (item_edit.Count() == 1)
                                Mensaje.Estatus = "success";
                            else
                            {
                                Mensaje.Estatus = "error";
                                if (!string.IsNullOrEmpty(ObjUsuarios.Usuario))
                                    Mensaje.Mensaje = "The registered user is already registered.";
                                else if (!string.IsNullOrEmpty(ObjUsuarios.Email))
                                    Mensaje.Mensaje = "The registered email is already registered.";
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
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color: #FF0004;'></i>&nbsp;Technical report: " + Ex.Message;
            }
            return Json_Resultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Usuarios_Por_Filtros(string jsonObject)
        {
            Cls_Usuarios_Negocio objUsuarios = null;
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            string Json_Resultado = string.Empty;
            List<Cls_Usuarios_Negocio> Lista_usuarios = new List<Cls_Usuarios_Negocio>();
            int empresa = string.IsNullOrEmpty(Cls_Sesiones.Empresa_ID) ? -1 : Convert.ToInt32(Cls_Sesiones.Empresa_ID);
            try
            {
                objUsuarios = JsonMapper.ToObject<Cls_Usuarios_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _usuarios = (from _select in dbContext.Apl_Usuarios
                                     join _rol in dbContext.Apl_Rel_Usuarios_Roles on _select.Usuario_ID equals _rol.Usuario_ID
                                     where _select.Empresa_ID.Equals(empresa) &&
                                     (!string.IsNullOrEmpty(objUsuarios.Usuario) ? _select.Usuario.ToLower().Contains(objUsuarios.Usuario.ToLower()) : true) &&
                                     ((objUsuarios.Estatus_ID != 0) ? _select.Estatus_ID.Equals(objUsuarios.Estatus_ID) : true)
                                           select new Cls_Usuarios_Negocio
                                           {
                                               Usuario_ID = _select.Usuario_ID,
                                               Empresa_ID = _select.Empresa_ID,
                                               Tipo_Usuario_ID = _select.Tipo_Usuario_ID,
                                               Estatus_ID = _select.Estatus_ID,
                                               Usuario = _select.Usuario,
                                               Password = _select.Password,
                                               Email = _select.Email,
                                               Rol_ID = _rol.Rol_ID,
                                               Rel_Usuarios_Rol_ID = _rol.Rel_Usuario_Rol_ID,
                                               Usuario_login = _select.Usuario_login

                                           }).OrderByDescending(u => u.Usuario_ID);

                    foreach (var p in _usuarios)
                        Lista_usuarios.Add((Cls_Usuarios_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_usuarios);
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color: #FF0004;'></i>&nbsp;Technical report: " + Ex.Message;
            }
            return Json_Resultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(string jsonObject)
        {
            Cls_Usuarios_Negocio ObjUsuarios = null;
            Cls_Usuarios_Negocio ObjRol = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Insert data";
                ObjUsuarios = JsonMapper.ToObject<Cls_Usuarios_Negocio>(jsonObject);
                ObjRol = JsonMapper.ToObject<Cls_Usuarios_Negocio>(jsonObject);

                DateTime date = DateTime.Now.AddMonths(5);

                using (var dbContext_Sucursal = new ERP_EJE_CENTRALEntities())
                {


                    using (var dbContext = new ERP_EJE_CENTRALEntities())
                    {
                        var _usuarios = new Apl_Usuarios();

                        _usuarios.Empresa_ID = Convert.ToInt32(Cls_Sesiones.Empresa_ID);
                        _usuarios.Estatus_ID = ObjUsuarios.Estatus_ID;
                        _usuarios.Tipo_Usuario_ID = ObjUsuarios.Tipo_Usuario_ID;
                        _usuarios.Usuario = ObjUsuarios.Usuario;
                        _usuarios.Password = Cls_Seguridad.Encriptar(ObjUsuarios.Password);
                        _usuarios.No_Intentos_Recuperar = "9";
                        _usuarios.Email = ObjUsuarios.Email;
                        _usuarios.Fecha_Expira_Contrasenia = date;
                        _usuarios.Usuario_Creo = Cls_Sesiones.Datos_Usuario.Usuario;
                        _usuarios.Fecha_Creo = new DateTime?(DateTime.Now).Value;
                        _usuarios.Fecha_Token = date;
                        _usuarios.Usuario_login = ObjUsuarios.Usuario_login;
                        dbContext.Apl_Usuarios.Add(_usuarios);

                        var _roles = new Apl_Rel_Usuarios_Roles();

                        _roles.Empresa_ID = Convert.ToInt32(Cls_Sesiones.Empresa_ID);
                        //_roles.Sucursal_ID = sucursal_ID;
                        _roles.Usuario_ID = ObjUsuarios.Usuario_ID;
                        _roles.Rol_ID = ObjRol.Rol_ID;
                        dbContext.Apl_Rel_Usuarios_Roles.Add(_roles);

                        dbContext.SaveChanges();
                        Mensaje.Estatus = "success";
                        Mensaje.Mensaje = "The operation completed without problems.";
                    }
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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Actualizar(string jsonObject)
        {
            Cls_Usuarios_Negocio ObjUsuarios = null;
            Cls_Apl_Rel_Usuarios_Roles_Negocio ObjRol = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Update data";
                ObjUsuarios = JsonMapper.ToObject<Cls_Usuarios_Negocio>(jsonObject);
                ObjRol = JsonMapper.ToObject<Cls_Apl_Rel_Usuarios_Roles_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _usuarios = dbContext.Apl_Usuarios.Where(u => u.Usuario_ID == ObjUsuarios.Usuario_ID).First();

                    _usuarios.Estatus_ID = ObjUsuarios.Estatus_ID;
                    _usuarios.Tipo_Usuario_ID = ObjUsuarios.Tipo_Usuario_ID;
                    _usuarios.Usuario = ObjUsuarios.Usuario;                    
                    _usuarios.Password = Cls_Seguridad.Encriptar(ObjUsuarios.Password);
                    _usuarios.Email = ObjUsuarios.Email;
                    _usuarios.Usuario_login = ObjUsuarios.Usuario_login;
                    _usuarios.Usuario_Modifico = Cls_Sesiones.Datos_Usuario.Usuario;
                    _usuarios.Fecha_Modifico = new DateTime?(DateTime.Now);

                    var _rol = dbContext.Apl_Rel_Usuarios_Roles.Where(a => a.Usuario_ID == ObjRol.Usuario_ID).First();
                    _rol.Rol_ID = ObjRol.Rol_ID;

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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Eliminar(string jsonObject)
        {
            Cls_Usuarios_Negocio ObjUsuarios = null;
            Cls_Apl_Rel_Usuarios_Roles_Negocio ObjRol = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Remove data";
                ObjUsuarios = JsonMapper.ToObject<Cls_Usuarios_Negocio>(jsonObject);
                ObjRol = JsonMapper.ToObject<Cls_Apl_Rel_Usuarios_Roles_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _usuarios = dbContext.Apl_Usuarios.Where(u => u.Usuario_ID == ObjUsuarios.Usuario_ID).First();
                    dbContext.Apl_Usuarios.Remove(_usuarios);

                    var _rol = dbContext.Apl_Rel_Usuarios_Roles.Where(a => a.Usuario_ID == ObjRol.Usuario_ID).First();
                    dbContext.Apl_Rel_Usuarios_Roles.Remove(_rol);

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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ConsultarFiltroEstatus()
        {
            string Json_Resultado = string.Empty;
            List<Apl_Estatus> Lista_filtro = new List<Apl_Estatus>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();
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
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color: #FF0004;'></i>&nbsp;Technical report: " + Ex.Message;
            }
            return Json_Resultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ConsultarEstatus()
        {
            string Json_Resultado = string.Empty;
            List<Apl_Estatus> Lista_estatus = new List<Apl_Estatus>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            try
            {

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var Estatus = from _select in dbContext.Apl_Estatus
                                  select new { _select.Estatus, _select.Estatus_ID };
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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ConsultarTipoUsuario()
        {
            string Json_Resultado = string.Empty;
            List<Apl_Tipos_Usuarios> Lista_tipo_usuario = new List<Apl_Tipos_Usuarios>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            try
            {

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var tipo_usuario = from _select in dbContext.Apl_Tipos_Usuarios
                                  select new { _select.Tipo_Usuario_ID, _select.Nombre };
                    Json_Resultado = JsonMapper.ToJson(tipo_usuario.ToList());
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color: #FF0004;'></i>&nbsp;Technical report: " + Ex.Message;
            }
            return Json_Resultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ConsultarRol()
        {
            string Json_Resultado = string.Empty;
            List<Apl_Roles> Lista_tipo_usuario = new List<Apl_Roles>();
            //int sucursal_ID;
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            int empresa = Convert.ToInt32(Cls_Sesiones.Empresa_ID);
            try
            {

               using (var dbContext_Sucursal = new ERP_EJE_CENTRALEntities())
                {
                    //var _sucursal = dbContext_Sucursal.Apl_Sucursales.First();
                    //sucursal_ID = _sucursal.Sucursal_ID;

                    using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var rol = from _select in dbContext.Apl_Roles
                              //join _rol in dbContext.Apl_Rel_Usuarios_Roles on _select.Rol_ID equals _rol.Usuario_ID
                             
                              where _select.Empresa_ID.Equals(empresa)
                              select new { _select.Rol_ID, _select.Nombre };
                    Json_Resultado = JsonMapper.ToJson(rol.ToList());
                }

             }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color: #FF0004;'></i>&nbsp;Technical report: " + Ex.Message;
            }
            return Json_Resultado;
        }



        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Usuarios_Por_Filtros_Ayudante(string json_object)
        {
            Cls_Usuarios_Negocio obj_usuario = null;
            Cls_Mensaje mensaje = new Cls_Mensaje();
            string json_resultado= string.Empty;
            List<Cls_Usuarios_Negocio> lista_usuarios= new List<Cls_Usuarios_Negocio>();

            

            try
            {
                obj_usuario = JsonMapper.ToObject<Cls_Usuarios_Negocio>(json_object);
               

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    var _usuarios = (from _select in dbContext.Apl_Usuarios
                                     join _rol in dbContext.Apl_Rel_Usuarios_Roles on _select.Usuario_ID equals _rol.Usuario_ID
                                     
                                     where ((obj_usuario.Estatus_ID == 0) || (_select.Estatus_ID == obj_usuario.Estatus_ID))
                                     && ((obj_usuario.Usuario == "") || (_select.Usuario == obj_usuario.Usuario))

                                     select new Cls_Usuarios_Negocio
                                     {
                                         Usuario_ID = _select.Usuario_ID,
                                         Empresa_ID = _select.Empresa_ID,
                                         Tipo_Usuario_ID = _select.Tipo_Usuario_ID,
                                         Estatus_ID = _select.Estatus_ID,
                                         Usuario = _select.Usuario,
                                         Password = _select.Password,
                                         Email = _select.Email,
                                         Rol_ID = _rol.Rol_ID,
                                         Rel_Usuarios_Rol_ID = _rol.Rel_Usuario_Rol_ID,
                                         Usuario_login = _select.Usuario_login

                                     }).OrderByDescending(u => u.Usuario_ID);

                    foreach (var p in _usuarios)
                        lista_usuarios.Add((Cls_Usuarios_Negocio)p);

                    json_resultado = JsonMapper.ToJson(lista_usuarios);
                }
            }
            catch (Exception Ex)
            {
                mensaje.Estatus = "error";
                mensaje.Mensaje = "<i class='fa fa-times' style='color: #FF0004;'></i>&nbsp;Technical report: " + Ex.Message;
            }
            return json_resultado;
        }

        #endregion
    }

}

