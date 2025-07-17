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

export interface IBaseRepository<TModelName extends ModelName, TReturn> {
  // FIND OPERATIONS
  findMany(args?: Prisma.Args<TModelName, 'findMany'>): Promise<TReturn[]>;
  findUnique(args: Prisma.Args<TModelName, 'findUnique'>): Promise<TReturn | null>;
  findFirst(args?: Prisma.Args<TModelName, 'findFirst'>): Promise<TReturn | null>;

  // CREATE OPERATIONS
  create(args: Prisma.Args<TModelName, 'create'>): Promise<TReturn>;
  createMany(args: Prisma.Args<TModelName, 'createMany'>): Promise<Prisma.BatchPayload>;

  // UPDATE OPERATIONS
  update(args: Prisma.Args<TModelName, 'update'>): Promise<TReturn>;
  updateMany(args: Prisma.Args<TModelName, 'updateMany'>): Promise<Prisma.BatchPayload>;
  upsert(args: Prisma.Args<TModelName, 'upsert'>): Promise<TReturn>;

  // DELETE OPERATIONS
  delete(args: Prisma.Args<TModelName, 'delete'>): Promise<TReturn>;
  deleteMany(args?: Prisma.Args<TModelName, 'deleteMany'>): Promise<Prisma.BatchPayload>;

  // AGGREGATION/COUNT
  count(args?: Prisma.Args<TModelName, 'count'>): Promise<number>;
  aggregate<T extends Prisma.Args<TModelName, 'aggregate'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'aggregate'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'aggregate'>>;
  groupBy<T extends Prisma.Args<TModelName, 'groupBy'>>(
    args: Prisma.Exact<T, Prisma.Args<TModelName, 'groupBy'>>
  ): Promise<Prisma.Result<PrismaClient[TModelName], T, 'groupBy'>>;
}
