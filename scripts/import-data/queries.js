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
*  Functions
/* ========================================== */

function sanitize(str) {
    return str.split('"').join('');
}

function cleanName(str) {
    return str
        .split(' ')
        .join('')
        .split(':')
        .join('')
        .split('-')
        .join('')
        .split('#')
        .join('');
}

function unixToIso(date) {
    return new Date(Number(date * 1000)).toISOString();
}

/* ==========================================
*  Functional Query Helpers
/* ========================================== */

/**
 * Queries the GraphQL Database to find existing entries
 * @param {String} node - Name of the node to query
 * @param {Array.<String>} properties - List of properties to query for
 */
const queryExisting = async (node, properties = []) => {
    // Get count first
    const countQuery = `
        query {
            _all${node}sMeta {
                count
            }
        }
    `;
    const countResponse = await client.request(countQuery, {});
    const { count } = countResponse[`_all${node}sMeta`];
    let results = [];
    for (let i = 0; i < Math.ceil(count / 1000); i += 1) {
        const query = `
            query all${node}s(
                $skipNum: Int!
            ) {
                all${node}s(
                    first: 1000
                    skip: $skipNum
                ) {
                    id
                    ${properties.join('\n')}
                }
            }
        `;
        const skipNum = 1000 * i;
        const response = await client.request(query, { skipNum });
        results = results.concat(response[`all${node}s`]);
    }

    return results;
};

/* ==========================================
*  Maps
/* ========================================== */

const maps = {
    circuitNameToId: {},
    playerSmashIdToId: {},
    tournamentSmashIdToId: {},
    bracketGroupSmashIdToId: {},
    bracketSmashIdToId: {},
    setSmashIdToId: {},
    selectionValueToCharacterEnum: {
        187: 'Kragg',
        189: 'Maypul',
        185: 'Orcane',
        190: 'Absa',
        191: 'Etalus',
        186: 'Wrastor',
        184: 'Zetterburn',
        188: 'Forsburn'
    }
};

function setupMapFromResponse(response, mapName, propLeft, propRight) {
    for (const list of response) {
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                maps[mapName][list[key][propLeft]] = list[key][propRight];
            }
        }
    }
}

// This is the only map that needs to be setup manually
async function setupCircuitsMap() {
    const result = await queryExisting('Circuit', ['name']);
    for (const obj of result) {
        maps.circuitNameToId[obj.name] = obj.id;
    }
}
async function setupPlayersMap() {
    const result = await queryExisting('Player', ['smashId']);
    for (const obj of result) {
        maps.playerSmashIdToId[obj.smashId] = obj.id;
    }
}
(async function() {
    await setupCircuitsMap();
    await setupPlayersMap();
})();

/* ==========================================
*  Queries
/* ========================================== */

