export interface DjUser {

  email: string;
  password: string;
  verify: string;
  username: string;
  firstname: string;
  lastname: string;
  genre: string;
  location: string;

  // partiesHosted: FirebaseListObservable<any>;
  // partiesJoined: FirebaseListObservable<any>;
}
