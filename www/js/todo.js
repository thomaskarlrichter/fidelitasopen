/*jslint browser: true */
/**
 * Created by thomasrichter on 14.10.13.
 */


console.log("######### todo loaded");

var foo = {
    bar: function() {
        console.log(this);
        for (var i = 0, length = arguments.length; i<length; i++){
            console.log(arguments[i]);
        }

    }
}
var obj = {}
foo.bar.apply(foo,[3,2,1]);


