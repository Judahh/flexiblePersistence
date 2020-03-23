import { ObjectId } from 'mongodb';

export abstract class BasicModel {
  private _id?: string | RegExp | ObjectId;

  constructor(_id: string | RegExp | ObjectId) {
    this._id = _id;
  }
}
