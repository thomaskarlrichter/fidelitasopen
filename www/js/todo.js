/**
 * Created by thomasrichter on 14.10.13.
 */


console.log("######### todo loaded");

//var serveradress = "http://192.168.78.31:10083";
window.requestFileSystem = window.requestFileSystem ||
                           window.webkitRequestFileSystem;
                           
// TODO refactor into service/factory
function DateFmt(fstr) {
    this.formatString = fstr;

    var zeroPad = function (number) {
        return ("0" + number).substr(-2, 2);
    };

    var dateMarkers = {
        d: ['getDate', function (v) {
            return zeroPad(v);
        }],
        m: ['getMonth', function (v) {
            return zeroPad(v + 1);
        }],
        y: ['getFullYear'],
        H: ['getHours', function (v) {
            return zeroPad(v);
        }],
        M: ['getMinutes', function (v) {
            return zeroPad(v);
        }],
        S: ['getSeconds', function (v) {
            return zeroPad(v);
        }],
        i: ['toISOString']
    };

    this.format = function (date) {
        var dateTxt = this.formatString.replace(/%(.)/g, function (m, p) {
            var rv = date[(dateMarkers[p])[0]]();

            if (dateMarkers[p][1] !== null) 
                rv = dateMarkers[p][1](rv);

            return rv;

        });

        return dateTxt;
    };
}

function convert_date_str(str) {
    return str.replace(/_/g, ' ').replace(/\./g, ':');
}
var fmt = new DateFmt("%y-%m-%d %H:%M:%S");
var fmt_datname = new DateFmt("%y-%m-%d_%H.%M.%S");


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

fidelitas.factory('config', function() {
    "use strict";
    return {
        working: false,
        ma_nr: "00000",
        serveradress: "http://nfcserver-hrd.appspot.com",
        phone: "12345"
    };

});

/**
 * Factory tagreader
 * TODO refactoring
 */
fidelitas.factory('tagreader', function ($rootScope, $location, $window, config, cordovaReady, $http) {
    // TODO factoring ziel für fmt

    var tagreader = {
        config: config,
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
                // TODO  erste function
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

            window.requestFileSystem(1, 100000, 
                // TODO hier function umwickeln
                function (fs) {
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









/*
 // Update DOM on a Received Event
 receivedEvent: function (id) {
     var parentElement = document.getElementById(id);
     var listeningElement = parentElement.querySelector('.listening');
     var receivedElement = parentElement.querySelector('.received');
    
     listeningElement.setAttribute('style', 'display:none;');
     receivedElement.setAttribute('style', 'display:block;');
    
     console.log('Received Event: ' + id);
 }

 */