import { FirebaseAppConfigToken, FirebaseApp } from './app/index';
import { FirebaseAppConfig } from './interfaces';
import { InjectionToken } from '@angular/core';
declare const FirebaseAppName: InjectionToken<string>;
export declare const FirebaseAppProvider: {
    provide: typeof FirebaseApp;
    useFactory: (config: FirebaseAppConfig, appName?: string) => FirebaseApp;
    deps: InjectionToken<FirebaseAppConfig>[];
};
export declare class AngularFireModule {
    static initializeApp(config: FirebaseAppConfig, appName?: string): {
        ngModule: typeof AngularFireModule;
        providers: ({
            provide: InjectionToken<FirebaseAppConfig>;
            useValue: FirebaseAppConfig;
        } | {
            provide: InjectionToken<string>;
            useValue: string;
        })[];
    };
}
export { FirebaseApp, FirebaseAppName, FirebaseAppConfigToken, FirebaseAppConfig };
