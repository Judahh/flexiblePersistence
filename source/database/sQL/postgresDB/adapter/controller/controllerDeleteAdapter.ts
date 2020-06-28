import { Request, Response } from 'express';

export default interface ControllerDeleteAdapter {
  delete(req: Request, res: Response): Promise<Response>;
}
