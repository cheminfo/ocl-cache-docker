import massTools from "mass-tools";
import OpenChemLib from "openchemlib";
import { getMF } from "openchemlib-utils";

const { MF } = massTools;
const { Molecule, MoleculeProperties } = OpenChemLib;

export function calculateMoleculeInfo(molecule) {
  const info = {};

  const mf = getMF(molecule);
  const mfInfo = new MF(mf.mf).getInfo();

  info.mf = mfInfo.mf;
  info.mw = mfInfo.mass;
  info.em = mfInfo.monoisotopicMass;

  info.idCode = molecule.getIDCode();
  info.noStereoID = getNoStereoIDCode(molecule);
  info.noStereoTautomerID = getNoStereoTautomerIDCode(molecule);

  appendProperties(molecule, info);

  info.ssIndex = getSSIndex(molecule);

  return info;
}

function getNoStereoIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(molecule, OCL.CanonizerUtil.NOSTEREO);
}

function getNoStereoTautomerIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(
    molecule,
    OCL.CanonizerUtil.NOSTEREO_TAUTOMER
  );
}

function getSSIndex(molecule) {
  return Buffer.from(Uint32Array.from(molecule.getIndex()).buffer);
}

function appendProperties(molecule, info) {
  const moleculeProperties = new MoleculeProperties(molecule);
  let fragmentMap = [];
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
