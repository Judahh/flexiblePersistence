import { Request, Response } from 'express';

export default interface ControllerShowAdapter {
  show(req: Request, res: Response): Promise<Response>;
}
