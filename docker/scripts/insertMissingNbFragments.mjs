import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import sqLite from 'better-sqlite3';
import debugLibrary from 'debug';
import OCL from 'openchemlib';

const debug = debugLibrary('insertMissingNbFragments');

export default async function insertMissingNbFragments() {
  const db = getDB();
  // get all molecules from table molecules
  const molecules = await db.all('SELECT * FROM molecules');
  let start = Date.now();
  let count = 0;
  for (const molecule of molecules) {
    const { idCode } = molecule;
    const mol = OCL.Molecule.fromIDCode(idCode);
    let fragmentMap = [];
    let nbFragments = mol.getFragmentNumbers(fragmentMap, false, false);
    if (Date.now() - start > 10000) {
      debug(`processed ${count} molecules`);
      start = Date.now();
    }
    await db.run('UPDATE molecules SET nbFragments = ? WHERE id = ?', [
      nbFragments,
      idCode,
    ]);
  }
}

export function getDB() {
  let db;
  // get __dirname
  const __dirname = new URL('.', import.meta.url).pathname;
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

await insertMissingNbFragments();
