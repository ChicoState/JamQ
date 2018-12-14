(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('firebase/app')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'firebase/app'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}),global.ng.core,global.firebase));
}(this, (function (exports,_angular_core,firebase) { 'use strict';

var FirebaseAppConfigToken = new _angular_core.InjectionToken('FirebaseAppConfigToken');
var FirebaseApp = (function () {
    function FirebaseApp() {
    }
    return FirebaseApp;
}());
function _firebaseAppFactory(config, appName) {
    try {
        if (appName) {
            return firebase.initializeApp(config, appName);
        }
        else {
            return firebase.initializeApp(config);
        }
    }
    catch (e) {
        return firebase.app(null);
    }
}

var FirebaseAppName = new _angular_core.InjectionToken('FirebaseAppName');
var FirebaseAppProvider = {
    provide: FirebaseApp,
    useFactory: _firebaseAppFactory,
    deps: [FirebaseAppConfigToken, FirebaseAppName]
};
var AngularFireModule = (function () {
    function AngularFireModule() {
    }
    AngularFireModule.initializeApp = function (config, appName) {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: FirebaseAppConfigToken, useValue: config },
                { provide: FirebaseAppName, useValue: appName }
            ]
        };
    };
    return AngularFireModule;
}());
AngularFireModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                providers: [FirebaseAppProvider],
            },] },
];
AngularFireModule.ctorParameters = function () { return []; };

exports.FirebaseAppProvider = FirebaseAppProvider;
exports.AngularFireModule = AngularFireModule;
exports.FirebaseApp = FirebaseApp;
exports.FirebaseAppName = FirebaseAppName;
exports.FirebaseAppConfigToken = FirebaseAppConfigToken;

Object.defineProperty(exports, '__esModule', { value: true });

})));
