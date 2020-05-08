/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import Circuit from '@app/db/entity/Circuit';
import { ResponseHelper, HttpStatusCode } from '@app/helper';

export default class CircuitController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, id, name } = req.query;

    getManager()
      .find(Circuit, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof Circuit]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(id !== undefined && { id }),
          ...(name !== undefined && { name }),
        },
      })
      .then((circuits) => {
        logger.info(`Found ${circuits.length} Circuits`);

        ResponseHelper.send(res, HttpStatusCode.OK, circuits);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Circuits due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .findOneOrFail(Circuit, id, { loadRelationIds: true })
      .then((circuit) => {
        logger.info(`Found Circuit ${circuit.id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, circuit);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Circuit ${id} due to ${ex.message}`);

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
