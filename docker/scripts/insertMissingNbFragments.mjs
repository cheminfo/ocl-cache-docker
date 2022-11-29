import debugLibrary from 'debug';
import OCL from 'openchemlib';

// insert missing fragments in the database sqlite molecules table
import getDB from '../src/db/getDB.js';

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

await insertMissingNbFragments();
