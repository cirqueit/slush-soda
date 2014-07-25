do ->
    angular.module('flatuiApp.directives').directive("flatuiRadio", () ->
        return {
            restrict: "AE"
            templateUrl: "views/flatui-radio-template.html"
            replace: true
            scope: {
                model: "="
                label: "="
                value: "="
                required: "="
                name: "="
                disabled: '@'
            }
            compile: (element, attrs) ->
                if attrs.disabled is undefined then attrs.disabled = false else attrs.disabled = true
        }
    )
