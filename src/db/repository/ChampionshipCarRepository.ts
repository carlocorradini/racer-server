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
import ChampionshipCar from '../entity/ChampionshipCar';

@EntityRepository(ChampionshipCar)
export default class ChampionshipCarRepository extends AbstractRepository<ChampionshipCar> {
  public saveOrFail(
    championshipCar: ChampionshipCar,
    entityManager?: EntityManager
  ): Promise<ChampionshipCar> {
    const callback = async (em: EntityManager) => {
      return ChampionshipCarRepository.saveUnique(championshipCar, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public updateOrFail(
    championshipCar: ChampionshipCar,
    entityManager?: EntityManager
  ): Promise<ChampionshipCar> {
    const callback = async (em: EntityManager) => {
      const championshipCarToUpdate: ChampionshipCar = await em.findOneOrFail(ChampionshipCar, {
        championship: championshipCar.championship,
        car: championshipCar.car,
      });
      await em.merge(ChampionshipCar, championshipCarToUpdate, championshipCar);
      return ChampionshipCarRepository.updateUnique(championshipCarToUpdate, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public deleteOrFail(
    championshipCar: ChampionshipCar,
    entityManager?: EntityManager
  ): Promise<DeleteResult> {
    const callback = async (em: EntityManager) => {
      await em.findOneOrFail(ChampionshipCar, {
        championship: championshipCar.championship,
        car: championshipCar.car,
      });

      return em.delete(ChampionshipCar, {
        championship: championshipCar.championship,
        car: championshipCar.car,
      });
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  private static async saveUnique(
    championshipCar: ChampionshipCar,
    entityManager: EntityManager,
    saveOptions?: SaveOptions,
    isUpdateOperation?: boolean
  ): Promise<ChampionshipCar> {
    const duplicateFields = new Set<Duplicate>();
    const uniqueColumns = EntityUtil.uniqueColumns(ChampionshipCar);
    const whereConditions = uniqueColumns.map((u) => {
      return {
        [u]: championshipCar[u],
        ...(isUpdateOperation === true && {
          championship: Not(championshipCar.championship),
          car: Not(championshipCar.car),
        }),
      };
    });
    const duplicateEntities = await entityManager.find(ChampionshipCar, {
      where: whereConditions,
      select: uniqueColumns,
    });
    duplicateEntities.forEach((_championshipCar) => {
      uniqueColumns.forEach((uc) => {
        if (championshipCar[uc] === _championshipCar[uc]) {
          duplicateFields.add({ property: uc.toString(), value: championshipCar[uc] });
        }
      });
    });

    if (
      !isUpdateOperation &&
      (await entityManager.findOne(ChampionshipCar, {
        where: {
          championship: championshipCar.championship,
          car: championshipCar.car,
        },
      })) !== undefined
    ) {
      duplicateFields.add({
        property: `{ championship, car }`,
        value: {
          championship: championshipCar.championship.id,
          car: championshipCar.car.id,
        },
      });
    }

    if (duplicateFields.size !== 0)
      throw new DuplicateEntityError(
        `Duplicate Championship Car found`,
        Array.from(duplicateFields)
      );

    return entityManager.save(ChampionshipCar, championshipCar, saveOptions);
  }

  private static updateUnique(
    championshipCar: ChampionshipCar,
    entityManager: EntityManager,
    saveOptions?: SaveOptions
  ): Promise<ChampionshipCar> {
    return this.saveUnique(championshipCar, entityManager, saveOptions, true);
  }
}
