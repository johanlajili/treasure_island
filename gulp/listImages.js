"use strict";
var through = require('through2');
var glob = require('glob');

module.exports = function (file) {
    return through(function (buf, enc, next) {
    	var that = this;
        glob("../src/assets/images/*", {}, function(er, files){
        	files = files.map(function(fileName){
        		return fileName;//.replace("./game/", "");
        	});
        	that.push(buf.toString('utf8').replace(/\$ASSETS/g, files.toString()));
            next();
        });
        
    });
};