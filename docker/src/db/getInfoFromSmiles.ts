import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

import { MoleculeInfo } from '../MoleculeInfo';

import { getInfoFromMolecule } from './getInfoFromMolecule';

const debug = debugLibrary('getInfoFromSmiles');
export function getInfoFromSmiles(smiles: string): Promise<MoleculeInfo> {
  debug(smiles);
  const molecule = Molecule.fromSmiles(smiles);
  return getInfoFromMolecule(molecule);
}
