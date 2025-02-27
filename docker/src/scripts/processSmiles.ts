import { renameSync } from 'fs';
import { join } from 'path';

import debugLib from 'debug';

import { FileCollection } from 'file-collection';
import { appendSmiles } from '../index.ts';
import getDB from '../db/getDB.ts';

const debug = debugLib('processSmiles');

const fileCollection = new FileCollection();
fileCollection.appendPath(join(import.meta.dirname, '../smiles/to_process'));

const db = await getDB();

for (const file of fileCollection) {
  debug(`Importing: ${file.name}`);
  console.time(`Importing: ${file.name}`);
  const text = await file.text();
  await appendSmiles(text, db);
  const filename = file.relativePath.replace(/\.zip\/.*$/, '.zip');
  renameSync(filename, filename.replace('to_process', 'processed'));
  console.timeEnd(`Importing: ${file.name}`);
}
