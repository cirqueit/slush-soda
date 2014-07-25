do ->
    angular.module('flatuiApp.controllers')
        .controller('FlatUICtrl', ['$scope', ($scope) ->
            $scope.checkbox1 = {}
            $scope.checkbox1.options = [ {"name": "check1", "id":1, "selected": true}, {"name": "check2", "id":2, "selected": false} ]

            $scope.radio1 = {}
            $scope.radio1.options = [ {"name": "radio1", "id":1}, {"name": "radio2", "id":2}, {"name": "radio3", "id":3}]
            $scope.radio1.selected = $scope.radio1.options[0].id

            $scope.switch1 = false
        ])
