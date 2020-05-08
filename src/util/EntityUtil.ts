// eslint-disable-next-line no-unused-vars
import { getMetadataArgsStorage, ObjectType } from 'typeorm';
// eslint-disable-next-line no-unused-vars
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';
// eslint-disable-next-line no-unused-vars
import { MetadataArgsStorage } from 'typeorm/metadata-args/MetadataArgsStorage';

export default class EntityUtil {
  private static storage(): MetadataArgsStorage {
    return getMetadataArgsStorage();
  }

  private static getPropertyName(column: ColumnMetadataArgs): string {
    return column.propertyName;
  }

  public static columns<Entity>(entity: ObjectType<Entity>): ColumnMetadataArgs[] {
    return this.storage().filterColumns(entity);
  }

  public static selectableColumns<Entity>(
    entity: ObjectType<Entity>,
    addColumns?: (keyof Entity)[]
  ) {
    return this.columns(entity)
      .filter((column) => {
        return column.options.select === undefined || column.options.select === true;
      })
      .map(this.getPropertyName)
      .concat(Array.isArray(addColumns) ? (addColumns as string[]) : []) as (keyof Entity)[];
  }

  public static uniqueColumns<Entity>(entity: ObjectType<Entity>): (keyof Entity)[] {
    return this.columns(entity)
      .filter((column) => {
        return column.options.unique === true;
      })
      .map(this.getPropertyName) as (keyof Entity)[];
  }
}
