import { Database, Statement } from 'better-sqlite3';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise';

let stmt: Statement;

export async function insertMolecule(
  molecule: string,
  db: Database,
): Promise<InternalMoleculeInfo> {
  if (!stmt) {
    stmt = db.prepare(
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @charge, @noStereoID, @noStereoTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @ssIndex, @nbFragments, @unsaturation, @atom)',
    );
  }

  const { promise } = await calculateMoleculeInfoFromIDCodePromise(molecule);
  const info = await promise;
  stmt.run(info);
  return info;
}
