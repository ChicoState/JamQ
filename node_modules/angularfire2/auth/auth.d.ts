import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
export declare type Auth = firebase.auth.Auth;
export declare class AngularFireAuth {
    app: FirebaseApp;
    auth: firebase.auth.Auth;
    authState: Observable<firebase.User>;
    idToken: Observable<firebase.User>;
    constructor(app: FirebaseApp);
}
export declare function FirebaseAuthStateObservable(app: FirebaseApp): Observable<firebase.User>;
export declare function FirebaseIdTokenObservable(app: FirebaseApp): Observable<firebase.User>;
