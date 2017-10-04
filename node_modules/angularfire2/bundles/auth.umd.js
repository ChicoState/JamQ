(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('firebase/auth'), require('@angular/core'), require('rxjs/Observable'), require('rxjs/operator/observeOn'), require('angularfire2')) :
    typeof define === 'function' && define.amd ? define(['exports', 'firebase/auth', '@angular/core', 'rxjs/Observable', 'rxjs/operator/observeOn', 'angularfire2'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.auth = global.angularfire2.auth || {}),global.firebase,global.ng.core,global.Rx,global.Rx.Observable.prototype,global.angularfire2));
}(this, (function (exports,firebase_auth,_angular_core,rxjs_Observable,rxjs_operator_observeOn,angularfire2) { 'use strict';

var AngularFireAuth = (function () {
    function AngularFireAuth(app) {
        this.app = app;
        this.authState = FirebaseAuthStateObservable(app);
        this.idToken = FirebaseIdTokenObservable(app);
        this.auth = app.auth();
    }
    AngularFireAuth.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFireAuth.ctorParameters = function () { return [
        { type: angularfire2.FirebaseApp, },
    ]; };
    return AngularFireAuth;
}());
function FirebaseAuthStateObservable(app) {
    var authState = rxjs_Observable.Observable.create(function (observer) {
        app.auth().onAuthStateChanged(function (user) { return observer.next(user); }, function (error) { return observer.error(error); }, function () { observer.complete(); return undefined; });
    });
    return rxjs_operator_observeOn.observeOn.call(authState, new angularfire2.ZoneScheduler(Zone.current));
}
function FirebaseIdTokenObservable(app) {
    var idToken = rxjs_Observable.Observable.create(function (observer) {
        app.auth().onIdTokenChanged(function (user) { return observer.next(user); }, function (error) { return observer.error(error); }, function () { observer.complete(); return undefined; });
    });
    return rxjs_operator_observeOn.observeOn.call(idToken, new angularfire2.ZoneScheduler(Zone.current));
}

function _getAngularFireAuth(app) {
    return new AngularFireAuth(app);
}
var AngularFireAuthProvider = {
    provide: AngularFireAuth,
    useFactory: _getAngularFireAuth,
    deps: [angularfire2.FirebaseApp]
};
var AUTH_PROVIDERS = [
    AngularFireAuthProvider,
];
var AngularFireAuthModule = (function () {
    function AngularFireAuthModule() {
    }
    AngularFireAuthModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [angularfire2.AngularFireModule],
                    providers: [AUTH_PROVIDERS]
                },] },
    ];
    AngularFireAuthModule.ctorParameters = function () { return []; };
    return AngularFireAuthModule;
}());

exports.AngularFireAuth = AngularFireAuth;
exports.FirebaseAuthStateObservable = FirebaseAuthStateObservable;
exports.FirebaseIdTokenObservable = FirebaseIdTokenObservable;
exports._getAngularFireAuth = _getAngularFireAuth;
exports.AngularFireAuthProvider = AngularFireAuthProvider;
exports.AUTH_PROVIDERS = AUTH_PROVIDERS;
exports.AngularFireAuthModule = AngularFireAuthModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
