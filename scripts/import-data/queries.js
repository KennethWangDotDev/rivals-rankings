/* ==========================================
*  Dependencies
/* ========================================== */

const { GraphQLClient } = require('graphql-request');
const Bluebird = require('bluebird');
const _ = require('lodash');

/* ==========================================
*  GraphQL Setup
/* ========================================== */

const headers = {
    // if needed, inject a PAT
    // 'Authorization': 'Bearer __PERMANENT_AUTH_TOKEN__'
};

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjayp5fez0muk01079d7kgknr', {
    headers
});

/* ==========================================
*  Functional Query Helpers
/* ========================================== */

/**
 * Queries the GraphQL Database to find existing entries
 * @param {String} node - Name of the node to query
 * @param {Array.<String>} properties - List of properties to query for
 */
const queryExisting = async (node, properties = []) => {
    const query = `
        query {
            all${node}s {
                id
                ${properties.join('\n')}
            }
        }
  `;

    const response = await client.request(query, {});
    return response[`all${node}s`];
};

/* ==========================================
*  Queries
/* ========================================== */

const createCircuitsQuery = async (circuits) => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(circuits)
        .map(circuit => `
            k_${circuit.name.split(' ').join('')}: createCircuit(
                name: "${circuit.name}",
                url: ${circuit.url !== undefined ? `"${circuit.url}"` : null}
            ) { 
                id 
            }
        `)
        .chunk(BATCH_SIZE)
        .map(chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `)
        .value();

    await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
};

const createTournament = async (tournaments) => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(tournaments)
        .map(tournament => `
            k_${tournament.name.split(' ').join('')}: createTournament(
                name: "${tournament.name}",
                url: ${tournament.url !== undefined ? `"${tournament.url}"` : null}
            ) { 
                id 
            }
        `)
        .chunk(BATCH_SIZE)
        .map(chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `)
        .value();

    await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
};

export { queryExisting, createCircuitsQuery, createTournament };
