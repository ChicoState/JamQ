import 'firebase/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { FirebaseApp, ZoneScheduler } from 'angularfire2';
var AngularFireAuth = (function () {
    function AngularFireAuth(app) {
        this.app = app;
        this.authState = FirebaseAuthStateObservable(app);
        this.idToken = FirebaseIdTokenObservable(app);
        this.auth = app.auth();
    }
    AngularFireAuth.decorators = [
        { type: Injectable },
    ];
    AngularFireAuth.ctorParameters = function () { return [
        { type: FirebaseApp, },
    ]; };
    return AngularFireAuth;
}());
export { AngularFireAuth };
export function FirebaseAuthStateObservable(app) {
    var authState = Observable.create(function (observer) {
        app.auth().onAuthStateChanged(function (user) { return observer.next(user); }, function (error) { return observer.error(error); }, function () { observer.complete(); return undefined; });
    });
    return observeOn.call(authState, new ZoneScheduler(Zone.current));
}
export function FirebaseIdTokenObservable(app) {
    var idToken = Observable.create(function (observer) {
        app.auth().onIdTokenChanged(function (user) { return observer.next(user); }, function (error) { return observer.error(error); }, function () { observer.complete(); return undefined; });
    });
    return observeOn.call(idToken, new ZoneScheduler(Zone.current));
}
//# sourceMappingURL=auth.js.map