import { FirebaseAppConfigToken, FirebaseApp, _firebaseAppFactory } from './app/index';
import { InjectionToken, NgModule } from '@angular/core';
var FirebaseAppName = new InjectionToken('FirebaseAppName');
export var FirebaseAppProvider = {
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
export { AngularFireModule };
AngularFireModule.decorators = [
    { type: NgModule, args: [{
                providers: [FirebaseAppProvider],
            },] },
];
AngularFireModule.ctorParameters = function () { return []; };
export { FirebaseApp, FirebaseAppName, FirebaseAppConfigToken };
//# sourceMappingURL=angularfire2.js.map