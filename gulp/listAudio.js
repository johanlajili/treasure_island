"use strict";
var through = require('through2');
var glob = require('glob');

module.exports = function (file) {
    return through(function (buf, enc, next) {
        var that = this;
        glob("./src/assets/audio/*", {}, function(er, files){
        	files = files.map(function(fileName){
        		return fileName.replace("./src/", "resources/");
        	});
        	that.push(buf.toString('utf8').replace(/\$AUDIO/g, files.toString()));
            next();
        });
        
    });
};