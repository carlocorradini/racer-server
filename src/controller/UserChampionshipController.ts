/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager, Between, getCustomRepository } from 'typeorm';
import moment from 'moment';
import logger from '@app/logger';
import UserChampionship from '@app/db/entity/UserChampionship';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import User from '@app/db/entity/User';
import Championship from '@app/db/entity/Championship';
import { DuplicateEntityError } from '@app/common/error';
import UserChampionshipRepository from '@app/db/repository/UserChampionshipRepository';

export default class UserChampionshipController {
  public static find(req: Request, res: Response): void {
    const {
      limit,
      offset,
      sort,
      sort_order,
      user,
      championship,
      car,
      team,
      created_at,
    } = req.query;

    getManager()
      .find(UserChampionship, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof UserChampionship]: sort_order,
            },
          }),
        loadRelationIds: true,
        where: {
          ...(user !== undefined && { user }),
          ...(championship !== undefined && { championship }),
          ...(car !== undefined && { car }),
          ...(team !== undefined && { team }),
          ...(created_at !== undefined && {
            created_at: Between(
              moment(`${created_at}T00:00:00.000`),
              moment(`${created_at}T23:59:59.999`)
            ),
          }),
        },
      })
      .then((userChampionships) => {
        logger.info(`Found ${userChampionships.length} User Championships`);

        ResponseHelper.send(res, HttpStatusCode.OK, userChampionships);
      })
      .catch((ex) => {
        logger.warn(`Failed to find User Championships due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const user = getManager().create(User, {
      id: req.params.user !== undefined ? req.params.user : req.user?.id,
    });
    const championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.championship, 0),
    });

    getManager()
      .findOneOrFail(UserChampionship, {
        loadRelationIds: true,
        where: {
          user,
          championship,
        },
      })
      .then((userChampionship) => {
        logger.info(
          `Found User Championship ${userChampionship.championship} of ${userChampionship.user}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK, userChampionship);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to find User Championship ${championship.id} of ${user.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static create(req: Request, res: Response): void {
    const userChampionship: UserChampionship = req.app.locals.UserChampionship;
    userChampionship.user = getManager().create(User, { id: req.user?.id ? req.user.id : '' });
    userChampionship.championship = getManager().create(Championship, {
      id: (userChampionship.championship as unknown) as number,
    });

    getCustomRepository(UserChampionshipRepository)
      .saveOrFail(userChampionship)
      .then((newUserChampionship) => {
        logger.info(
          `Created User Championship ${newUserChampionship.championship.id} of ${newUserChampionship.user.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.CREATED, newUserChampionship.championship.id);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to create User Championship ${userChampionship.championship.id} of ${userChampionship.user.id} due to ${ex.message}`
        );

        if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static update(req: Request, res: Response): void {
    const userChampionship: UserChampionship = req.app.locals.UserChampionship;
    userChampionship.user = getManager().create(User, { id: req.user?.id ? req.user.id : '' });
    userChampionship.championship = getManager().create(Championship, {
      id: Number.parseInt(req.params.id, 0),
    });

    getCustomRepository(UserChampionshipRepository)
      .updateOrFail(userChampionship)
      .then((upUserChampionship) => {
        logger.info(
          `Updated User Championship ${upUserChampionship.championship.id} of ${upUserChampionship.user.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to update User Championship ${userChampionship.championship.id} of ${userChampionship.user.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else if (ex instanceof DuplicateEntityError)
          ResponseHelper.send(res, HttpStatusCode.CONFLICT, ex.errors);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static delete(req: Request, res: Response): void {
    const userChampionship: UserChampionship = getManager().create(UserChampionship, {
      user: getManager().create(User, { id: req.user?.id ? req.user.id : '' }),
      championship: getManager().create(Championship, {
        id: Number.parseInt(req.params.id, 0),
      }),
    });

    getCustomRepository(UserChampionshipRepository)
      .deleteOrFail(userChampionship)
      .then(() => {
        logger.info(
          `Deleted User Championship ${userChampionship.championship.id} of ${userChampionship.user.id}`
        );

        ResponseHelper.send(res, HttpStatusCode.OK);
      })
      .catch((ex) => {
        logger.warn(
          `Failed to delete User Championship ${userChampionship.championship.id} of ${userChampionship.user.id} due to ${ex.message}`
        );

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
