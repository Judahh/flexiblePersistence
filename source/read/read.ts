/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInputCreate } from '../iPersistence/input/iInputCreate';
export class Read {
  protected readDB: IPersistence;

  constructor(readDB: IPersistence) {
    this.readDB = readDB;
  }

  getPersistence(): IPersistence {
    return this.readDB;
  }

  //  deepcode ignore no-any: any needed
  newEvent(event: Event): Promise<IOutput<unknown, unknown, unknown>> {
    //Operation.create.valueOf();
    const selection = event?.getSelection?.();
    const sId = (selection as any)?.id;
    const isArray = Array.isArray(sId);
    let id =
      selection && !isArray
        ? sId
        : event.isSingle() && event.getOperation() == Operation.create
        ? event.getId()
        : undefined;
    id = id ? id : sId;
    id = Array.isArray(id) ? id.map((i) => String(i)) : id ? String(id) : id;
    const input: IInputCreate<unknown, unknown> = {
      single: event.isSingle(),
      scheme: event.getName(),
      id: id,
      selectedItem: selection,
      item: event.getContent(),
      eventOptions: event.getOptions(),
      correct: event.isCorrect(),
      replace: event.isReplace(),
    };
    return this.readDB[Operation[event.getOperation()]](input);
  }

  clear(): Promise<boolean> {
    return this.readDB.clear();
  }

  getReadDB(): IPersistence {
    return this.readDB;
  }
}
