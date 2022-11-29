import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import sqLite from 'better-sqlite3';
import debugLibrary from 'debug';
import MFParser from 'mf-parser';
import OCL from 'openchemlib';

const { MF } = MFParser;

export default async function insertMissingNbFragments() {
  const db = getDB();
  db.unsafeMode(true);
  // iterate all the molecules in the database and check if they have a nbFragments
  const molecules = db.prepare('SELECT * FROM molecules');
  let start = Date.now();
  let counter = 0;

  for (const molecule of molecules.iterate()) {
    const { idCode, mf } = molecule;
    const mol = OCL.Molecule.fromIDCode(idCode);
    const mfInfo = new MF(mf).getInfo();
    let unsaturation = mfInfo.unsaturation;
    let atom = JSON.stringify(mfInfo.atoms);
    let fragmentMap = [];
    let nbFragments = mol.getFragmentNumbers(fragmentMap, false, false);
    if (Date.now() - start > 10000) {
      console.log(`processed ${counter} molecules`);
      start = Date.now();
    }
    counter++;
    // insert the nbFragments, unsaturation and atom in the corresponding idCode
    db.prepare(
      'UPDATE molecules SET nbFragments = ?, unsaturation = ?, atoms = ?  WHERE idCode = ?',
    ).run(nbFragments, unsaturation, atom, idCode);
  }
}
export function getDB() {
  let db;
  // get __dirname
  const __dirname = new URL('.', import.meta.url).pathname;
  if (!db) {
    db = sqLite(join(__dirname, 'db.sqlite'));
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
    unsaturation data_type INT,
    atoms data_type TEXT,
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
