fidelitas.controller("FidelitasCtrl", function ($scope, $rootScope, 
                                                $window, $location, 
                                                $timeout, config) {
    $scope.config = config;
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
        $scope.config.working = !$scope.config.working;
        $location.path("/config");
    };
    $scope.showWriter = function (){
        $scope.config.working = !$scope.config.working;
        $location.path("/writer");
    };
    $scope.leseFile = function () {
        $scope.config.working = !$scope.config.working;
        // TODO refactor tagreader.readAllTags();
    };
});
