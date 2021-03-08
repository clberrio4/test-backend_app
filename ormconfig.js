module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: 'dev',
  password: 'Secret1234',
  database: 'test',

  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: ['build/models/**/*.js'],

  migrations: ['build/migration/**/*.js'],
  subscribers: ['build/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
