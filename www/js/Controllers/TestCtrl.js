
fidelitas.controller("TestCtrl", function($scope, $http){
    $scope.nr = "Bla";
    $scope.ty = "Type";
    $scope.time = "12.23.23";
    $scope.click = function($scope, $http){
        var postdata = {
            "nr": $scope.nr,
            "ty": $scope.ty,
            "time": $scope.time
        };
        
        $http({
            method: 'POST',
            url: "https://nfcserver-hrd.appspot.com/tag",
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
                $scope.message = data+" : "+status;
        }).error(function() {
                $scope.message = "POST error";
        });
    };
});