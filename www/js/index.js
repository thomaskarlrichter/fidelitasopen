var serveradress = "http://nfcserver-hrd.appspot.com";
//var serveradress = "http://192.168.78.31:10083";
window.requestFileSystem = window.requestFileSystem ||
                           window.webkitRequestFileSystem;
function DateFmt(fstr) {
    this.formatString = fstr;

    var zeroPad = function (number) {
        return ("0" + number).substr(-2, 2);
    }

    var dateMarkers = {
        d: ['getDate', function (v) {
            return zeroPad(v)
        }],
        m: ['getMonth', function (v) {
            return zeroPad(v + 1)
        }],
        y: ['getFullYear'],
        H: ['getHours', function (v) {
            return zeroPad(v)
        }],
        M: ['getMinutes', function (v) {
            return zeroPad(v)
        }],
        S: ['getSeconds', function (v) {
            return zeroPad(v)
        }],
        i: ['toISOString']
    };

    this.format = function (date) {
        var dateTxt = this.formatString.replace(/%(.)/g, function (m, p) {
            var rv = date[(dateMarkers[p])[0]]()

            if (dateMarkers[p][1] != null) rv = dateMarkers[p][1](rv)

            return rv

        });

        return dateTxt
    }
}

function convert_date_str(str) {
    return str.replace(/_/g, ' ').replace(/\./g, ':');
}
var fmt = new DateFmt("%y-%m-%d %H:%M:%S");
var fmt_datname = new DateFmt("%y-%m-%d_%H.%M.%S");

var fidelitas = angular.module("fidelitas", []);

fidelitas.factory('cordovaReady', function () {
    // http://androiddev.orkitra.com/?p=11228
    return function (fn) {

        var queue = [];

        var impl = function () {
            queue.push(Array.prototype.slice.call(arguments));
        };

        document.addEventListener('deviceready', function () {
            queue.forEach(function (args) {
                fn.apply(this, args);
            });
            impl = fn;
        }, false);
        return function () {
            return impl.apply(this, arguments);
        };
    };
});