const createCircuitsQuery = async circuits => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(circuits)
        .map(
            circuit => `
            k_${circuit.name.split(' ').join('')}: createCircuit(
                name: "${circuit.name}",
                url: ${circuit.url !== undefined ? `"${circuit.url}"` : null}
            ) { 
                id
                name
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    setupMapFromResponse(response, 'circuitNameToId', 'name', 'id');
    return response;
};

const createPlayersQuery = async players => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(players)
        .map(
            player => `
            k_${player.id}: createPlayer(
                teamName: ${player.prefix ? `"${sanitize(player.prefix)}"` : null}
                name: ${player.gamerTag ? `"${sanitize(player.gamerTag)}"` : null}
                state: ${player.state ? `"${player.state}"` : null}
                country: ${player.country ? `"${player.country}"` : null}
                realName: ${player.name ? `"${sanitize(player.name)}"` : null}
                smashId: ${player.id ? `"${player.id}"` : null}
                ratings: 1500
            ) { 
                smashId
                id 
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    setupMapFromResponse(response, 'playerSmashIdToId', 'smashId', 'id');
};

const createTournamentsQuery = async tournaments => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(tournaments)
        .map(
            tournament => `
            k_${cleanName(tournament.name)}: createTournament(
                name: "${tournament.name}"
                url: ${tournament.url !== undefined ? `"${tournament.url}"` : null}
                smashId: "${tournament.id}"
                numberOfPlayers: ${tournament.players}
                date: "${unixToIso(tournament.date)}"
                circuitId: "${maps.circuitNameToId[tournament.circuit]}"
            ) { 
                smashId
                id 
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    setupMapFromResponse(response, 'tournamentSmashIdToId', 'smashId', 'id');
    return response;
};

const createBracketGroupsQuery = async bracketGroups => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(bracketGroups)
        .map(
            bracketGroup => `
            k_${bracketGroup.smashId}: createBracketGroup(
                smashId: "${bracketGroup.smashId}"
                label: ${bracketGroup.label !== undefined ? `"${bracketGroup.label}"` : null}
                tournamentId: "${maps.tournamentSmashIdToId[bracketGroup.tournament]}"
            ) { 
                smashId
                id 
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    setupMapFromResponse(response, 'bracketGroupSmashIdToId', 'smashId', 'id');
    return response;
};

const createBracketsQuery = async brackets => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(brackets)
        .map(
            bracket => `
            k_${bracket.smashId}: createBracket(
                smashId: "${bracket.smashId}"
                label: ${bracket.label !== undefined ? `"${bracket.label}"` : null}
                bracketGroupId: "${maps.bracketGroupSmashIdToId[bracket.bracketGroupId]}"
            ) { 
                smashId
                id 
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    setupMapFromResponse(response, 'bracketSmashIdToId', 'smashId', 'id');
    return response;
};

const createSetsQuery = async sets => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(sets)
        .map(
            set => `
            k_${set.smashId}: createSet(
                smashId: "${set.smashId}"
                bracketId: "${maps.bracketSmashIdToId[set.bracketId]}"
                winnerId: "${maps.playerSmashIdToId[set.winnerId]}"
                loserId: "${maps.playerSmashIdToId[set.loserId]}"
                ratingsWinnerOld: ${set.winnerOldPoints}
                ratingsLoserOld: ${set.loserOldPoints}
                ratingsWinnerNew: ${set.winnerNewPoints}
                ratingsLoserNew: ${set.loserNewPoints}
                ratingsChangeWinner: ${set.winnerPointsDelta}
                ratingsChangeLoser: ${set.loserPointsDelta}
                winnerScore: ${set.winnerScore}
                loserScore: ${set.loserScore}
                date: "${unixToIso(set.date)}"
                label: ${set.label !== undefined ? `"${set.label}"` : null}
            ) { 
                smashId
                id 
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    setupMapFromResponse(response, 'setSmashIdToId', 'smashId', 'id');
    return response;
};

const createMatchesQuery = async matches => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(matches)
        .map(
            match => `
            k_${match.smashId}: createMatch(
                smashId: "${match.smashId}"
                setId: "${maps.setSmashIdToId[match.setId]}"
                winnerId: "${maps.playerSmashIdToId[match.winnerId]}"
                loserId: "${maps.playerSmashIdToId[match.loserId]}"
                gameNumber: ${match.number}
                date: "${unixToIso(match.date)}"
                winnerCharacter: ${
                    match.winnerCharacter !== undefined
                        ? `"${maps.selectionValueToCharacterEnum[match.winnerCharacter]}"`
                        : null
                }
                loserCharacter: ${
                    match.loserCharacter !== undefined
                        ? `"${maps.selectionValueToCharacterEnum[match.loserCharacter]}"`
                        : null
                }
            ) { 
                smashId
                id 
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    return response;
};

const updatePlayerRatingsQuery = async playerRatings => {
    const BATCH_SIZE = 50;
    const mutations = _.chain(playerRatings)
        .map(
            playerRating => `
            k_${playerRating.id}: updatePlayer(
                id: "${maps.playerSmashIdToId[playerRating.id]}"
                ratings: ${playerRating.ratings}
                rd: ${playerRating.rd}
                vol: ${playerRating.vol}
            ) { 
                id 
            }
        `
        )
        .chunk(BATCH_SIZE)
        .map(
            chunk => `
            mutation {
                ${chunk.join('\n')}
            }
        `
        )
        .value();

    const response = await Bluebird.map(mutations, mutation => client.request(mutation), {
        concurrency: 2
    });
    return response;
};

export {
    queryExisting,
    createCircuitsQuery,
    createTournamentsQuery,
    createPlayersQuery,
    createBracketGroupsQuery,
    createBracketsQuery,
    createSetsQuery,
    createMatchesQuery,
    updatePlayerRatingsQuery
};
