import {ISave} from "./save.interface";

export interface IUser {
  uid: string;
  displayName: string;
  photoURL: string;
  save: ISave;
}
