fidelitas.controller("FidelitasCtrl", function ($scope, $rootScope, 
                                                $window, $location, 
                                                $timeout, tagreader, config) {
    $scope.config = config;
    tagreader.getNfc(function () {
                        $scope.config.ty = "SU";
                    },
                    function () {
                        $scope.config.ty = "ER";
                    });
    $scope.onTimeout = function() {
        var date = new Date();
        $scope.time = date.getHours()+":"+("0"+date.getMinutes()).slice(-2)+":"+("0"+date.getSeconds()).slice(-2);
        $timeout($scope.onTimeout, 1000);
    };
    var mytimeaout = $timeout($scope.onTimeout, 0);

    $scope.shouldWork = function () {
        return $scope.config.working;
    };
    $scope.klick = function () {
        $scope.config.working = !$scope.config.working;
    };
    $scope.showConfig = function () {
        $location.path("/config");
    };
    $scope.showWriter = function (){
        $location.path("/writer");
    };
    $scope.leseFile = function () {
        tagreader.readAllTags();
    };
});
