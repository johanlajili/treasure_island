"use strict";

function Preloader() {
    this.assetsToPreload = [];
}

Preloader.prototype.addImagesToPreload = function(id) {
    if (Array.isArray(arguments[0])) {
        arguments[0].forEach((id) => {
            this.addImagesToPreload(id);
        });
    } else {
        var image = new Image();
        image.src = id;
        this.assetsToPreload.push(image);
    }
};
Preloader.prototype.addAudioToPreload = function(id) {
    if (Array.isArray(arguments[0])) {
        arguments[0].forEach((id) => {
            this.addAudioToPreload(id);
        });
    } else {
        var audio = new Audio();
        audio.src = id;
        this.assetsToPreload.push(audio);
    }
};
Preloader.prototype.onLoading = function(callback) {
    let numberOfAssets = 0;
    let numberOfLoadedAssets = 0;
    this.assetsToPreload.forEach(function(assetToPreload) {
        if (assetToPreload.completed) {
            return;
        }
        numberOfAssets++;
        if (assetToPreload instanceof Image) {
            assetToPreload.onload = function() {
                numberOfLoadedAssets++;
                callback(numberOfLoadedAssets + 1, numberOfAssets);
            };
        } else if (assetToPreload instanceof Audio) {
            assetToPreload.oncanplaythrough = function() {
                numberOfLoadedAssets++;
                callback(numberOfLoadedAssets + 1, numberOfAssets);
            };
        }
    });
    if (!numberOfAssets) {
        callback();
    }
};

module.exports = new Preloader();
