import { InjectionToken } from '@angular/core';
import { FirebaseAppConfig } from '../interfaces';
import * as firebase from 'firebase/app';
export declare const FirebaseAppConfigToken: InjectionToken<FirebaseAppConfig>;
export declare class FirebaseApp implements firebase.app.App {
    name: string;
    options: {};
    auth: () => firebase.auth.Auth;
    database: () => firebase.database.Database;
    messaging: () => firebase.messaging.Messaging;
    storage: () => firebase.storage.Storage;
    delete: () => firebase.Promise<any>;
}
export declare function _firebaseAppFactory(config: FirebaseAppConfig, appName?: string): FirebaseApp;
