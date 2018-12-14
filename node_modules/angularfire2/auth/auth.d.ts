import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from '../app/index';
export declare class AngularFireAuth {
    app: FirebaseApp;
    auth: firebase.auth.Auth;
    authState: Observable<firebase.User>;
    constructor(app: FirebaseApp);
}
export declare function FirebaseAuthStateObservable(app: FirebaseApp): Observable<firebase.User>;
