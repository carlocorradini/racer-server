/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import GameSetting from '@app/db/entity/GameSetting';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import ChampionshipGameSetting from '@app/db/entity/ChampionshipGameSetting';

export default class GameSettingController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, id, name } = req.query;

    getManager()
      .find(GameSetting, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof GameSetting]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(id !== undefined && { id }),
          ...(name !== undefined && { name }),
        },
      })
      .then((gameSettings) => {
        logger.info(`Found ${gameSettings.length} Game Settings`);

        ResponseHelper.send(res, HttpStatusCode.OK, gameSettings);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Game Settings due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .findOneOrFail(GameSetting, id, { loadRelationIds: true })
      .then((gameSetting) => {
        logger.info(`Found Game Setting ${gameSetting.id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, gameSetting);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Game Setting ${id} due to ${ex.message}`);

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findByChampionshipId(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .createQueryBuilder(ChampionshipGameSetting, 'cgs')
      .leftJoinAndSelect('cgs.game_setting', 'game_setting')
      .where('cgs.championship = :championship', { championship: Number.parseInt(id, 10) })
      .getMany()
      .then((gameSettings) => {
        // eslint-disable-next-line no-param-reassign
        gameSettings = (gameSettings.map(
          (game_setting) => game_setting.game_setting
        ) as unknown) as ChampionshipGameSetting[];

        logger.info(`Found ${gameSettings.length} Game Settings of Championship ${id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, gameSettings);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Game Settings of Championship ${id} due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
