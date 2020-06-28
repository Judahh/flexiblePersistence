import { Request, Response } from 'express';

export default interface ControllerUpdateAdapter {
  update(req: Request, res: Response): Promise<Response>;
}
