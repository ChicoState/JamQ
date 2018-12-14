import 'firebase/database';
import { Injectable } from '@angular/core';
import { FirebaseApp } from '../angularfire2';
import { FirebaseListFactory } from './firebase_list_factory';
import { FirebaseObjectFactory } from './firebase_object_factory';
import * as utils from '../utils';
var AngularFireDatabase = (function () {
    function AngularFireDatabase(app) {
        this.app = app;
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, opts) {
        var ref = utils.getRef(this.app, pathOrRef);
        return FirebaseListFactory(utils.getRef(this.app, ref), opts);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef, opts) {
        var _this = this;
        return utils.checkForUrlOrFirebaseRef(pathOrRef, {
            isUrl: function () { return FirebaseObjectFactory(_this.app.database().ref(pathOrRef), opts); },
            isRef: function () { return FirebaseObjectFactory(pathOrRef); }
        });
    };
    return AngularFireDatabase;
}());
export { AngularFireDatabase };
AngularFireDatabase.decorators = [
    { type: Injectable },
];
AngularFireDatabase.ctorParameters = function () { return [
    { type: FirebaseApp, },
]; };
//# sourceMappingURL=database.js.map