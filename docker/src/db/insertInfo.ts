import { Database, Statement } from 'better-sqlite3';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

let stmt: Statement;

export function insertInfo(info: InternalMoleculeInfo, db: Database) {
  if (!stmt) {
    stmt = db.prepare(
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @charge, @noStereoID, @noStereoTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @ssIndex, @nbFragments)',
    );
  }
  try {
    stmt.run(info);
  } catch (e) {
    console.log(`idCode already exists in the database: ${info.idCode}`);
  }
}
