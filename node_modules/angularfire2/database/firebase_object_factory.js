import { FirebaseObjectObservable } from './firebase_object_observable';
import { observeOn } from 'rxjs/operator/observeOn';
import * as firebase from 'firebase/app';
import 'firebase/database';
import * as utils from '../utils';
export function FirebaseObjectFactory(pathRef, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var ref;
    utils.checkForUrlOrFirebaseRef(pathRef, {
        isUrl: function () {
            var path = pathRef;
            if (utils.isAbsoluteUrl(path)) {
                ref = firebase.database().refFromURL(path);
            }
            else {
                ref = firebase.database().ref(path);
            }
        },
        isRef: function () { return ref = pathRef; }
    });
    var objectObservable = new FirebaseObjectObservable(function (obs) {
        var fn = ref.on('value', function (snapshot) {
            obs.next(preserveSnapshot ? snapshot : utils.unwrapMapFn(snapshot));
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () { return ref.off('value', fn); };
    }, ref);
    return observeOn.call(objectObservable, new utils.ZoneScheduler(Zone.current));
}
//# sourceMappingURL=firebase_object_factory.js.map