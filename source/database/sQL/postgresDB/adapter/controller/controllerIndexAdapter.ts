import { Request, Response } from 'express';

export default interface ControllerIndexAdapter {
  index(req: Request, res: Response): Promise<Response>;
}
