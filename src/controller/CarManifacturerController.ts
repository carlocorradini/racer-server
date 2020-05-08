/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import CarManifacturer from '@app/db/entity/CarManifacturer';
import { ResponseHelper, HttpStatusCode } from '@app/helper';

export default class CarManifacturerController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, id, name } = req.query;

    getManager()
      .find(CarManifacturer, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof CarManifacturer]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(id !== undefined && { id }),
          ...(name !== undefined && { name }),
        },
      })
      .then((carManifactures) => {
        logger.info(`Found ${carManifactures.length} Car Manifacturers`);

        ResponseHelper.send(res, HttpStatusCode.OK, carManifactures);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Car Manifacturers due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .findOneOrFail(CarManifacturer, id, { loadRelationIds: true })
      .then((carManifacturer) => {
        logger.info(`Found Car Manifacturer ${carManifacturer.id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, carManifacturer);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Car Manifacturer ${id} due to ${ex.message}`);

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
