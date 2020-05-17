/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import Championship from '@app/db/entity/Championship';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import { StringUtil, ArrayUtil } from '@app/util';
// eslint-disable-next-line no-unused-vars
import UserChampionship from '@app/db/entity/UserChampionship';
// eslint-disable-next-line no-unused-vars
import ChampionshipCircuit from '@app/db/entity/ChampionshipCircuit';
// eslint-disable-next-line no-unused-vars
import ChampionshipGameSetting from '@app/db/entity/ChampionshipGameSetting';

export default class ChampionshipController {
  public static find(req: Request, res: Response): void {
    const {
      limit,
      offset,
      sort,
      sort_order,
      id,
      name,
      cars,
      users,
      circuits,
      game_settings,
    } = req.query;

    const carsArray: number[] = StringUtil.toNumberArray(cars as string);
    const usersArray: string[] = StringUtil.toUUIDArray(users as string);
    const circuitsArray: number[] = StringUtil.toNumberArray(circuits as string);
    const gameSettingsArray: number[] = StringUtil.toNumberArray(game_settings as string);

    getManager()
      .find(Championship, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof Championship]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(id !== undefined && { id }),
          ...(name !== undefined && { name }),
        },
      })
      .then((championships) => {
        championships.forEach((championship) => {
          // eslint-disable-next-line no-param-reassign
          championship.users = (championship.users.map(
            (user) => user.user.id
          ) as unknown) as UserChampionship[];
          // eslint-disable-next-line no-param-reassign
          championship.circuits = championship.circuits.map(
            (circuit) => circuit.circuit.id as unknown
          ) as ChampionshipCircuit[];
          // eslint-disable-next-line no-param-reassign
          championship.game_settings = championship.game_settings.map(
            (game_setting) => game_setting.game_setting.id as unknown
          ) as ChampionshipGameSetting[];
        });
        // eslint-disable-next-line no-param-reassign
        championships = championships.filter(
          (championship) =>
            ArrayUtil.contains(championship.cars, carsArray) &&
            ArrayUtil.contains(championship.users, usersArray) &&
            ArrayUtil.contains(championship.circuits, circuitsArray) &&
            ArrayUtil.contains(championship.game_settings, gameSettingsArray)
        );

        logger.info(`Found ${championships.length} Championships`);

        ResponseHelper.send(res, HttpStatusCode.OK, championships);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Championships due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .findOneOrFail(Championship, id, { loadRelationIds: true })
      .then((championship) => {
        // eslint-disable-next-line no-param-reassign
        championship.users = (championship.users.map(
          (user) => user.user.id
        ) as unknown) as UserChampionship[];
        // eslint-disable-next-line no-param-reassign
        championship.circuits = championship.circuits.map(
          (circuit) => circuit.circuit.id as unknown
        ) as ChampionshipCircuit[];
        // eslint-disable-next-line no-param-reassign
        championship.game_settings = championship.game_settings.map(
          (game_setting) => game_setting.game_setting.id as unknown
        ) as ChampionshipGameSetting[];

        logger.info(`Found Championship ${championship.id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, championship);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Championship ${id} due to ${ex.message}`);

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
