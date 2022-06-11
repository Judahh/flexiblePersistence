/* eslint-disable no-unused-vars */
import { PipelineStage } from 'mongoose';

export enum PipelineCRUDType {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

export type PipelineCRUD = {
  create?: PipelineStage | PipelineStage[];
  read?: PipelineStage | PipelineStage[];
  update?: PipelineStage | PipelineStage[];
  delete?: PipelineStage | PipelineStage[];
};
