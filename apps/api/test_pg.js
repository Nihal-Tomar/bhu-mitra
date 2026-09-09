const mod = require('embedded-postgres');
const EmbeddedPostgres = mod.default ?? mod;
const path = require('path');

const pg = new EmbeddedPostgres({
  databaseDir: path.join(__dirname, 'data', 'db'),
  port: 54329,
  user: 'postgres',
  password: 'password',
  persistent: true,
});

async function run() {
  await pg.start();
  console.log('Postgres started');
  const client = pg.getPgClient('postgres');
  await client.connect();

  const roleCheck = await client.query("SELECT 1 FROM pg_roles WHERE rolname = 'bhumitra'");
  if (roleCheck.rows.length === 0) {
    await client.query("CREATE ROLE bhumitra WITH LOGIN SUPERUSER PASSWORD 'bhumitra_secure_dev'");
    console.log('Role bhumitra created');
  }

  const dbCheck = await client.query("SELECT 1 FROM pg_database WHERE datname = 'bhumitra'");
  if (dbCheck.rows.length === 0) {
    await client.query("CREATE DATABASE bhumitra OWNER bhumitra");
    console.log('Database bhumitra created');
  }

  await client.end();
  console.log('DB and Role ready!');
  await pg.stop();
}

run().catch(console.error);
