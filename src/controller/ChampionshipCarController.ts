/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager, getCustomRepository } from 'typeorm';
import logger from '@app/logger';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import { DuplicateEntityError } from '@app/common/error';
import ChampionshipCar from '@app/db/entity/ChampionshipCar';
import Car from '@app/db/entity/Car';
import ChampionshipCarRepository from '@app/db/repository/ChampionshipCarRepository';
import Championship from '@app/db/entity/Championship';

export default class ChampionshipCarController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, championship, car } = req.query;

    getManager()
      .find(ChampionshipCar, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof ChampionshipCar]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(championship !== undefined && { championship }),
          ...(car !== undefined && { car }),
        },
      })
      .then((championshipCars) => {
        logger.info(`Found ${championshipCars.length} Championship Cars`);

        ResponseHelper.send(res, HttpStatusCode.OK, championshipCars);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Championships Cars due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 10),
    });
    const car = getManager().create(Car, {
      id: Number.parseInt(req.params.circuit, 10),
    });

    getManager()
      .findOneOrFail(ChampionshipCar, {
        loadRelationIds: true,
        where: {
          championship,
          car,
        },
      })
      .then((championshipCar) => {
        logger.info(
          `Found Championship Car ${championshipCar.car} of ${championshipCar.championship}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK, championshipCar);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to find Championship Car ${car.id} of ${championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findByChampionshipId(req: Request, res: Response): void {
    const championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 10),
    });

    getManager()
      .find(ChampionshipCar, {
        loadRelationIds: true,
        where: {
          championship,
        },
      })
      .then((championshipCars) => {
        logger.info(
          `Found ${championshipCars.length} Championship Cars of championship ${championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK, championshipCars);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to find Championship Cars of championship ${championship.id} due to ${ex.message}`
        );

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static create(req: Request, res: Response): void {
    const championshipCar: ChampionshipCar = req.app.locals.ChampionshipCar;
    championshipCar.championship = getManager().create(Championship, {
      id: (championshipCar.championship as unknown) as number,
    });
    championshipCar.car = getManager().create(Car, {
      id: (championshipCar.car as unknown) as number,
    });

    getCustomRepository(ChampionshipCarRepository)
      .saveOrFail(championshipCar)
      .then((newChampionshipCar) => {
        logger.info(
          `Created Championship Car ${newChampionshipCar.car.id} of ${newChampionshipCar.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.CREATED, newChampionshipCar.car.id);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to create Championship Car ${championshipCar.car.id} of ${championshipCar.championship.id} due to ${ex.message}`
        );

        if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static update(req: Request, res: Response): void {
    const championshipCar: ChampionshipCar = req.app.locals.ChampionshipCar;
    championshipCar.championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 10),
    });
    championshipCar.car = getManager().create(Car, {
      id: Number.parseInt(req.params.car, 10),
    });

    getCustomRepository(ChampionshipCarRepository)
      .updateOrFail(championshipCar)
      .then((upChampionshipCar) => {
        logger.info(
          `Updated Championship Car ${upChampionshipCar.car.id} of ${upChampionshipCar.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to update Championship Car ${championshipCar.car.id} of ${championshipCar.championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static delete(req: Request, res: Response): void {
    const championshipCircuit: ChampionshipCar = getManager().create(ChampionshipCar, {
      championship: getManager().create(Championship, {
        id: Number.parseInt(req.params.championship, 10),
      }),
      car: getManager().create(Car, {
        id: Number.parseInt(req.params.car, 10),
      }),
    });

    getCustomRepository(ChampionshipCarRepository)
      .deleteOrFail(championshipCircuit)
      .then(() => {
        logger.info(
          `Deleted Championship Car ${championshipCircuit.car.id} of ${championshipCircuit.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to delete Championship Car ${championshipCircuit.car.id} of ${championshipCircuit.championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
