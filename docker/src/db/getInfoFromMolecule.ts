import { Statement } from 'better-sqlite3';
import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import { MoleculeInfo } from '../MoleculeInfo';

import getDB from './getDB';
import { insertMolecule } from './insertMolecule';

const debug = debugLibrary('getInfoFromMolecule');

let stmt: Statement;
let currentlyOpen = 0;
export async function getInfoFromMolecule(
  molecule: Molecule,
): Promise<MoleculeInfo> {
  currentlyOpen++;
  const db = getDB();
  const idCode = molecule.getIDCode();
  if (!stmt) {
    stmt = db.prepare('SELECT * FROM molecules WHERE idCode = ?');
  }
  const result = stmt.get(idCode);
  if (result) {
    debug('in cache');
    currentlyOpen--;
    debug('Currently open: ' + currentlyOpen);
    return improve(result);
  }

  const secondResult = await improve(await insertMolecule(idCode, db));
  currentlyOpen--;
  debug('Currently open: ' + currentlyOpen);
  return secondResult;
}

function improve(data: InternalMoleculeInfo): MoleculeInfo {
  return { ...data, ssIndex: Array.from(new Uint32Array(data.ssIndex)) };
}
