/**
 * ConfigCtrl
 */
fidelitas.controller("ConfigCtrl", function($scope, $location, tagreader){
    $scope.config = tagreader.config;
    $scope.save = function(){
        // save to config.json
        console.log("TODO save to config.json")
        $location.path("/");

    }
});