import MFParser from 'mf-parser';
import OCL from 'openchemlib';
import workerpool from 'workerpool';

const { MF } = MFParser;

async function improve(molecule, mf) {
  const mol = OCL.Molecule.fromIDCode(molecule);
  const mfInfo = new MF(mf).getInfo();
  let unsaturation = mfInfo.unsaturation;
  let atom = JSON.stringify(mfInfo.atoms);
  let fragmentMap = [];
  let nbFragmentss = mol.getFragmentNumbers(fragmentMap, false, false);
  let result = {
    nbFragments: nbFragmentss,
    unsaturation,
    atoms: atom,
  };
  return result;
}

workerpool.worker({
  improve,
});
