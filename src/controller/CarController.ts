/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import Car from '@app/db/entity/Car';
import { ResponseHelper, HttpStatusCode } from '@app/helper';

export default class CarController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, id, name, manifacturer } = req.query;

    getManager()
      .find(Car, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof Car]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(id !== undefined && { id }),
          ...(name !== undefined && { name }),
          ...(manifacturer !== undefined && { manifacturer }),
        },
      })
      .then((cars) => {
        logger.info(`Found ${cars.length} Cars`);

        ResponseHelper.send(res, HttpStatusCode.OK, cars);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Cars due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .findOneOrFail(Car, id, { loadRelationIds: true })
      .then((car) => {
        logger.info(`Found Car ${car.id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, car);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Car ${id} due to ${ex.message}`);

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
