using datos_cambios_procesos;
using LitJson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using web_cambios_procesos.Models.Ayudante;
using web_cambios_procesos.Models.Negocio;

namespace web_cambios_procesos.Paginas.Operacion.controllers
{
    /// <summary>
    /// Descripción breve de Ope_Autorizacion_Alertas_Controller
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
   [System.Web.Script.Services.ScriptService]
    public class Ope_Autorizacion_Alertas_Controller : System.Web.Services.WebService
    {
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Alertas_Rojas(string jsonObject)
        {
            Cls_Ope_Alertas_Rojas_Negocio Obj_Alerta_Roja = null;
            string Json_Resultado = string.Empty;
            List<Cls_Ope_Alertas_Rojas_Negocio> Lista_alertas = new List<Cls_Ope_Alertas_Rojas_Negocio>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            try
            {
                Obj_Alerta_Roja = JsonMapper.ToObject<Cls_Ope_Alertas_Rojas_Negocio>(jsonObject);

                using (var dbContext = new AAM_Cambios_ProcesosEntities())
                {
                    int empresa_id = string.IsNullOrEmpty(Cls_Sesiones.Empresa_ID) ? -1 : Convert.ToInt32(Cls_Sesiones.Empresa_ID);

                    var Alertas = (from _alertas in dbContext.Ope_Alertas_Rojas
                                   join _estatus in dbContext.Apl_Estatus on _alertas.Estatus_ID equals _estatus.Estatus_ID
                                   join _plantas in dbContext.Apl_Plantas on new { _alertas.Planta_ID, _alertas.Empresa_ID } equals new { _plantas.Planta_ID, _plantas.Empresa_ID }
                                   join _unidad_negocio in dbContext.Cat_Unidades_Negocio on _alertas.Unidad_Negocio_ID equals _unidad_negocio.Unidad_Negocio_ID

                                   where _alertas.Empresa_ID.Equals(empresa_id) &&
                                   _estatus.Estatus != "ELIMINADO" && _estatus.Estatus!= "CANCELADO" &&
                                   (Obj_Alerta_Roja.No_Alerta_Roja != 0 ? _alertas.No_Alerta_Roja.Equals(Obj_Alerta_Roja.No_Alerta_Roja) : true) &&
                                   (!string.IsNullOrEmpty(Obj_Alerta_Roja.Numero_Parte) ? _alertas.Numero_Parte.ToLower().Contains(Obj_Alerta_Roja.Numero_Parte.ToLower()) : true) &&
                                   (!string.IsNullOrEmpty(Obj_Alerta_Roja.Numero_CAR) ? _alertas.Numero_CAR.ToLower().Contains(Obj_Alerta_Roja.Numero_CAR.ToLower()) : true) &&
                                   (Obj_Alerta_Roja.Estatus_ID != 0 ? _alertas.Estatus_ID.Equals(Obj_Alerta_Roja.Estatus_ID) : true)

                                   select new Cls_Ope_Alertas_Rojas_Negocio
                                   {
                                       No_Alerta_Roja = _alertas.No_Alerta_Roja,
                                       Empresa_ID = _alertas.Empresa_ID,
                                       Estatus = _estatus.Estatus,
                                       Estatus_ID = _alertas.Estatus_ID,
                                       Planta = _plantas.Nombre,
                                       Planta_ID = _alertas.Planta_ID,
                                       Unidad_Negocio = _unidad_negocio.Nombre,
                                       Unidad_Negocio_ID = _alertas.Unidad_Negocio_ID,
                                       Producto_ID = _alertas.Producto_ID,
                                       Numero_Parte=_alertas.Numero_Parte,
                                       Cliente_ID = _alertas.Cliente_ID,
                                       Referencia_Producto_ID = _alertas.Referencia_Producto_ID,
                                       Sitio_Cliente_ID = _alertas.Sitio_Cliente_ID,
                                       Vehiculo_ID = _alertas.Vehiculo_ID,
                                       Area_ID = _alertas.Area_ID,
                                       Turno_ID = _alertas.Turno_ID,
                                       

                                   }).OrderByDescending(u => u.No_Alerta_Roja);

                    foreach (var p in Alertas)
                        Lista_alertas.Add((Models.Negocio.Cls_Ope_Alertas_Rojas_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_alertas);
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color:#FF0004;'></i>&nbsp;Informe técnico: " + Ex.Message;
            }
            return Json_Resultado;
        }
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Una_Alerta_Roja(string jsonObject)
        {
            Cls_Ope_Alertas_Rojas_Negocio Obj_Alerta_Roja = null;
            string Json_Resultado = string.Empty;
            List<Cls_Ope_Alertas_Rojas_Negocio> Lista_alertas = new List<Cls_Ope_Alertas_Rojas_Negocio>();
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            try
            {
                Obj_Alerta_Roja = JsonMapper.ToObject<Cls_Ope_Alertas_Rojas_Negocio>(jsonObject);

                using (var dbContext = new AAM_Cambios_ProcesosEntities())
                {
                    string n_producto = Obj_Alerta_Roja.Producto_ID == null ? "" :
                        dbContext.Cat_Productos.Where(u => u.Producto_ID == Obj_Alerta_Roja.Producto_ID).Select(u => u.Nombre).First();
                    string n_cliente = Obj_Alerta_Roja.Cliente_ID == null ? "" :
                        dbContext.Cat_Clientes.Where(u => u.Cliente_ID == Obj_Alerta_Roja.Cliente_ID).Select(u => u.Nombre).First();
                    string n_referencia_producto = Obj_Alerta_Roja.Referencia_Producto_ID == null ? "" :
                        dbContext.Cat_Referencia_Productos.Where(u => u.Referencia_Producto_ID == Obj_Alerta_Roja.Referencia_Producto_ID).Select(u => u.Nombre).First();
                    string n_sitio_cliente = Obj_Alerta_Roja.Sitio_Cliente_ID == null ? "" :
                        dbContext.Cat_Sitios_Clientes.Where(u => u.Sitio_Cliente_ID == Obj_Alerta_Roja.Sitio_Cliente_ID).Select(u => u.Nombre).First();
                    string n_vehiculo = Obj_Alerta_Roja.Vehiculo_ID == null ? "" :
                        dbContext.Cat_Vehiculos.Where(u => u.Vehiculo_ID == Obj_Alerta_Roja.Vehiculo_ID).Select(u => u.Nombre).First();
                    string n_area = Obj_Alerta_Roja.Area_ID == 0 ? "" :
                        dbContext.Cat_Areas.Where(u => u.Area_ID == Obj_Alerta_Roja.Area_ID).Select(u => u.Nombre).First();
                    string n_turno = Obj_Alerta_Roja.Turno_ID == 0 ? "" :
                        dbContext.Cat_Turnos.Where(u => u.Turno_ID == Obj_Alerta_Roja.Turno_ID).Select(u => u.Nombre).First();

                    int empresa_id = string.IsNullOrEmpty(Cls_Sesiones.Empresa_ID) ? -1 : Convert.ToInt32(Cls_Sesiones.Empresa_ID);

                    var Alertas = (from _alertas in dbContext.Ope_Alertas_Rojas
                                   where _alertas.Empresa_ID.Equals(empresa_id) &&
                                   _alertas.No_Alerta_Roja.Equals(Obj_Alerta_Roja.No_Alerta_Roja)

                                   select new Cls_Ope_Alertas_Rojas_Negocio
                                   {
                                       No_Alerta_Roja = _alertas.No_Alerta_Roja,
                                       Producto = n_producto,
                                       Numero_Parte = _alertas.Numero_Parte,
                                       Cliente = n_cliente,
                                       Referencia_Producto = n_referencia_producto,
                                       Sitio_Cliente = n_sitio_cliente,
                                       Vehiculo = n_vehiculo,
                                       Area = n_area,
                                       Turno = n_turno,
                                       Numero_CAR = _alertas.Numero_CAR,
                                       Circunstancia_1 = _alertas.Circunstancia_1,
                                       Circunstancia_2 = _alertas.Circunstancia_2,
                                       Circunstancia_3 = _alertas.Circunstancia_3,
                                       Circunstancia_4 = _alertas.Circunstancia_4,
                                       Circunstancia_5 = _alertas.Circunstancia_5,
                                       Circunstancia_6 = _alertas.Circunstancia_6,
                                       Circunstancia_7 = _alertas.Circunstancia_7,
                                       Circunstancia_8 = _alertas.Circunstancia_8,
                                       Descripcion_1 = _alertas.Descripcion_1,
                                       Descripcion_2 = _alertas.Descripcion_2,
                                       Descripcion_3 = _alertas.Descripcion_3,
                                       Descripcion_4 = _alertas.Descripcion_4,
                                       Descripcion_5 = _alertas.Descripcion_5,
                                       Descripcion_6 = _alertas.Descripcion_6,
                                       Descripcion_7 = _alertas.Descripcion_7,
                                       Condicion_Buena = _alertas.Condicion_Buena,
                                       Condicion_Mala = _alertas.Condicion_Mala

                                   }).OrderByDescending(u => u.No_Alerta_Roja);
                    foreach (var p in Alertas)
                        Lista_alertas.Add((Cls_Ope_Alertas_Rojas_Negocio)p);

                    Json_Resultado = JsonMapper.ToJson(Lista_alertas);
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color:#FF0004;'></i>&nbsp;Informe técnico: " + Ex.Message;
            }
            return Json_Resultado;
        }
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Rechazar_Alerta_Roja(string jsonObject)
        {
            Cls_Ope_Alertas_Rojas_Negocio Obj_Alerta_Roja = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Rechazar alerta";
                Obj_Alerta_Roja = JsonMapper.ToObject<Cls_Ope_Alertas_Rojas_Negocio>(jsonObject);

                using (var dbContext = new AAM_Cambios_ProcesosEntities())
                {
                    var _estatus = dbContext.Apl_Estatus.Where(p => p.Estatus == "RECHAZADO").First();
                    var _alerta = dbContext.Ope_Alertas_Rojas.Where(u => u.No_Alerta_Roja.Equals(Obj_Alerta_Roja.No_Alerta_Roja)).First();

                    _alerta.Estatus_ID = _estatus.Estatus_ID;
                    _alerta.Usuario_Modifico = Cls_Sesiones.Usuario;
                    _alerta.Fecha_Modifico = new DateTime?(DateTime.Now);

                    dbContext.SaveChanges();

                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "<i class='fa fa-check'style = 'color: #00A41E;' ></ i > &nbsp; Red Alert updated." + " <br />";
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color:#FF0004;'></i>&nbsp;Informe técnico: " + Ex.Message;
            }
            finally { Json_Resultado = JsonMapper.ToJson(Mensaje); }
            return Json_Resultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Autorizar_Alerta_Roja(string jsonObject)
        {
            Cls_Ope_Alertas_Rojas_Negocio Obj_Alerta_Roja = null;
            string Json_Resultado = string.Empty;
            Cls_Mensaje Mensaje = new Cls_Mensaje();

            try
            {
                Mensaje.Titulo = "Autoririzar  alerta";
                Obj_Alerta_Roja = JsonMapper.ToObject<Cls_Ope_Alertas_Rojas_Negocio>(jsonObject);

                using (var dbContext = new AAM_Cambios_ProcesosEntities())
                {
                    var _estatus = dbContext.Apl_Estatus.Where(p => p.Estatus == "AUTORIZADO").First();
                    var _alerta = dbContext.Ope_Alertas_Rojas.Where(u => u.No_Alerta_Roja.Equals(Obj_Alerta_Roja.No_Alerta_Roja)).First();

                    _alerta.Estatus_ID = _estatus.Estatus_ID;
                    _alerta.Usuario_Modifico = Cls_Sesiones.Usuario;
                    _alerta.Fecha_Modifico = new DateTime?(DateTime.Now);

                    dbContext.SaveChanges();

                    Mensaje.Estatus = "success";
                    Mensaje.Mensaje = "<i class='fa fa-check'style = 'color: #00A41E;' ></ i > &nbsp; Red Alert updated." + " <br />";
                }
            }
            catch (Exception Ex)
            {
                Mensaje.Estatus = "error";
                Mensaje.Mensaje = "<i class='fa fa-times' style='color:#FF0004;'></i>&nbsp;Informe técnico: " + Ex.Message;
            }
            finally { Json_Resultado = JsonMapper.ToJson(Mensaje); }
            return Json_Resultado;
        }


    }
}
