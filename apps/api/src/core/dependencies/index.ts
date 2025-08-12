import { PrismaClient } from '@repo/database/generated/client';

import { registerAllEventListeners } from '../events/listeners';
import { createRepositories, Repositories } from './repositories';
import { createServices, Services } from './services';

/**
 * Initializes and wires up all application dependencies.
 *
 * This is the main entry point for dependency injection in the application.
 * It follows a clear, three-step process:
 * 1. Create the data repositories.
 * 2. Create the business services, injecting the repositories.
 * 3. Register all event listeners, injecting the services.
 * @param {PrismaClient} db The PrismaClient instance for database access.
 * @returns {object} An object containing the initialized repositories and services.
 */
export const initializeDependencies = (db: PrismaClient) => {
  const repositories: Repositories = createRepositories(db);
  const services: Services = createServices(repositories);

  registerAllEventListeners(services);

  return { repositories, services };
};
