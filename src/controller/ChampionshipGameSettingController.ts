/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager, getCustomRepository } from 'typeorm';
import logger from '@app/logger';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import { DuplicateEntityError } from '@app/common/error';
import Championship from '@app/db/entity/Championship';
import ChampionshipGameSetting from '@app/db/entity/ChampionshipGameSetting';
import GameSetting from '@app/db/entity/GameSetting';
import ChampionshipGameSettingRepository from '@app/db/repository/ChampionshipGameSettingRepository';

export default class ChampionshipGameSettingController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, championship, game_setting } = req.query;

    getManager()
      .find(ChampionshipGameSetting, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof ChampionshipGameSetting]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(championship !== undefined && { championship }),
          ...(game_setting !== undefined && { game_setting }),
        },
      })
      .then((championshipGameSettings) => {
        logger.info(`Found ${championshipGameSettings.length} Championship Game Settings`);

        ResponseHelper.send(res, HttpStatusCode.OK, championshipGameSettings);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Championships Game Settings due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 10),
    });
    const game_setting = getManager().create(GameSetting, {
      id: Number.parseInt(req.params.game_setting, 10),
    });

    getManager()
      .findOneOrFail(ChampionshipGameSetting, {
        loadRelationIds: true,
        where: {
          championship,
          game_setting,
        },
      })
      .then((championshipGameSetting) => {
        logger.info(
          `Found Championship Game Setting ${championshipGameSetting.game_setting} of ${championshipGameSetting.championship}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK, championshipGameSetting);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to find Championship Game Setting ${game_setting.id} of ${championship.id} due to ${ex.message}`
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
      .find(ChampionshipGameSetting, {
        loadRelationIds: true,
        where: {
          championship,
        },
      })
      .then((championshipGameSettings) => {
        logger.info(
          `Found ${championshipGameSettings.length} Championship Game Settings of championship ${championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK, championshipGameSettings);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to find Championship Game Settings of championship ${championship.id} due to ${ex.message}`
        );

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static create(req: Request, res: Response): void {
    const championshipGameSetting: ChampionshipGameSetting = req.app.locals.ChampionshipGameSetting;
    championshipGameSetting.championship = getManager().create(Championship, {
      id: (championshipGameSetting.championship as unknown) as number,
    });
    championshipGameSetting.game_setting = getManager().create(GameSetting, {
      id: (championshipGameSetting.game_setting as unknown) as number,
    });

    getCustomRepository(ChampionshipGameSettingRepository)
      .saveOrFail(championshipGameSetting)
      .then((newChampionshipGameSetting) => {
        logger.info(
          `Created Championship Game Setting ${newChampionshipGameSetting.game_setting.id} of ${newChampionshipGameSetting.championship.id}`
        );

        ResponseHelper.send(
          res,
          HttpStatusCode.CREATED,
          newChampionshipGameSetting.game_setting.id
        );
      })
      .catch((ex) => {
        logger.warn(
          `Failed to create Championship Game Setting ${championshipGameSetting.game_setting.id} of ${championshipGameSetting.championship.id} due to ${ex.message}`
        );

        if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static update(req: Request, res: Response): void {
    const championshipGameSetting: ChampionshipGameSetting = req.app.locals.ChampionshipGameSetting;
    championshipGameSetting.championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 10),
    });
    championshipGameSetting.game_setting = getManager().create(GameSetting, {
      id: Number.parseInt(req.params.game_setting, 10),
    });

    getCustomRepository(ChampionshipGameSettingRepository)
      .updateOrFail(championshipGameSetting)
      .then((upChampionshipGameSetting) => {
        logger.info(
          `Updated Championship Game Setting ${upChampionshipGameSetting.game_setting.id} of ${upChampionshipGameSetting.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to update Championship Game Setting ${championshipGameSetting.game_setting.id} of ${championshipGameSetting.championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static delete(req: Request, res: Response): void {
    const championshipGameSetting: ChampionshipGameSetting = getManager().create(
      ChampionshipGameSetting,
      {
        championship: getManager().create(Championship, {
          id: Number.parseInt(req.params.championship, 10),
        }),
        game_setting: getManager().create(GameSetting, {
          id: Number.parseInt(req.params.game_setting, 10),
        }),
      }
    );

    getCustomRepository(ChampionshipGameSettingRepository)
      .deleteOrFail(championshipGameSetting)
      .then(() => {
        logger.info(
          `Deleted Championship Game Setting ${championshipGameSetting.game_setting.id} of ${championshipGameSetting.championship.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to delete Championship Game Setting ${championshipGameSetting.game_setting.id} of ${championshipGameSetting.championship.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
