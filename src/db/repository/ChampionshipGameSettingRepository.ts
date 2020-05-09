import {
  EntityRepository,
  AbstractRepository,
  // eslint-disable-next-line no-unused-vars
  EntityManager,
  // eslint-disable-next-line no-unused-vars
  SaveOptions,
  Not,
  // eslint-disable-next-line no-unused-vars
  DeleteResult,
} from 'typeorm';
// eslint-disable-next-line no-unused-vars
import { Duplicate } from '@app/common/error/DuplicateEntityError';
import { EntityUtil } from '@app/util';
import { DuplicateEntityError } from '@app/common/error';
import ChampionshipGameSetting from '../entity/ChampionshipGameSetting';

@EntityRepository(ChampionshipGameSetting)
export default class ChampionshipGameSettingRepository extends AbstractRepository<
  ChampionshipGameSetting
> {
  public saveOrFail(
    championshipGameSetting: ChampionshipGameSetting,
    entityManager?: EntityManager
  ): Promise<ChampionshipGameSetting> {
    const callback = async (em: EntityManager) => {
      return ChampionshipGameSettingRepository.saveUnique(championshipGameSetting, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public updateOrFail(
    championshipGameSetting: ChampionshipGameSetting,
    entityManager?: EntityManager
  ): Promise<ChampionshipGameSetting> {
    const callback = async (em: EntityManager) => {
      const championshipGameSettingToUpdate: ChampionshipGameSetting = await em.findOneOrFail(
        ChampionshipGameSetting,
        {
          championship: championshipGameSetting.championship,
          game_setting: championshipGameSetting.game_setting,
        }
      );
      await em.merge(
        ChampionshipGameSetting,
        championshipGameSettingToUpdate,
        championshipGameSetting
      );
      return ChampionshipGameSettingRepository.updateUnique(championshipGameSettingToUpdate, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public deleteOrFail(
    championshipGameSetting: ChampionshipGameSetting,
    entityManager?: EntityManager
  ): Promise<DeleteResult> {
    const callback = async (em: EntityManager) => {
      await em.findOneOrFail(ChampionshipGameSetting, {
        championship: championshipGameSetting.championship,
        game_setting: championshipGameSetting.game_setting,
      });

      return em.delete(ChampionshipGameSetting, {
        championship: championshipGameSetting.championship,
        game_setting: championshipGameSetting.game_setting,
      });
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  private static async saveUnique(
    championshipGameSetting: ChampionshipGameSetting,
    entityManager: EntityManager,
    saveOptions?: SaveOptions,
    isUpdateOperation?: boolean
  ): Promise<ChampionshipGameSetting> {
    const duplicateFields = new Set<Duplicate>();
    const uniqueColumns = EntityUtil.uniqueColumns(ChampionshipGameSetting);
    const whereConditions = uniqueColumns.map((u) => {
      return {
        [u]: championshipGameSetting[u],
        ...(isUpdateOperation === true && {
          championship: Not(championshipGameSetting.championship),
          game_setting: Not(championshipGameSetting.game_setting),
        }),
      };
    });
    const duplicateEntities = await entityManager.find(ChampionshipGameSetting, {
      where: whereConditions,
      select: uniqueColumns,
    });
    duplicateEntities.forEach((_championshipGameSetting) => {
      uniqueColumns.forEach((cgs) => {
        if (championshipGameSetting[cgs] === _championshipGameSetting[cgs]) {
          duplicateFields.add({ property: cgs.toString(), value: championshipGameSetting[cgs] });
        }
      });
    });

    if (
      !isUpdateOperation &&
      (await entityManager.findOne(ChampionshipGameSetting, {
        where: {
          championship: championshipGameSetting.championship,
          game_setting: championshipGameSetting.game_setting,
        },
      })) !== undefined
    ) {
      duplicateFields.add({
        property: `{ championship, game_setting }`,
        value: {
          championship: championshipGameSetting.championship.id,
          game_setting: championshipGameSetting.game_setting.id,
        },
      });
    }

    if (duplicateFields.size !== 0)
      throw new DuplicateEntityError(
        `Duplicate Championship Game Setting found`,
        Array.from(duplicateFields)
      );

    return entityManager.save(ChampionshipGameSetting, championshipGameSetting, saveOptions);
  }

  private static updateUnique(
    championshipGameSetting: ChampionshipGameSetting,
    entityManager: EntityManager,
    saveOptions?: SaveOptions
  ): Promise<ChampionshipGameSetting> {
    return this.saveUnique(championshipGameSetting, entityManager, saveOptions, true);
  }
}
