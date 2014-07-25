do ->
    angular.module('flatuiApp.directives').directive('flatuiSwitch', () ->
        return {
            restrict: 'AE'
            templateUrl: "views/flatui-switch-template.html"
            replace: true
            scope: {
            model: '=',
            disabled: '@',
            square: '@',
            onLabel: '@',
            offLabel: '@',
            }
            compile: (element, attrs) ->
                if attrs.onLabel is undefined then attrs.onLabel = 'ON'
                if attrs.offLabel is undefined then attrs.offLabel = 'OFF'
                if attrs.disabled is undefined then attrs.disabled = false else attrs.disabled = true
                if attrs.square is undefined then attrs.square = false else attrs.square = true
        }
    )
