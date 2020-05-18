/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import logger from '@app/logger';
import Car from '@app/db/entity/Car';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import UserChampionship from '@app/db/entity/UserChampionship';

export default class CarController {
  public static find(req: Request, res: Response): void {
    const { limit, offset, sort, sort_order, id, name, manufacturer } = req.query;

    getManager()
      .find(Car, {
        ...(limit !== undefined && { take: (limit as unknown) as number }),
        ...(offset !== undefined && { skip: (offset as unknown) as number }),
        ...(sort !== undefined &&
          sort_order !== undefined && {
            order: {
              [sort as keyof Car]: sort_order,
            },
          }),
        relations: ['manufacturer'],
        where: {
          ...(id !== undefined && { id }),
          ...(name !== undefined && { name }),
          ...(manufacturer !== undefined && { manufacturer }),
        },
      })
      .then((cars) => {
        logger.info(`Found ${cars.length} Cars`);

        ResponseHelper.send(res, HttpStatusCode.OK, cars);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Cars due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findById(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .findOneOrFail(Car, id, { relations: ['manufacturer'] })
      .then((car) => {
        logger.info(`Found Car ${car.id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, car);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Car ${id} due to ${ex.message}`);

        if (ex.name === 'EntityNotFound') ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
        else ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }

  public static findByChampionshipId(req: Request, res: Response): void {
    const { id } = req.params;

    getManager()
      .createQueryBuilder(UserChampionship, 'uc')
      .distinctOn(['uc.car'])
      .leftJoinAndSelect('uc.car', 'car')
      .leftJoinAndSelect('car.manufacturer', 'manufacturer')
      .where('uc.championship = :championship', { championship: Number.parseInt(id, 10) })
      .getMany()
      .then((cars) => {
        // eslint-disable-next-line no-param-reassign
        cars = (cars.map((car) => car.car) as unknown) as UserChampionship[];

        logger.info(`Found ${cars.length} Cars of Championship ${id}`);

        ResponseHelper.send(res, HttpStatusCode.OK, cars);
      })
      .catch((ex) => {
        logger.warn(`Failed to find Cars of Championship ${id} due to ${ex.message}`);

        ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
      });
  }
}
