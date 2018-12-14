import { FirebaseObjectObservable } from './firebase_object_observable';
import 'firebase/database';
import { FirebaseObjectFactoryOpts, PathReference } from '../interfaces';
export declare function FirebaseObjectFactory(pathRef: PathReference, {preserveSnapshot}?: FirebaseObjectFactoryOpts): FirebaseObjectObservable<any>;
