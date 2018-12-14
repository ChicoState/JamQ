import * as firebase from 'firebase/app';
import * as utils from '../utils';
import 'firebase/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { FirebaseApp } from '../app/index';
var AngularFireAuth = (function () {
    function AngularFireAuth(app) {
        this.app = app;
        this.authState = FirebaseAuthStateObservable(app);
        this.auth = app.auth();
    }
    return AngularFireAuth;
}());
export { AngularFireAuth };
AngularFireAuth.decorators = [
    { type: Injectable },
];
AngularFireAuth.ctorParameters = function () { return [
    { type: FirebaseApp, },
]; };
export function FirebaseAuthStateObservable(app) {
    var authState = Observable.create(function (observer) {
        firebase.auth().onAuthStateChanged(function (user) { return observer.next(user); }, function (error) { return observer.error(error); }, function () { return observer.complete(); });
    });
    return observeOn.call(authState, new utils.ZoneScheduler(Zone.current));
}
//# sourceMappingURL=auth.js.map