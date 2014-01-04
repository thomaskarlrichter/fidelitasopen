/**
 * WriterCtrl
 */ 
fidelitas.controller("WriterCtrl", function($scope, $location, tagreader){
    $scope.config = tagreader.config;
    $scope.writeTag = function () {

        if ($scope.number !== "") {
            var number5 = ("0000"+$scope.number.toString()).slice(-5);
            console.log(number5);
            $scope.number = number5;
            // TODO alle nfc.-Aufrufe in service auslagern
            var ndefMessage = [
                                  ndef.record(ndef.TNF_EXTERNAL_TYPE,
                                              'tcg:1',
                                              $scope.tagType.toString().slice(0, 2),
                                              $scope.number)
                              ];
            nfc.write(ndefMessage,
                      function () {
                          $scope.textArea = "Tag written";
                          // TODO $rootScope.$apply() ???
                          $scope.$digest();
                      },
                      function (error) {
                          $scope.textArea = "Error: " + error;
                      });
        }

    };
    $scope.write = function() {
        console.log("TODO write tag");
        $location.path("/");

    };
    $scope.plus = function(){
        $scope.number += 1;
    }
});