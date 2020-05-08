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
import UserChampionship from '../entity/UserChampionship';

@EntityRepository(UserChampionship)
export default class UserChampionshipRepository extends AbstractRepository<UserChampionship> {
  public saveOrFail(
    userChampionship: UserChampionship,
    entityManager?: EntityManager
  ): Promise<UserChampionship> {
    const callback = async (em: EntityManager) => {
      return UserChampionshipRepository.saveUnique(userChampionship, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public updateOrFail(
    userChampionship: UserChampionship,
    entityManager?: EntityManager
  ): Promise<UserChampionship> {
    const callback = async (em: EntityManager) => {
      const userChampionshipToUpdate: UserChampionship = await em.findOneOrFail(UserChampionship, {
        user: userChampionship.user,
        championship: userChampionship.championship,
      });
      await em.merge(UserChampionship, userChampionshipToUpdate, userChampionship);
      return UserChampionshipRepository.updateUnique(userChampionshipToUpdate, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public deleteOrFail(
    userChampionship: UserChampionship,
    entityManager?: EntityManager
  ): Promise<DeleteResult> {
    const callback = async (em: EntityManager) => {
      await em.findOneOrFail(UserChampionship, {
        user: userChampionship.user,
        championship: userChampionship.championship,
      });

      return em.delete(UserChampionship, {
        user: userChampionship.user,
        championship: userChampionship.championship,
      });
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  private static async saveUnique(
    userChampionship: UserChampionship,
    entityManager: EntityManager,
    saveOptions?: SaveOptions,
    isUpdateOperation?: boolean
  ): Promise<UserChampionship> {
    const duplicateFields = new Set<Duplicate>();
    const uniqueColumns = EntityUtil.uniqueColumns(UserChampionship);
    const whereConditions = uniqueColumns.map((u) => {
      return {
        [u]: userChampionship[u],
        ...(isUpdateOperation === true && {
          user: Not(userChampionship.user),
          championship: Not(userChampionship.championship),
        }),
      };
    });
    const duplicateEntities = await entityManager.find(UserChampionship, {
      where: whereConditions,
      select: uniqueColumns,
    });
    duplicateEntities.forEach((_userChampionship) => {
      uniqueColumns.forEach((uc) => {
        if (userChampionship[uc] === _userChampionship[uc]) {
          duplicateFields.add({ property: uc.toString(), value: userChampionship[uc] });
        }
      });
    });

    if (
      !isUpdateOperation &&
      (await entityManager.findOne(UserChampionship, {
        where: {
          user: userChampionship.user,
          championship: userChampionship.championship,
        },
      })) !== undefined
    ) {
      duplicateFields.add({
        property: `{ user, championship }`,
        value: { user: userChampionship.user.id, championship: userChampionship.championship.id },
      });
    }

    if (duplicateFields.size !== 0)
      throw new DuplicateEntityError(
        `Duplicate User Championship found`,
        Array.from(duplicateFields)
      );

    return entityManager.save(UserChampionship, userChampionship, saveOptions);
  }

  private static updateUnique(
    userChampionship: UserChampionship,
    entityManager: EntityManager,
    saveOptions?: SaveOptions
  ): Promise<UserChampionship> {
    return this.saveUnique(userChampionship, entityManager, saveOptions, true);
  }
}
