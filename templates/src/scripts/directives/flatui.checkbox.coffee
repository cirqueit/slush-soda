do ->
    angular.module('flatuiApp.directives').directive("flatuiCheckbox", () ->
        return {
            restrict: "AE"
            templateUrl: "views/flatui-checkbox-template.html"
            replace: true
            scope: {
                model: "="
                label: "="
                value: "="
                required: "="
                name: "="
                disabled: "@"
            }
            compile: (element, attrs) ->
                if attrs.disabled is undefined then attrs.disabled = false else attrs.disabled = true
        }
    )
