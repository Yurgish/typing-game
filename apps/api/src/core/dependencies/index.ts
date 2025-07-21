import { PrismaClient } from '@repo/database/generated/client';

import { registerAllEventListeners } from '../events/listeners';
import { createRepositories, Repositories } from './repositories';
import { createServices, Services } from './services';

export const initializeDependencies = (db: PrismaClient) => {
  const repositories: Repositories = createRepositories(db);
  const services: Services = createServices(repositories);

  registerAllEventListeners(services);

  return { repositories, services };
};
