import debugLibrary from 'debug';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { FastifyInstance } from 'fastify/types/instance';

import getDB, { DB } from '../db/getDB';
import { getInfoFromSmiles } from '../db/getInfoFromSmiles';

const debug = debugLibrary('getInfoFromSmiles');

export default function fromSmiles(fastify: FastifyInstance) {
  fastify.get(
    '/v1/fromSmiles',
    {
      schema: {
        summary: 'Retrieve information from a SMILES',
        description: '',
        querystring: {
          smiles: {
            type: 'string',
            description: 'SMILES',
          },
        },
      },
    },
    getInfo,
  );
}

async function getInfo(request: FastifyRequest, response: FastifyReply) {
  const body: any = request.query;
  const db = await getDB();
  try {
    const result = await getInfoFromSmiles(body.smiles, db);
    return await response.send({ result });
  } catch (error: any) {
    debug(`Error: ${error.stack}`);
    return response.send({ result: {}, log: error.toString() });
  }
}
