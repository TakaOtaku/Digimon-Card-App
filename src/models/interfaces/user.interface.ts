import { ISave } from './save.interface';

export interface IUser {
  uid: string;
  displayName: string;
  photoUrl: string; // Changed from photoURL to photoUrl for consistency
  save: ISave;
}
