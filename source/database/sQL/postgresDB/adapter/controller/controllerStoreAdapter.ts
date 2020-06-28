import { Request, Response } from 'express';

export default interface ControllerStoreAdapter {
  store(req: Request, res: Response): Promise<Response>;
}
