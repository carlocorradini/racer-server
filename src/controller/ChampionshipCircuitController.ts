/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager, getCustomRepository } from 'typeorm';
import logger from '@app/logger';
import ChampionshipCircuit from '@app/db/entity/ChampionshipCircuit';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import { DuplicateEntityError } from '@app/common/error';
import Championship from '@app/db/entity/Championship';
import Circuit from '@app/db/entity/Circuit';
import ChampionshipCircuitRepository from '@app/db/repository/ChampionshipCircuitRepository';

export default class ChampionshipCircuitController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, championship, circuit, date } = req.query;

    getManager()
      .find(ChampionshipCircuit, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof ChampionshipCircuit]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(championship !== undefined && { championship }),
          ...(circuit !== undefined && { circuit }),
          ...(date !== undefined && { date }),
        },
      })
      .then((championshipCircuits) => {
        logger.info(`Found ${championshipCircuits.length} Championship Circuits`);

        ResponseHelper.send(res, HttpStatusCode.OK, championshipCircuits);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Championships Circuits due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 0),
    });
    const circuit = getManager().create(Circuit, {
      id: Number.parseInt(req.params.circuit, 10),
    });

    getManager()
      .findOneOrFail(ChampionshipCircuit, {
        loadRelationIds: true,
        where: {
          championship,
          circuit,
        },
      })
      .then((championshipCircuit) => {
        logger.info(
          `Found Championship Circuit ${championshipCircuit.circuit} of ${championshipCircuit.championship}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK, championshipCircuit);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to find Championship Circuit ${circuit.id} of ${championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static create(req: Request, res: Response): void {
    const championshipCircuit: ChampionshipCircuit = req.app.locals.ChampionshipCircuit;
    championshipCircuit.championship = getManager().create(Championship, {
      id: (championshipCircuit.championship as unknown) as number,
    });
    championshipCircuit.circuit = getManager().create(Circuit, {
      id: (championshipCircuit.circuit as unknown) as number,
    });

    getCustomRepository(ChampionshipCircuitRepository)
      .saveOrFail(championshipCircuit)
      .then((newChampionshipCircuit) => {
        logger.info(
          `Created Championship Circuit ${newChampionshipCircuit.circuit.id} of ${newChampionshipCircuit.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.CREATED, newChampionshipCircuit.circuit.id);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to create Championship Circuit ${championshipCircuit.circuit.id} of ${championshipCircuit.championship.id} due to ${ex.message}`
        );

        if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static update(req: Request, res: Response): void {
    const championshipCircuit: ChampionshipCircuit = req.app.locals.ChampionshipCircuit;
    championshipCircuit.championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 0),
    });
    championshipCircuit.circuit = getManager().create(Circuit, {
      id: Number.parseInt(req.params.circuit, 0),
    });

    getCustomRepository(ChampionshipCircuitRepository)
      .updateOrFail(championshipCircuit)
      .then((upChampionshipCircuit) => {
        logger.info(
          `Updated Championship Circuit ${upChampionshipCircuit.circuit.id} of ${upChampionshipCircuit.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to update Championship Circuit ${championshipCircuit.circuit.id} of ${championshipCircuit.championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static delete(req: Request, res: Response): void {
    const championshipCircuit: ChampionshipCircuit = getManager().create(ChampionshipCircuit, {
      championship: getManager().create(Championship, {
        id: Number.parseInt(req.params.championship, 0),
      }),
      circuit: getManager().create(Circuit, {
        id: Number.parseInt(req.params.circuit, 0),
      }),
    });

    getCustomRepository(ChampionshipCircuitRepository)
      .deleteOrFail(championshipCircuit)
      .then(() => {
        logger.info(
          `Deleted Championship Circuit ${championshipCircuit.circuit.id} of ${championshipCircuit.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to delete Championship Circuit ${championshipCircuit.circuit.id} of ${championshipCircuit.championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
