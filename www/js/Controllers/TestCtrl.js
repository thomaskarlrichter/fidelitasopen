/**
 * ConfigCtrl
 */
fidelitas.controller("TestCtrl", function($scope, $http){
    $scope.click = function(){
        var postdata = {
            "nr": $scope.nr,
            "ty": $scope.ty,
            "time": $scope.time
        };
        $http({
            method: 'POST',
            url: "http://nfcserver-hrd.appspot.com/tag",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: postdata
         // TODO hier function umwickeln
        }).success(function (data, status) {
                $scope.message = status;
        }).error(function() {
                $scope.message = "POST error";
        });
    };
});