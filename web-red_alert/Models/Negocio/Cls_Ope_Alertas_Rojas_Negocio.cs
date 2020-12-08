using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace web_red_alert.Models.Negocio
{
    public class Cls_Ope_Alertas_Rojas_Negocio
    {
        public int No_Alerta_Roja { get; set; }
        public int? Numero_Parte_ID { get; set; }
        public int Empresa_ID { get; set; }
        public int Estatus_ID { get; set; }
        public int Planta_ID { get; set; }
        public int Unidad_Negocio_ID { get; set; }
        public int? Producto_ID { get; set; }
        public string Numero_Parte { get; set; }
        public int? Cliente_ID { get; set; }
        public string Referencia_Producto { get; set; }
        public string Sitio_Cliente { get; set; }
        public string Vehiculo { get; set; }
        public int Area_ID { get; set; }
        public int Turno_ID { get; set; }
        public string Numero_CAR { get; set; }
        public string Criterios { get; set; }
        public string Datos_Detalles_Comentarios { get; set; }
        public string Procesos_Criterios { get; set; }
        public string Descripcion_1 { get; set; }
        public string Descripcion_2 { get; set; }
        public string Descripcion_3 { get; set; }
        public string Descripcion_4 { get; set; }
        public string Descripcion_5 { get; set; }
        public string Descripcion_6 { get; set; }
        public string Descripcion_7 { get; set; }
        public string Condicion_Buena { get; set; }
        public string Condicion_Mala { get; set; }
        public int? Estatus_Partes_1 { get; set; }
        public int? Estatus_Partes_2 { get; set; }
        public int? Estatus_Partes_3 { get; set; }
        public int? Estatus_Partes_4 { get; set; }
        public string Estatus_Descripcion { get; set; }
        public string Estatus_Condicion_1 { get; set; }
        public string Estatus_Condicion_2 { get; set; }
        public string Estatus_Condicion_3 { get; set; }
        public string Director_Responsable { get; set; }
        public string Condicion_Gestion_1 { get; set; }
        public string Condicion_Gestion_2 { get; set; }
        public string Condicion_Gestion_3 { get; set; }
        public string Condicion_Gestion_4 { get; set; }
        public string Condicion_Gestion_5 { get; set; }
        public string Condicion_Gestion_6 { get; set; }
        public string Usuario_Creo { get; set; }
        public DateTime Fecha_Creo { get; set; }
        public DateTime Fecha_Creo1 { get; set; }
        public string Usuario_Modifico { get; set; }
        public string Fecha_Modifico { get; set; }
        public string Estatus { get; set; }
        public string Planta { get; set; }
        public string Unidad_Negocio { get; set; }
        public string Producto { get; set; }
        public string Cliente { get; set; }
        public string Area { get; set; }
        public string Turno { get; set; }
        public string Aprobado { get; set; }
        public string Observaciones { get; set; }
        public string No_Empleado { get; set; }
        public byte[] Imagen_Condicion_Buena { get; set; }
        public byte[] Imagen_Condicion_Mala { get; set; }
    }
}