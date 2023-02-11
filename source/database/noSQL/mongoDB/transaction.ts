import { TransactionOptions } from 'mongodb';
import { ClientSession, ClientSessionOptions, Mongoose } from 'mongoose';

export class Transaction {
  protected mongooseInstance: Mongoose;
  protected session?: ClientSession;

  constructor(mongooseInstance: Mongoose) {
    this.mongooseInstance = mongooseInstance;
  }

  public getSession(): ClientSession | undefined {
    return this.session;
  }

  public async begin(options?: {
    session?: ClientSessionOptions;
    transaction?: TransactionOptions;
  }): Promise<void> {
    this.session = await this.mongooseInstance.startSession(options?.session);
    await this.session.startTransaction(options?.transaction as any);
  }

  public async commit(): Promise<void> {
    const result = await this.session?.commitTransaction();
    await this.session?.endSession();
    return result as any;
  }

  public async rollback(): Promise<void> {
    const result = await this.session?.abortTransaction();
    await this.session?.endSession();
    return result as any;
  }
}
