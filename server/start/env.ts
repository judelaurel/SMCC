/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env';

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),
  FRONTEND_URL: Env.schema.string({ format: 'url', tld: false }),

  // DATABASE
  DATABASE_URL: Env.schema.string(),

  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  DB_SCHEMA: Env.schema.string.optional(),

  // Redis
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Ollama AI
  OLLAMA_BASE_URL: Env.schema.string({ format: 'url', tld: false }),
  OLLAMA_MODEL: Env.schema.string(),
  OLLAMA_API_KEY: Env.schema.string.optional(),

  // Mastodon OAuth
  MASTODON_INSTANCE: Env.schema.string.optional(),
  MASTODON_CLIENT_ID: Env.schema.string.optional(),
  MASTODON_CLIENT_SECRET: Env.schema.secret.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring @adonisjs/queue
  |----------------------------------------------------------
  */
  QUEUE_DRIVER: Env.schema.enum(['redis', 'database', 'sync'] as const),
});
