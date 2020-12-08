TrazabilidadModule.controller('TrazabilidadController', ['$scope', '$sce', '$rootScope',
function ($scope, $sce, $rootScope) {
    //#region Variables

    $scope.GenericModal = '';
    $rootScope.Mensaje = '';

    //#endregion

    //#region Functions

    $scope.InitController = function () {

    };

    //#endregion

    //#region Actions

    $scope.ProductoOpenModal = function (isNewEntity) {
        $scope.ProductoOpenModal(isNewEntity, null);
    };

    $scope.ProductoOpenModal = function (isNewEntity, entity) {
        $scope.ProductoOpenModal(isNewEntity, entity, 0);
    };

    $scope.ProductoOpenModal = function (isNewEntity, entity, proveedorId) {
        $scope.ProductoOpenModal(isNewEntity, entity, proveedorId, TipoProductoParamObj.Todo);
    };

    $scope.ProductoOpenModal = function (isNewEntity, entity, proveedorId, tipoProductoParam) {
        //$scope.GenericModal = $sce.trustAsHtml('<producto-modal></producto-modal>');
        var ProductoModal = angular.element(document.querySelector('#divProductoModal'));
        ProductoModal.modal('show', { backdrop: 'static', keyboard: false });
        var ProductoTitleModal = angular.element(document.querySelector('#ProductoTitleModal'));
        ProductoTitleModal.text('Nuevo Producto');
        IsNewEntity = isNewEntity;
        TipoProductoParam = tipoProductoParam;
        if (entity !== undefined && entity !== null) {
            Entity = entity;
            ProductoTitleModal.text('Editar Producto');
        }
        if (proveedorId !== undefined && proveedorId !== 0 && proveedorId > 0) {
            ProveedorId = proveedorId;
        }
        $rootScope.$emit('ProductoOpenModalEvent', null);
    };

    $scope.ProveedorOpenModal = function (isNewEntity) {
        $scope.ProveedorOpenModal(isNewEntity, null, true);
    };

    $scope.ProveedorOpenModal = function (isNewEntity, entity) {
        $scope.ProveedorOpenModal(isNewEntity, entity, true);
    };

    $scope.ProveedorOpenModal = function (isNewEntity, entity, isFromCatalog) {
        //$scope.GenericModal = $sce.trustAsHtml('<proveedor-modal></proveedor-modal>');
        var ProveedorModal = angular.element(document.querySelector('#divProveedorModal'));
        ProveedorModal.modal('show', { backdrop: 'static', keyboard: false });
        var ProveedorTitleModal = angular.element(document.querySelector('#ProveedorTitleModal'));
        ProveedorTitleModal.text('Nuevo Proveedor');
        IsNewEntity = isNewEntity;
        IsFromCatalog = isFromCatalog;
        if (entity !== undefined && entity !== null) {
            Entity = entity;
            ProveedorTitleModal.text('Editar Proveedor');
        }
        $rootScope.$emit('ProveedorOpenModalEvent', null);
    };

    $scope.ClienteOpenModal = function (isNewEntity) {
        $scope.ClienteOpenModal(isNewEntity, null, true);
    };

    $scope.ClienteOpenModal = function (isNewEntity, entity) {
        $scope.ClienteOpenModal(isNewEntity, entity, true);
    };

    $scope.ClienteOpenModal = function (isNewEntity, entity, isFromCatalog) {
        //$scope.GenericModal = $sce.trustAsHtml('<cliente-modal></cliente-modal>');
        var ClienteModal = angular.element(document.querySelector('#divClienteModal'));
        ClienteModal.modal('show', { backdrop: 'static', keyboard: false });
        var ClienteTitleModal = angular.element(document.querySelector('#ClienteTitleModal'));
        ClienteTitleModal.text('Nuevo Cliente');
        IsNewEntity = isNewEntity;
        IsFromCatalog = isFromCatalog;
        if (entity !== undefined && entity !== null) {
            Entity = entity;
            ClienteTitleModal.text('Editar Cliente');
        }
        $rootScope.$emit('ClienteOpenModalEvent', null);
    };

    $scope.DetalleProductoOpenModal = function (productoId) {
        var DetalleProductoModal = angular.element(document.querySelector('#divDetalleProductoModal'));
        DetalleProductoModal.modal('show', { backdrop: 'static', keyboard: false });
        var DetalleProductoTitleModal = angular.element(document.querySelector('#DetalleProductoTitleModal'));
        DetalleProductoTitleModal.text('Detalle producto');
        $rootScope.$emit('DetalleProductoOpenModalEvent', { ProductoId: productoId });
    };

    //#endregion

    //#region Angular Ready

    angular.element(document).ready(function () {
        $scope.InitController();
    });

    //#endregion
}]);