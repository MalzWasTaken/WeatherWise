// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'sae23fnu',
      user:     'sae23fnu',
      password: 'BeforeAgoBefore!65',
      host:     'cmpstudb-01.cmp.uea.ac.uk',
      port: 5432,
      searchPath:['knex', 'public']
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
    directory: './seeds'
  }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'sae23fnu',
      user:     'sae23fnu',
      password: 'BeforeAgoBefore!65',
      host:     'cmpstudb-01.cmp.uea.ac.uk',
      port:     5432
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'sae23fnu',
      user:     'sae23fnu',
      password: 'BeforeAgoBefore!65',
      host:     'cmpstudb-01.cmp.uea.ac.uk',
      port:     5432
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
