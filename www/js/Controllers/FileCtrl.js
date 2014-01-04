fidelitas.controller("FileCtrl", function($scope, config, tagreader){
    "use strict";
    $scope.config = config;
    $scope.ergebnis = "HALLO";
    $scope.read = function(){
        $scope.ergebnis = "";
        console.warn("not implemented yet");
    };
    $scope.write = function() {
        tagreader.readAllTags();
        $scope.ergebnis = "HALLO";
        console.error("not implemented yet");
    };
});