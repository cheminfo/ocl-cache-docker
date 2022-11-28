import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import sqLite, { Database } from 'better-sqlite3';

let db: Database;

export default function getDB(): Database {
  if (!db) {
    const path = join(__dirname, '../../sqlite/');
    if (!existsSync(path)) {
      mkdirSync(path);
    }
    db = sqLite(join(path, 'db.sqlite'));
    // https://www.sqlite.org/wal.html
    // Activating WAL mode allows to get a speed improvement of 100x !!!
    db.pragma('journal_mode = WAL');
  }

  const sql = `
CREATE TABLE IF NOT EXISTS molecules (
  idCode data_type PRIMARY KEY,
  mf data_type TEXT,
  em data_type REAL,
  mw data_type REAL,
  charge data_type INT,
  noStereoID data_type TEXT,
  noStereoTautomerID data_type TEXT,
  logS data_type REAL,
  nbFragments data_type INT,
  logP data_type REAL,
  acceptorCount data_type INT,
  donorCount data_type INT,
  rotatableBondCount data_type INT,
  stereoCenterCount data_type INT,
  polarSurfaceArea data_type REAL,
  ssIndex data_type BLOB
);
`;

  db.exec(sql);
  return db;
}
