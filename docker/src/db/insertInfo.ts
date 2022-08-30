import { Database, Statement } from 'better-sqlite3';

import { MoleculeInfo } from '../MoleculeInfo';

let stmt: Statement;

export function insertInfo(info: MoleculeInfo, db: Database) {
  if (!stmt) {
    stmt = db.prepare(
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @noStereoID, @noStereoTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @ssIndex)',
    );
  }
  try {
    stmt.run(info);
  } catch (e) {
    console.log(`idCode already exists in the database: ${info.idCode}`);
  }
}
