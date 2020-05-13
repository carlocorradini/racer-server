import {
  AbstractRepository,
  EntityRepository,
  // eslint-disable-next-line no-unused-vars
  DeleteResult,
  // eslint-disable-next-line no-unused-vars
  EntityManager,
  // eslint-disable-next-line no-unused-vars
  SaveOptions,
  Not,
} from 'typeorm';
// eslint-disable-next-line no-unused-vars
import User from '@app/db/entity/User';
import { EntityUtil, CryptUtil } from '@app/util';
// eslint-disable-next-line no-unused-vars
import { DuplicateEntityError } from '@app/common/error';
// eslint-disable-next-line no-unused-vars
import { Duplicate } from '@app/common/error/DuplicateEntityError';
import { JWTHelper } from '@app/helper';
import ImageService, { ImageType } from '@app/service/ImageService';
import { EmailService } from '@app/service';

@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  public async signInOrFail(user: User): Promise<string> {
    const foundUser: User = await this.manager.findOneOrFail(
      User,
      { username: user.username },
      { select: ['id', 'username', 'password', 'role'] }
    );
    await CryptUtil.compareOrFail(user.password, foundUser.password);
    return JWTHelper.sign({
      id: foundUser.id,
      role: foundUser.role,
    });
  }

  public saveOrFail(user: User, entityManager?: EntityManager): Promise<string> {
    const callback = async (em: EntityManager) => {
      const newUser: User = await UserRepository.saveUnique(user, em);

      // TODO Change from
      await EmailService.send({
        from: '"Racer" <welcome@racer.com>',
        to: newUser.email,
        subject: 'Welcome to Racer',
        // TODO Remove Typescript ignore
        // @ts-ignore
        template: 'welcome',
        context: {
          username: newUser.username,
        },
      });

      return JWTHelper.sign({
        id: newUser.id,
        role: newUser.role,
      });
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public updateOrFail(user: User, entityManager?: EntityManager): Promise<User> {
    const callback = async (em: EntityManager) => {
      const userToUpdate: User = await em.findOneOrFail(User, user.id);
      await em.merge(User, userToUpdate, user);
      return UserRepository.updateUnique(userToUpdate, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public updateAvataOrFail(
    user: User,
    avatar: Express.Multer.File,
    entityManager?: EntityManager
  ): Promise<User> {
    const callback = async (em: EntityManager) => {
      const avatarResult = await ImageService.upload(avatar, {
        type: ImageType.AVATAR,
        folder: 'user/avatar',
      });
      // eslint-disable-next-line no-param-reassign
      user.avatar = avatarResult.secure_url;
      return this.updateOrFail(user, em);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  public deleteOrFail(user: User, entityManager?: EntityManager): Promise<DeleteResult> {
    const callback = async (em: EntityManager) => {
      await em.findOneOrFail(User, user.id);
      return em.delete(User, user.id);
    };

    return entityManager === undefined
      ? this.manager.transaction(callback)
      : callback(entityManager);
  }

  private static async saveUnique(
    user: User,
    entityManager: EntityManager,
    saveOptions?: SaveOptions,
    isUpdateOperation?: boolean
  ): Promise<User> {
    const duplicateFields = new Set<Duplicate>();
    const uniqueColumns = EntityUtil.uniqueColumns(User);
    const whereConditions = uniqueColumns.map((u) => {
      return {
        [u]: user[u],
        ...(isUpdateOperation === true && {
          id: Not(user.id),
        }),
      };
    });
    const duplicateEntities = await entityManager.find(User, {
      where: whereConditions,
      select: uniqueColumns,
    });
    duplicateEntities.forEach((_user) => {
      uniqueColumns.forEach((u) => {
        if (user[u] === _user[u]) {
          duplicateFields.add({ property: u.toString(), value: user[u] });
        }
      });
    });

    if (
      !isUpdateOperation &&
      (await entityManager.findOne(User, {
        where: {
          id: user.id,
        },
      })) !== undefined
    ) {
      duplicateFields.add({
        property: `id`,
        value: user.id,
      });
    }

    if (duplicateFields.size !== 0)
      throw new DuplicateEntityError(`Duplicate User entity found`, Array.from(duplicateFields));

    return entityManager.save(User, user, saveOptions);
  }

  private static updateUnique(
    user: User,
    entityManager: EntityManager,
    saveOptions?: SaveOptions
  ): Promise<User> {
    return this.saveUnique(user, entityManager, saveOptions, true);
  }
}
