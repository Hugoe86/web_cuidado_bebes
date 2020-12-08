var TrazabilidadModule = angular.module('TrazabilidadModule', [
    //'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'angular-growl',
    'ngFileUpload',
    'iso.directives',
    'ui.select',
    'ui.tree',
    'ui.bootstrap',
    'datetimepicker',
    'ui.select',
    'adaptv.adaptStrap',
    //'ui.bootstrap.datetimepicker'
]);

var IsNewEntity = undefined;
var Entity = undefined;
var ProveedorId = undefined;
var IsFromCatalog = undefined;
var TipoProductoParamObj = {
    Todo: 0,
    ProdTerSub: 1,
    ParteIngr: 2,
    SubParteIngr: 3,
};
var TipoProductoParam = TipoProductoParamObj.Todo;

TrazabilidadModule.config([
	'datetimepickerProvider',
	function (datetimepickerProvider) {
		datetimepickerProvider.setOptions({
			locale: 'es'
		});
	}
]);

TrazabilidadModule.directive("contenteditable", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});

TrazabilidadModule.directive('compileTemplate', function ($compile, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function () {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
});

TrazabilidadModule.directive('preventEnterSubmit', function () {
    return function (scope, el, attrs) {
        el.bind('keydown', function (event) {
            if (13 == event.which) {
                event.preventDefault(); // Doesn't work at all
                //window.stop(); // Works in all browsers but IE...
                document.execCommand('Stop'); // Works in IE
                return false; // Don't even know why it's here. Does nothing.
            }
        });
    };
});

TrazabilidadModule.directive('numericOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                var transformedInput = inputValue ? inputValue.replace(/[^\d.]/g, '') : null;

                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});

TrazabilidadModule.directive('numericOnlyNotNull', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                var transformedInput = inputValue.length > 0 ? inputValue.replace(/[^\d.]/g, '') : '';

                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});

TrazabilidadModule.directive('ngMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var minValidator = function (value) {
                var min = scope.$eval(attr.ngMin) || 0;
                if (!isEmpty(value) && parseFloat(value) <= min) {
                    ctrl.$setValidity('ngMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMin', true);
                    return value;
                }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

TrazabilidadModule.directive('ngMinControlStock', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMinControlStock, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var minValidator = function (value) {
                var min = scope.$eval(attr.ngMinControlStock) || 0;
                if (!isEmpty(value) && parseFloat(value) < min) {
                    ctrl.$setValidity('ngMinControlStock', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMinControlStock', true);
                    return value;
                }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

TrazabilidadModule.directive('ngMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function (value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && parseFloat(value) >= max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});

function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

TrazabilidadModule.directive('productoModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/ProductoModal.html',
    };
});

TrazabilidadModule.directive('proveedorModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/ProveedorModal.html',
    };
});

TrazabilidadModule.directive('clienteModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/ClienteModal.html',
    };
});

TrazabilidadModule.directive('detalleProductoModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/DetalleProductoModal.html',
    };
});

TrazabilidadModule.directive('mensajeModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/MensajeModal.html',
    };
});

TrazabilidadModule.directive('loadingModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/LoadingModal.html',
    };
});

TrazabilidadModule.directive('transaccionModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/TransaccionModal.html',
    };
});

TrazabilidadModule.directive('puntoReordenModal', function () {
    return {
        templateUrl: UrlApp + '/Paginas/Modal/PuntoReordenModal.html',
    };
});