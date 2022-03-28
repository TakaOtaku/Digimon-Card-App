import {ISave} from "./save.interface";

export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  save: ISave;
}
