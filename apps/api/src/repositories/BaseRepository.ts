/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, PrismaClient } from '@repo/database';

import { IBaseRepository, ModelName } from './IBaseRepository';

/**
 * BaseRepository provides generic CRUD and aggregation operations for a Prisma model.
 * @template TModelName - The Prisma model name.
 */
export class BaseRepository<TModelName extends ModelName> implements IBaseRepository<TModelName> {
  protected db: PrismaClient;
  protected model: PrismaClient[TModelName];

  constructor(db: PrismaClient, modelName: TModelName) {
    this.db = db;
    this.model = db[modelName];
  }

  // --- FIND OPERATIONS ---

  /**
   * Find multiple records.
   * @param args Prisma findMany arguments.
   */
  async findMany<T extends Prisma.Args<TModelName, 'findMany'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'findMany'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findMany'>> {
    return (this.model as any).findMany(args);
  }

  /**
   * Find a unique record by unique criteria.
   * @param args Prisma findUnique arguments.
   */
  async findUnique<T extends Prisma.Args<TModelName, 'findUnique'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'findUnique'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findUnique'>> {
    return (this.model as any).findUnique(args);
  }

  /**
   * Find the first record matching the criteria.
   * @param args Prisma findFirst arguments.
   */
  async findFirst<T extends Prisma.Args<TModelName, 'findFirst'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'findFirst'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findFirst'>> {
    return (this.model as any).findFirst(args);
  }

  /**
   * Find a unique record or throw if not found.
   * @param args Prisma findUnique arguments.
   */
  async findUniqueOrThrow<T extends Prisma.Args<TModelName, 'findUnique'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'findUnique'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'findUniqueOrThrow'>> {
    return (this.model as any).findUniqueOrThrow(args);
  }

  // --- CREATE OPERATIONS ---

  /**
   * Create a new record.
   * @param args Prisma create arguments.
   */
  async create<T extends Prisma.Args<TModelName, 'create'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'create'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'create'>> {
    return (this.model as any).create(args);
  }

  /**
   * Create multiple records.
   * @param args Prisma createMany arguments.
   */
  async createMany<T extends Prisma.Args<TModelName, 'createMany'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'createMany'>>
  ): Promise<Prisma.BatchPayload> {
    return (this.model as any).createMany(args);
  }

  // --- UPDATE OPERATIONS ---

  /**
   * Update a single record.
   * @param args Prisma update arguments.
   */
  async update<T extends Prisma.Args<TModelName, 'update'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'update'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'update'>> {
    return (this.model as any).update(args);
  }

  /**
   * Update multiple records.
   * @param args Prisma updateMany arguments.
   */
  async updateMany<T extends Prisma.Args<TModelName, 'updateMany'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'updateMany'>>
  ): Promise<Prisma.BatchPayload> {
    return (this.model as any).updateMany(args);
  }

  /**
   * Upsert a record (update if exists, otherwise create).
   * @param args Prisma upsert arguments.
   */
  async upsert<T extends Prisma.Args<TModelName, 'upsert'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'upsert'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'upsert'>> {
    return (this.model as any).upsert(args);
  }

  // --- DELETE OPERATIONS ---

  /**
   * Delete a single record.
   * @param args Prisma delete arguments.
   */
  async delete<T extends Prisma.Args<TModelName, 'delete'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'delete'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'delete'>> {
    return (this.model as any).delete(args);
  }

  /**
   * Delete multiple records.
   * @param args Prisma deleteMany arguments.
   */
  async deleteMany<T extends Prisma.Args<TModelName, 'deleteMany'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'deleteMany'>>
  ): Promise<Prisma.BatchPayload> {
    return (this.model as any).deleteMany(args);
  }

  // --- AGGREGATION/COUNT ---

  /**
   * Count records matching criteria.
   * @param args Prisma count arguments.
   */
  async count<T extends Prisma.Args<TModelName, 'count'>>(
    args?: Prisma.Exact<T, Prisma.Args<TModelName, 'count'>>
  ): Promise<number> {
    return (this.model as any).count(args);
  }

  /**
   * Aggregate records.
   * @param args Prisma aggregate arguments.
   */
  async aggregate<T extends Prisma.Args<TModelName, 'aggregate'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'aggregate'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'aggregate'>> {
    return (this.model as any).aggregate(args);
  }

  /**
   * Group records by fields.
   * @param args Prisma groupBy arguments.
   */
  async groupBy<T extends Prisma.Args<TModelName, 'groupBy'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'groupBy'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'groupBy'>> {
    return (this.model as any).groupBy(args);
  }
}
