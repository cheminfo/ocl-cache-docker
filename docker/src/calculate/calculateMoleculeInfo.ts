import debugLibrary from 'debug';
//@ts-expect-error ignore lack of declaration
import { MF } from 'mass-tools';
import { Molecule, MoleculeProperties } from 'openchemlib';
//@ts-expect-error ignore lack of declaration
import { getMF } from 'openchemlib-utils';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

const debug = debugLibrary('calculateMoleculeInfo');

export default function calculateMoleculeInfo(
  molecule: Molecule,
  options: { ignoreTautomer?: boolean } = {},
): InternalMoleculeInfo {
  //@ts-expect-error ignore lack of declaration
  const info: InternalMoleculeInfo = {};
  const { ignoreTautomer = false } = options;

  const mf = getMF(molecule).parts.sort().join('.');

  const mfInfo = new MF(mf).getInfo();

  info.mf = mfInfo.mf;
  info.mw = mfInfo.mass;
  info.em = mfInfo.monoisotopicMass;
  info.charge = mfInfo.charge;

  info.idCode = molecule.getIDCode();
  info.noStereoID = getNoStereoIDCode(molecule);

  let small = true;
  if (mfInfo.atoms) {
    if (mfInfo.atoms.C > 50) small = false;
  } else if (mfInfo.parts) {
    for (const part of mfInfo.parts) {
      if (part.atoms.C > 50) small = false;
    }
  }

  if (small) {
    if (ignoreTautomer) {
      debug(`Ignore tautomer: ${mfInfo.mf}`);
      info.noStereoTautomerID = info.noStereoID;
    } else {
      info.noStereoTautomerID = getNoStereoTautomerIDCode(molecule);
    }
  } else {
    debug(`Too big: ${mfInfo.mf}`);
    info.noStereoTautomerID = info.noStereoID;
  }

  appendProperties(molecule, info);

  info.ssIndex = getSSIndex(molecule);

  return info;
}

function getNoStereoIDCode(molecule: Molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(molecule, OCL.CanonizerUtil.NOSTEREO);
}

function getNoStereoTautomerIDCode(molecule: Molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(
    molecule,
    OCL.CanonizerUtil.NOSTEREO_TAUTOMER,
  );
}

function getSSIndex(molecule: Molecule) {
  return Buffer.from(Uint32Array.from(molecule.getIndex()).buffer);
}

function appendProperties(molecule: Molecule, info: InternalMoleculeInfo) {
  const moleculeProperties = new MoleculeProperties(molecule);
  let fragmentMap: never[] = [];
  let nbFragments = molecule.getFragmentNumbers(fragmentMap, false, false);
  info.logS = moleculeProperties.logS;
  info.logP = moleculeProperties.logP;
  info.nbFragments = nbFragments;
  info.acceptorCount = moleculeProperties.acceptorCount;
  info.donorCount = moleculeProperties.donorCount;
  info.rotatableBondCount = moleculeProperties.rotatableBondCount;
  info.stereoCenterCount = moleculeProperties.stereoCenterCount;
  info.polarSurfaceArea = moleculeProperties.polarSurfaceArea;
}
