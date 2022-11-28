import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

import { MoleculeInfo } from '../MoleculeInfo';

import { getInfoFromMolecule } from './getInfoFromMolecule';

const debug = debugLibrary('getInfoFromSmiles');
let currentlyOpen = 0;

export function getInfoFromSmiles(smiles: string): Promise<MoleculeInfo> {
  debug(smiles);
  currentlyOpen++;
  const molecule = Molecule.fromSmiles(smiles);
  currentlyOpen--;
  debug('Currently open: ' + currentlyOpen);
  return getInfoFromMolecule(molecule);
}
