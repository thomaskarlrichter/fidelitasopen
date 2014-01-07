/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // Read NDEF formatted NFC Tags
        nfc.addNdefListener (
            function (nfcEvent) {
                var tag = nfcEvent.tag,
                    ndefMessage = tag.ndefMessage;
                var type, number;
                if (nfc.bytesToString(ndefMessage[0].type) === 'tcg:1') {
                            this.datestring = ""+new Date().gettime();
                            type = nfc.bytesToString(ndefMessage[0].id);
                            number = nfc.bytesToString(ndefMessage[0].payload);
                            this.datestring += "." + number + "." + type;
                            // TODO  + Telefonnummer
                }
                $.ajax({
                    type: "POST",
                    url: "http://nfcserver-hrd.appspot.com/tag",
                    data: this.datestring,
                    success: null,
                    dataType: "string"
                });
                
            }, 
            function () { // success callback
                console.log("NDEF-TagvReader initialized");
            },
            function (error) { // error callback
                console.log("Error adding NDEF listener " + JSON.stringify(error));
            }
        );
    },    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        angular.bootstrap(document, ["fidelitas"]);
    },
    datestring: "",
    gotFS: function(fileSystem) {
        fileSystem.root.getFile(this.datestring, {create: true, exclusive: false}, null, fail);
        alert("file "+this.datestring+" written!");
    },
};