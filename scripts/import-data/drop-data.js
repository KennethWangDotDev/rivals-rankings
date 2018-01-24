const { GraphQLClient } = require('graphql-request');

const headers = {
    // if needed, inject a PAT
    // 'Authorization': 'Bearer __PERMANENT_AUTH_TOKEN__'
};

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjayp5fez0muk01079d7kgknr', {
    headers
});

const query = T => `
  query Get${T}s {
    all${T}s {
      id
    }
  }
`;

const toIds = array => array.map(e => e.id);

const getAll = async T => {
    const res = await client.request(query(T));
    return toIds(res[`all${T}s`]);
};

const queryEs = T => `
query Get${T}es {
  all${T}es {
    id
  }
}
`;

const getAllEs = async T => {
    const res = await client.request(queryEs(T));
    return toIds(res[`all${T}es`]);
};

const del = async (T, accounts) => {
    await Promise.all(
        accounts.map(id => {
            const delQuery = `
      mutation Delete${T}($id: ID!) {
        delete${T}(id: $id) {
          id
        }
      }
    `;
            const variables = {
                id
            };
            return client.request(delQuery, variables);
        })
    );
};

const detroyAllDataIn = async T => {
    const allAccounts = await getAll(T);
    await del(T, allAccounts);
    console.log(`Deleted: ${allAccounts.length} ${T}s`);
};

const detroyAllDataInEs = async T => {
    const allAccounts = await getAllEs(T);
    await del(T, allAccounts);
    console.log(`Deleted: ${allAccounts.length} ${T}s`);
};

async function main() {
    await Promise.all([
        detroyAllDataIn('Bracket'),
        detroyAllDataIn('BracketGroup'),
        detroyAllDataIn('Tournament'),
        detroyAllDataIn('Set'),
        detroyAllDataIn('Player'),
        detroyAllDataInEs('Match')
        // Add more
    ]);
}

main().catch(e => console.error(e));