fidelitas.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
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
fidelitas.factory('config', function() {
    "use strict";
    return {
        working: false,
        ma_nr: "00000",
        serveradress: "http://nfcserver-hrd.appspot.com",
        phone: "12345"
    };

});
fidelitas.factory('tagreader', function ($rootScope, $window, config, cordovaReady, $http) {
    var tagreader = {
        config: config,
        getNfc: cordovaReady(function (onSuccess, onError) {
                nfc.addNdefListener(
                    function (nfcEvent) {
                        console.log("Event kommt rein!!!!!");
                        var type, number, postdata;
                        var tag = nfcEvent.tag,
                            ndefMessage = tag.ndefMessage;
                        if (nfc.bytesToString(ndefMessage[0].type) === 'tcg:1') {
                            type = nfc.bytesToString(ndefMessage[0].id);
                            number = nfc.bytesToString(ndefMessage[0].payload);
                            this.config.phone = "01771234567";
                            this.config.number = number;
                            this.config.ty = type;
                            if (type === "MA") {
                                if (this.config.ma_nr === "00000") {
                                    this.config.ma_nr = number;
                                    this.config.working = true;

                                } else {
                                    this.config.ma_nr = "00000";
                                    this.config.working = false;
                                }
                            }
                            //that.name = "fidelitas";
                            postdata = { "ty": type,
                                "ma": this.config.ma_nr,
                                "nu": this.config.number,
                                "ts": fmt.format(new Date()),
                                "ph": device.uuid

                            };
                            tagreader.saveTag(postdata);
                            $http({
                                method: 'POST',
                                url: this.config.serveradress + "/tag",
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                transformRequest: function (obj) {
                                    var str = [];
                                    for (var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                    return str.join("&");
                                },
                                data: postdata
                            }).success(function () {
                                    this.config.message = "POST success";
                                });
                        }
                    },
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
        }),
        deleteName: function (name) {
            console.warn("deleteName " + name + " not implemented yet " + this);
        },
        saveTag: function (data) {
            tagreader.datname = data.ty + "," +
                data.ma + "," +
                data.nu + "," +
                fmt_datname.format(new Date()) + "," +
                data.ph;
            console.log(tagreader.datname + " -> " + convert_date_str(tagreader.datname));
            window.requestFileSystem(1, 100000,
                function (fs) {
                    console.log(fs.name+" "+this);
                    fs.root.getDirectory('tags', {create: true}, null, tagreader.errorHandler);
                    fs.root.getFile('tags/' + tagreader.datname, {create: true}, null, tagreader.errorHandler);

                    /*fs.root.getFile("log.txt",
                     { create: true },
                     function (fileEntry) {

                     // Create a FileWriter object for our FileEntry (log.txt).
                     fileEntry.createWriter(function (fileWriter) {
                     console.log("in create writer");
                     fileWriter.onwrite = function (e) {
                     console.log('Write completed.');
                     };

                     fileWriter.onerror = function (e) {
                     console.log('Write failed: ' + e.toString());
                     };
                     fileWriter.seek(fileWriter.length);
                     fileWriter.write(tagreader.datname + "\n");
                     }, tagreader.errorHandler);

                     }, tagreader.errorHandler);
                     */
                },
                tagreader.errorHandler);

        },
        readAllTags: function () {

            window.requestFileSystem(1, 100000, function (fs) {
                    var myentries, myentry;
                    var dirsuccess = function (entry) {
                        myentry = entry;
                        var dirReader = entry.createReader();
                        dirReader.readEntries(entrysuccess, tagreader.errorHandler);
                    };
                    var entrysuccess = function (entries) {
                        myentries = entries;
                        console.log("anzahl der dateien " + entries.length+" "+ this);
                        var i;
                        for (i = 0; i < entries.length; i++) {
                            console.log(entries[i].name);
                        }
                        myentry.removeRecursively(null, null);
                    };

                    fs.root.getDirectory('tags', {create: true}, dirsuccess, tagreader.errorHandler);

                },
                tagreader.errorHandler
            );
        },
        errorHandler: function errorHandler(e) {
            var msg = '';

            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'QUOTA_EXCEEDED_ERR';
                    break;
                case FileError.NOT_FOUND_ERR:
                    msg = 'NOT_FOUND_ERR';
                    break;
                case FileError.SECURITY_ERR:
                    msg = 'SECURITY_ERR';
                    break;
                case FileError.INVALID_MODIFICATION_ERR:
                    msg = 'INVALID_MODIFICATION_ERR';
                    break;
                case FileError.INVALID_STATE_ERR:
                    msg = 'INVALID_STATE_ERR';
                    break;
                default:
                    msg = 'Unknown Error';
                    break;
            }
            console.error('FileError: ' + msg);
        },
        datname: "xx.txt",
        hallo: "Hallo"
    };
    return tagreader;
});

fidelitas.controller("WriterCtrl", function($scope, $location, tagreader){
    $scope.config = tagreader.config;
    $scope.writeTag = function () {

        if ($scope.number !== "") {
            var number5 = ("0000"+$scope.number.toString()).slice(-5);
            console.log(number5);
            $scope.number = number5;
            var ndefMessage = [
                                  ndef.record(ndef.TNF_EXTERNAL_TYPE,
                                              'tcg:1',
                                              $scope.tagType.toString().slice(0, 2),
                                              $scope.number)
                              ];
            nfc.write(ndefMessage,
                      function () {
                          $scope.textArea = "Tag written";
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
fidelitas.controller("ConfigCtrl", function($scope, $location, tagreader){
    $scope.config = tagreader.config;
    $scope.save = function(){
        // save to config.json
        console.log("TODO save to config.json")
        $location.path("/");

    }
});
fidelitas.controller("FidelitasCtrl", function ($scope, $rootScope, $window, $location, $timeout, tagreader, config) {
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
/*
 // TODO umwandeln in angularjs code
 // Update DOM on a Received Event
 receivedEvent: function (id) {
 var parentElement = document.getElementById(id);
 var listeningElement = parentElement.querySelector('.listening');
 var receivedElement = parentElement.querySelector('.received');

 listeningElement.setAttribute('style', 'display:none;');
 receivedElement.setAttribute('style', 'display:block;');

 console.log('Received Event: ' + id);
 }
 };*/