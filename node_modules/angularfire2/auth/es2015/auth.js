import 'firebase/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operator/observeOn';
import { FirebaseApp, ZoneScheduler } from 'angularfire2';
export class AngularFireAuth {
    constructor(app) {
        this.app = app;
        this.authState = FirebaseAuthStateObservable(app);
        this.idToken = FirebaseIdTokenObservable(app);
        this.auth = app.auth();
    }
}
AngularFireAuth.decorators = [
    { type: Injectable },
];
AngularFireAuth.ctorParameters = () => [
    { type: FirebaseApp, },
];
export function FirebaseAuthStateObservable(app) {
    const authState = Observable.create((observer) => {
        app.auth().onAuthStateChanged((user) => observer.next(user), (error) => observer.error(error), () => { observer.complete(); return undefined; });
    });
    return observeOn.call(authState, new ZoneScheduler(Zone.current));
}
export function FirebaseIdTokenObservable(app) {
    const idToken = Observable.create((observer) => {
        app.auth().onIdTokenChanged((user) => observer.next(user), (error) => observer.error(error), () => { observer.complete(); return undefined; });
    });
    return observeOn.call(idToken, new ZoneScheduler(Zone.current));
}
//# sourceMappingURL=auth.js.map