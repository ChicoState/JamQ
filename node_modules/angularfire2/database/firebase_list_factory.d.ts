import 'firebase/database';
import { FirebaseListObservable } from './firebase_list_observable';
import { FirebaseListFactoryOpts, PathReference } from '../interfaces';
export declare function FirebaseListFactory(pathRef: PathReference, {preserveSnapshot, query}?: FirebaseListFactoryOpts): FirebaseListObservable<any>;
export declare function onChildAdded(arr: any[], child: any, toKey: (element: any) => string, prevKey: string): any[];
export declare function onChildChanged(arr: any[], child: any, toKey: (element: any) => string, prevKey: string): any[];
export declare function onChildRemoved(arr: any[], child: any, toKey: (element: any) => string): any[];
export declare function onChildUpdated(arr: any[], child: any, toKey: (element: any) => string, prevKey: string): any[];
