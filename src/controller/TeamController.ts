/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import Team from '@app/db/entity/Team';
import { ResponseHelper, HttpStatusCode } from '@app/helper';

export default class TeamController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, id, name } = req.query;

    getManager()
      .find(Team, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof Team]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(id !== undefined && { id }),
          ...(name !== undefined && { name }),
        },
      })
      .then((teams) => {
        logger.info(`Found ${teams.length} Teams`);

        ResponseHelper.send(res, HttpStatusCode.OK, teams);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Teams due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .findOneOrFail(Team, id, { loadRelationIds: true })
      .then((team) => {
        logger.info(`Found Team ${team.id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, team);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Team ${id} due to ${ex.message}`);

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
