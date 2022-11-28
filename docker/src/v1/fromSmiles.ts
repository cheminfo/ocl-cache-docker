import debugLibrary from 'debug';
import { FastifyRequest, FastifyReply } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import { getInfoFromSmiles } from '../db/getInfoFromSmiles';

const debug = debugLibrary('getInfoFromSmiles');
let currentlyOpen = 0;
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
  try {
    currentlyOpen++;
    const result = await getInfoFromSmiles(body.smiles);
    currentlyOpen--;
    debug('currentlyOpen', currentlyOpen);
    return await response.send({ result });
  } catch (e: any) {
    debug(`Error: ${e.stack}`);
    return response.send({ result: {}, log: e.toString() });
  }
}
