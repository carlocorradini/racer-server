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
import ChampionshipCircuit from '../entity/ChampionshipCircuit';

@EntityRepository(ChampionshipCircuit)
export default class ChampionshipCircuitRepository extends AbstractRepository<ChampionshipCircuit> {
  public saveOrFail(
    championshipCircuit: ChampionshipCircuit,
    entityManager?: EntityManager
  ): Promise<ChampionshipCircuit> {
    const callback = async (em: EntityManager) => {
      return ChampionshipCircuitRepository.saveUnique(championshipCircuit, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public updateOrFail(
    championshipCircuit: ChampionshipCircuit,
    entityManager?: EntityManager
  ): Promise<ChampionshipCircuit> {
    const callback = async (em: EntityManager) => {
      const championshipCircuitToUpdate: ChampionshipCircuit = await em.findOneOrFail(
        ChampionshipCircuit,
        {
          championship: championshipCircuit.championship,
          circuit: championshipCircuit.circuit,
        }
      );
      await em.merge(ChampionshipCircuit, championshipCircuitToUpdate, championshipCircuit);
      return ChampionshipCircuitRepository.updateUnique(championshipCircuitToUpdate, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public deleteOrFail(
    championshipCircuit: ChampionshipCircuit,
    entityManager?: EntityManager
  ): Promise<DeleteResult> {
    const callback = async (em: EntityManager) => {
      await em.findOneOrFail(ChampionshipCircuit, {
        championship: championshipCircuit.championship,
        circuit: championshipCircuit.circuit,
      });

      return em.delete(ChampionshipCircuit, {
        championship: championshipCircuit.championship,
        circuit: championshipCircuit.circuit,
      });
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  private static async saveUnique(
    championshipCircuit: ChampionshipCircuit,
    entityManager: EntityManager,
    saveOptions?: SaveOptions,
    isUpdateOperation?: boolean
  ): Promise<ChampionshipCircuit> {
    const duplicateFields = new Set<Duplicate>();
    const uniqueColumns = EntityUtil.uniqueColumns(ChampionshipCircuit);
    const whereConditions = uniqueColumns.map((u) => {
      return {
        [u]: championshipCircuit[u],
        ...(isUpdateOperation === true && {
          championship: Not(championshipCircuit.championship),
          circuit: Not(championshipCircuit.circuit),
        }),
      };
    });
    const duplicateEntities = await entityManager.find(ChampionshipCircuit, {
      where: whereConditions,
      select: uniqueColumns,
    });
    duplicateEntities.forEach((_championshipCircuit) => {
      uniqueColumns.forEach((uc) => {
        if (championshipCircuit[uc] === _championshipCircuit[uc]) {
          duplicateFields.add({ property: uc.toString(), value: championshipCircuit[uc] });
        }
      });
    });

    if (
      !isUpdateOperation &&
      (await entityManager.findOne(ChampionshipCircuit, {
        where: {
          championship: championshipCircuit.championship,
          circuit: championshipCircuit.circuit,
        },
      })) !== undefined
    ) {
      duplicateFields.add({
        property: `{ championship, circuit }`,
        value: {
          championship: championshipCircuit.championship.id,
          circuit: championshipCircuit.circuit.id,
        },
      });
    }

    if (duplicateFields.size !== 0)
      throw new DuplicateEntityError(
        `Duplicate Championship Circuit found`,
        Array.from(duplicateFields)
      );

    return entityManager.save(ChampionshipCircuit, championshipCircuit, saveOptions);
  }

  private static updateUnique(
    championshipCircuit: ChampionshipCircuit,
    entityManager: EntityManager,
    saveOptions?: SaveOptions
  ): Promise<ChampionshipCircuit> {
    return this.saveUnique(championshipCircuit, entityManager, saveOptions, true);
  }
}
