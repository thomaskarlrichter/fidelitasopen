var fidelitas = angular.module("fidelitas", []);

fidelitas.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/test.tmpl.html',
        controller: 'TestCtrl'
      }).
      when('/fidelitas', {
        templateUrl: 'partials/tag.tmpl.html',
        controller: 'FidelitasCtrl'
      }).
      when('/file', {
            templateUrl: 'partials/file.tmpl.html',
            controller: 'FileCtrl'
        }).
      when('/config', {
        templateUrl: 'partials/config.tmpl.html',
        controller: 'ConfigCtrl'
      }).
      when('/writer', {
        templateUrl: 'partials/writer.tmpl.html',
        controller: 'WriterCtrl'
      });
}]);

fidelitas.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
fidelitas.config(function(cordovaReady, config, $rootScope){
    $rootScope.config = config;
    cordovaReady(function (onSuccess, onError) {
                nfc.addNdefListener(
                    function (nfcEvent) {
                        //var tsr = fmt.format(new Date());
                        //alert("alert ");
                        // der alert führt zu einem refresh
                        var type, number, postdata;
                        var tag = nfcEvent.tag,
                            ndefMessage = tag.ndefMessage;
                        if (nfc.bytesToString(ndefMessage[0].type) === 'tcg:1') {
                            type = nfc.bytesToString(ndefMessage[0].id);
                            if (type === "XX") {
                                $location.path("/config");
                            } else {
                                number = nfc.bytesToString(ndefMessage[0].payload);
                                postdata = { 
                                    "ty": type,
                                    "ma": config.ma_nr,
                                    "nu": number,
                                    "ts": "1234", //fmt.format(new Date()),
                                    "ph": config.phone
                                };
                                config.message = "nach alert";
                                config.number = number;
                                config.ty = type;
                                if (type === "PV") {
                                    if (config.ma_nr === "00000") {
                                        config.ma_nr = number;
                                        config.working = true;
    
                                    } else {
                                        config.ma_nr = "00000";
                                        config.working = false;
                                    }
                                }
                                //that.name = "fidelitas";
                                config.message = "waiting...";
                                //tagreader.saveTag(postdata);
                                
                                $http({
                                    method: 'POST',
                                    url: config.serveradress + "/tag",
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
                                        config.message = status;
                                }).error(function() {
                                        config.message = "POST error";
                                });
                            }
                        }
                    },
                    // TODO ???
                    function () {
                        var that = this,
                            args = arguments;

                        if (onSuccess) {
                            $rootScope.digest();
                            $rootScope.$apply(function () {
                                onSuccess.apply(that, args);
                            });
                        }
                    },
                    function () {
                        var that = this,
                            args = arguments;

                        if (onError) {
                            $rootScope.digest();
                            $rootScope.$apply(function () {
                                onError.apply(that, args);
                            });
                        }
                    }
                );
        })
});
