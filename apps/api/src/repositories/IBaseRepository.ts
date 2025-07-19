import { Prisma, PrismaClient } from '@repo/database';

export type ModelName = keyof Omit<
  PrismaClient,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
  | '$extends'
  | '$runCommandRaw'
  | '$queryRaw'
  | '$executeRaw'
  | '$queryRawUnsafe'
  | '$executeRawUnsafe'
>;

/**
 * Generic base repository interface for Prisma models.
 * TModelName - the Prisma model name.
 * TReturn - the return type for single-entity queries.
 */
export interface IBaseRepository<TModelName extends ModelName> {
  // FIND OPERATIONS

  /**
   * Find multiple records.
   * @param args Prisma findMany arguments.
   * @returns Promise of array of TReturn.
   */
  findMany<T extends Prisma.Args<TModelName, 'findMany'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'findMany'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findMany'>>;

  /**
   * Find a unique record by unique criteria.
   * @param args Prisma findUnique arguments.
   * @returns Promise of TReturn or null.
   */
  findUnique<T extends Prisma.Args<TModelName, 'findUnique'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'findUnique'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findUnique'>>;

  /**
   * Find the first record matching the criteria.
   * @param args Prisma findFirst arguments.
   * @returns Promise of TReturn or null.
   */
  findFirst<T extends Prisma.Args<TModelName, 'findFirst'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'findFirst'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findFirst'>>;

  /**
   * Find a unique record or throw if not found.
   * @param args Prisma findUnique arguments.
   * @returns Promise of TReturn.
   */
  findUniqueOrThrow<T extends Prisma.Args<TModelName, 'findUnique'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'findUnique'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findUniqueOrThrow'>>;

  // CREATE OPERATIONS

  /**
   * Create a new record.
   * @param args Prisma create arguments.
   * @returns Promise of TReturn.
   */
  create<T extends Prisma.Args<TModelName, 'create'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'create'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'create'>>;

  /**
   * Create multiple records.
   * @param args Prisma createMany arguments.
   * @returns Promise of BatchPayload.
   */
  createMany<T extends Prisma.Args<TModelName, 'createMany'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'createMany'>>
  ): Promise<Prisma.BatchPayload>;

  // UPDATE OPERATIONS

  /**
   * Update a single record.
   * @param args Prisma update arguments.
   * @returns Promise of TReturn.
   */
  update<T extends Prisma.Args<TModelName, 'update'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'update'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'update'>>;

  /**
   * Update multiple records.
   * @param args Prisma updateMany arguments.
   * @returns Promise of BatchPayload.
   */
  updateMany<T extends Prisma.Args<TModelName, 'updateMany'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'updateMany'>>
  ): Promise<Prisma.BatchPayload>;

  /**
   * Upsert a record (update if exists, otherwise create).
   * @param args Prisma upsert arguments.
   * @returns Promise of upsert result.
   */
  upsert<T extends Prisma.Args<TModelName, 'upsert'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'upsert'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'upsert'>>;

  // DELETE OPERATIONS

  /**
   * Delete a single record.
   * @param args Prisma delete arguments.
   * @returns Promise of TReturn.
   */
  delete<T extends Prisma.Args<TModelName, 'delete'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'delete'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'delete'>>;

  /**
   * Delete multiple records.
   * @param args Prisma deleteMany arguments.
   * @returns Promise of BatchPayload.
   */
  deleteMany<T extends Prisma.Args<TModelName, 'deleteMany'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'deleteMany'>>
  ): Promise<Prisma.BatchPayload>;

  // AGGREGATION/COUNT

  /**
   * Count records matching criteria.
   * @param args Prisma count arguments.
   * @returns Promise of number.
   */
  count<T extends Prisma.Args<TModelName, 'count'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'count'>>
  ): Promise<number>;

  /**
   * Aggregate records.
   * @param args Prisma aggregate arguments.
   * @returns Promise of aggregate result.
   */
  aggregate<T extends Prisma.Args<TModelName, 'aggregate'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'aggregate'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'aggregate'>>;

  /**
   * Group records by fields.
   * @param args Prisma groupBy arguments.
   * @returns Promise of groupBy result.
   */
  groupBy<T extends Prisma.Args<TModelName, 'groupBy'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'groupBy'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'groupBy'>>;
}
