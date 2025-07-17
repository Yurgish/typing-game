/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, PrismaClient } from '@repo/database';

import { IBaseRepository, ModelName } from './IBaseRepository';

export class BaseRepository<TModelName extends ModelName, TReturn> implements IBaseRepository<TModelName, TReturn> {
  protected db: PrismaClient;
  protected model: PrismaClient[TModelName];

  constructor(db: PrismaClient, modelName: TModelName) {
    this.db = db;
    this.model = db[modelName];
  }

  // --- FIND OPERATIONS ---
  async findMany(args?: Prisma.Args<TModelName, 'findMany'>): Promise<TReturn[]> {
    return (this.model as any).findMany(args);
  }

  async findUnique(args: Prisma.Args<TModelName, 'findUnique'>): Promise<TReturn | null> {
    return (this.model as any).findUnique(args);
  }

  async findFirst(args?: Prisma.Args<TModelName, 'findFirst'>): Promise<TReturn | null> {
    return (this.model as any).findFirst(args);
  }

  // --- CREATE OPERATIONS ---
  async create(args: Prisma.Args<TModelName, 'create'>): Promise<TReturn> {
    return (this.model as any).create(args);
  }

  async createMany(args: Prisma.Args<TModelName, 'createMany'>): Promise<Prisma.BatchPayload> {
    return (this.model as any).createMany(args);
  }

  // --- UPDATE OPERATIONS ---
  async update(args: Prisma.Args<TModelName, 'update'>): Promise<TReturn> {
    return (this.model as any).update(args);
  }

  async updateMany(args: Prisma.Args<TModelName, 'updateMany'>): Promise<Prisma.BatchPayload> {
    return (this.model as any).updateMany(args);
  }

  async upsert(args: Prisma.Args<TModelName, 'upsert'>): Promise<TReturn> {
    return (this.model as any).upsert(args);
  }

  // --- DELETE OPERATIONS ---
  async delete(args: Prisma.Args<TModelName, 'delete'>): Promise<TReturn> {
    return (this.model as any).delete(args);
  }

  async deleteMany(args?: Prisma.Args<TModelName, 'deleteMany'>): Promise<Prisma.BatchPayload> {
    return (this.model as any).deleteMany(args);
  }

  // --- AGGREGATION/COUNT ---
  async count(args?: Prisma.Args<TModelName, 'count'>): Promise<number> {
    return (this.model as any).count(args);
  }

  async aggregate<T extends Prisma.Args<TModelName, 'aggregate'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'aggregate'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'aggregate'>> {
    return (this.model as any).aggregate(args);
  }

  async groupBy<T extends Prisma.Args<TModelName, 'groupBy'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'groupBy'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'groupBy'>> {
    return (this.model as any).groupBy(args);
  }
}
