/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import ChampionshipPhoto from '@app/db/entity/ChampionshipPhoto';

export default class ChampionshipPohotController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, championship } = req.query;

    getManager()
      .find(ChampionshipPhoto, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof ChampionshipPhoto]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(championship !== undefined && { championship }),
        },
      })
      .then((championshipPhotos) => {
        logger.info(`Found ${championshipPhotos.length} Championship Photos`);

        ResponseHelper.send(res, HttpStatusCode.OK, championshipPhotos);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Championship Photos due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findByChampionshipId(req: Request, res: Response): void {
    const { championship } = req.params;

    getManager()
      .find(ChampionshipPhoto, {
        loadRelationIds: true,
        where: {
          championship,
        },
      })
      .then((championshipPhotos) => {
        logger.info(`Found ${championshipPhotos.length} Championship Photos of ${championship}`);

        ResponseHelper.send(res, HttpStatusCode.OK, championshipPhotos);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Championship Photos of ${championship} due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { championship, photo } = req.params;

    getManager()
      .findOneOrFail(ChampionshipPhoto, {
        loadRelationIds: true,
        where: { championship: Number.parseInt(championship, 10), photo },
      })
      .then((championshipPhoto) => {
        logger.info(
          `Found Championship Photo ${championshipPhoto.photo} of ${championshipPhoto.championship}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK, championshipPhoto);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to find Championship Photo ${photo} of ${championship} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
