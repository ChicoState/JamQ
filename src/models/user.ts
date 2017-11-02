import { FirebaseListObservable } from 'angularfire2/database';

export interface User {
  email: string;
  password: string;
  username: string;
  partiesHosted: FirebaseListObservable<any>;
  partiesJoined: FirebaseListObservable<any>;
}
