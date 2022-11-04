import { readdirSync, statSync, readFileSync } from 'fs';
import { join, basename } from 'path';

/*
  This script is capable of searching for multiple schema.prisma files
  that each refer to different databases hosted on the same server, 
  extracting the environment variable and database name from each, and 
  assigning an appropriate connection string to each database's 
  environment variable before finally starting the application server 
  and loading each respective prisma client.

  For this to work as expected, ONE environment variable must be set:
  DB_BASE_URI

  If it is not, the default of postgres://postgres:postgres@database:5432
  is chosen.  If that default is not correct, be sure to set the env var!
*/

const getAllFiles = (dirPath, filesList = []) => {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    if (statSync(join(dirPath, file)).isDirectory()) {
      filesList = getAllFiles(join(dirPath, file), filesList);
    } else {
      filesList.push(join(dirPath, file));
    }
  });

  return filesList;
};

const extractDbNameUrl = (file) => {
  const db = {
    name: '',
    envVar: '',
  };
  const content = readFileSync(file).toString();
  content.split(/\r?\n/).forEach((line) => {
    if (line.match(/^\s+output\s+=/)) {
      db.name = line.split('/').reverse()[0].replace('"', '');
    }
    if (line.match(/^\s+url\s+=/)) {
      db.envVar = line
        .split('')
        .filter((x) => x.match(/[A-Z_]/))
        .join('');
    }
  });
  return db;
};

const defaultDbBaseUri = 'postgres://postgres:postgres@database:5432';
const dbBaseURI = process.env.DB_BASE_URI || defaultDbBaseUri;
const databaseUris = getAllFiles(process.cwd())
  .filter((x) => basename(x) === 'schema.prisma')
  .reduce((acc, db) => {
    const d = extractDbNameUrl(db);
    acc[d.envVar] = dbBaseURI.concat('/', d.name);
    return acc;
  }, {});

export const apps = [
  {
    name: 'api',
    script: 'yarn',
    args: 'start',
    error_file: '/dev/stderr',
    out_file: '/dev/stdout',
    env: {
      ...process.env,
      ...databaseUris,
    },
  },
];
