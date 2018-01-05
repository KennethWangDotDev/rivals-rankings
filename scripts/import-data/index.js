/* ==========================================
*  Dependencies & Setup
/* ========================================== */

import {
    createCircuitsQuery,
    createPlayersQuery,
    queryExisting,
    createTournamentsQuery,
    createBracketGroupsQuery,
    createBracketsQuery,
    createMatchesQuery,
    createSetsQuery,
    updatePlayerRatingsQuery
} from './queries';

const fs = require('fs');
const got = require('got');
const path = require('path');
const glicko2 = require('glicko2');

const circuitsPath = path.resolve(__dirname, './circuits.json');
const tournamentsPath = path.resolve(__dirname, './tournaments.json');

// Glicko Settings
const glickoSettings = {
    tau: 0.5,
    rating: 1500,
    rd: 200,
    vol: 0.06
};
const glickoRankings = new glicko2.Glicko2(glickoSettings);

/* ==========================================
*  Functions
/* ========================================== */

/**
 * Takes in a smash.gg event url and outputs the proper API endpoint
 * @example
 * // returns 'https://api.smash.gg/tournament/road-to-shine-rivals/event/
 * // qualifier-2-june-10th?expand[]=phase&expand[]=groups&expand[]=event'
 * // (line break for readibility)
 * eventUrlToApiEndpoint('https://smash.gg/tournament/road-to-shine-rivals/events/qualifier-2-june-10th/')
 * @param {String} url
 */
function eventUrlToApiEndpoint(url) {
    return url
        .split('smash.gg')
        .join('api.smash.gg')
        .split('/events/')
        .join('/event/');
}

/**
 * Takes an array of objects and returns an array with data from only a single property
 * @param {Array.<Object>} object
 * @param {String} property
 */
function objectPropToArray(object, property) {
    const array = object.reduce((a, b) => {
        a.push(b[property]);
        return a;
    }, []);
    return array;
}

/**
 * Takes in an array of objects, queries the GraphQL database,
 * and outputs an array of objects that are not present in the DB
 * @param {Array.<Object>} jsonArray - Array of objects
 * @param {String} node - The node to check against
 * @param {String} key - Key to check against
 */
async function toAdd(jsonArray, node, key) {
    const existing = await queryExisting(node, [key]);
    const filteredArray = jsonArray.filter(one => !objectPropToArray(existing, key).includes(one[key]));
    return filteredArray;
}

function compareByDate(a, b) {
    if (a.updatedAt < b.updatedAt) {
        return -1;
    }
    if (a.updatedAt > b.updatedAt) {
        return 1;
    }
    return 0;
}

async function createCircuits(circuits) {
    const query = await createCircuitsQuery(circuits);
    return query;
}

async function createTournaments(tournaments) {
    const query = await createTournamentsQuery(tournaments);
    return query;
}

async function createBracketGroups(bracketGroups) {
    const query = await createBracketGroupsQuery(bracketGroups);
    return query;
}

async function createBrackets(brackets) {
    const query = await createBracketsQuery(brackets);
    return query;
}

async function createSets(sets) {
    const query = await createSetsQuery(sets);
    return query;
}

async function createMatches(matches) {
    const query = await createMatchesQuery(matches);
    return query;
}

// This isnt working properly and needs to be fixed
// Ralph is at 1500 for some reason
async function updatePlayerRatings(glickoPlayers) {
    const playerRatings = [];
    for (const key in glickoPlayers) {
        if (glickoPlayers.hasOwnProperty(key)) {
            const playerInfo = glickoPlayers[key];
            const obj = {
                id: key,
                ratings: Math.ceil(playerInfo.getRating()),
                rd: playerInfo.getRd(),
                vol: playerInfo.getVol()
            };
            playerRatings.push(obj);
        }
    }
    const query = await updatePlayerRatingsQuery(playerRatings);
    return query;
}

/**
 * In the Smash.GG API, the entrant_id and player_id are different.
 * entrant_id is localized to the tournament while player_id is global
 * This function returns an object with every player's entrant_id mapped to their player_id
 * @param {String} url - Event URL
 */
async function mapEntrantIdToPlayerId(url, page = 1, map = {}) {
    const response = await got(
        eventUrlToApiEndpoint(url).concat(`/standings?entityType=event&expand[]=entrants&mutations[]=playerData&page=${page}&per_page=100`),
        {
            json: true
        }
    );
    if (
        response.body.items &&
        response.body.items.entities &&
        response.body.items.entities.entrants
    ) {
        for (const player of response.body.items.entities.entrants) {
            map[player.id] = player.mutations.players[Object.keys(player.mutations.players)[0]];
        }
        return mapEntrantIdToPlayerId(url, page + 1, map);
    }
    return map;
}

/**
 * Converts a single entrant_id to player_id using existing map
 * @param {*} entrantId - entrant_id of player
 * @param {*} map - The entrant_id to player_id map created by mapEntrantIdToPlayerId()
 */
function entrantIdToPlayerId(entrantId, map) {
    return map[entrantId].id;
}

async function fetchAllDataForTournaments(tournaments) {
    const tournamentArray = [];
    const bracketGroupArray = [];
    const bracketArray = [];
    const setArray = [];
    const matchArray = [];
    const glickoPlayers = {};
    for (const tournament of tournaments) {
        const thisTournament = {
            url: tournament.url,
            name: tournament.name,
            circuit: tournament.circuit
        };

        // Set up the players first
        const playersMap = await mapEntrantIdToPlayerId(tournament.url);
        thisTournament.players = Object.keys(playersMap).length;

        // Gets an array of existing player ids
        const existing = await queryExisting('Player', ['smashId', 'ratings', 'rd', 'vol']);
        const existingPlayerIds = objectPropToArray(existing, 'smashId');

        // Get which players to add to the database
        const playersToAdd = [];
        for (const entrantId in playersMap) {
            if (playersMap.hasOwnProperty(entrantId)) {
                if (!existingPlayerIds.includes(`${playersMap[entrantId].id}`)) {
                    playersToAdd.push(playersMap[entrantId]);
                    if (!glickoPlayers[playersMap[entrantId].id]) {
                        glickoPlayers[playersMap[entrantId].id] = glickoRankings.makePlayer(); // Glicko -- Adding new players
                    }
                }
            }
        }

        // Glicko -- Adding existing players
        for (const playerInfo of existing) {
            if (!glickoPlayers[playerInfo.smashId]) {
                glickoPlayers[playerInfo.smashId] = glickoRankings.makePlayer(
                    playerInfo.ratings,
                    playerInfo.rd,
                    playerInfo.vol
                );
            }
        }
        if (playersToAdd.length > 0) {
            console.log(`----------------Adding ${playersToAdd.length} new players...`);
        } else {
            console.log('----------------No new players added.');
        }

        // Execute players query
        await createPlayersQuery(playersToAdd);

        // -----------------------------------------------

        // Fetch tournament data
        const { url } = tournament;
        const eventResponse = await got(
            eventUrlToApiEndpoint(url).concat('?expand[]=phase&expand[]=groups&expand[]=event'),
            {
                json: true
            }
        );
        const event = eventResponse.body.entities;
        thisTournament.id = event.event.id;

        // Get list of bracket group
        for (const bracketGroup of event.phase) {
            bracketGroupArray.push({
                smashId: bracketGroup.id,
                label: bracketGroup.name,
                tournament: bracketGroup.eventId
            });
        }

        // Get list of brackets
        for (const bracket of event.groups) {
            bracketArray.push({
                bracketGroupId: bracket.phaseId,
                smashId: bracket.id,
                label: bracket.displayIdentifier
            });
            const bracketResponse = await got(
                `https://api.smash.gg/phase_group/${bracket.id}?expand[]=sets`,
                { json: true }
            );
            const { sets } = bracketResponse.body.entities;
            const setWithoutDQs = sets.filter(set =>
                set.entrant1Score !== -1 &&
                    set.entrant2Score !== -1 &&
                    set.entrant1Score !== null &&
                    set.entrant2Score !== null);
            setWithoutDQs.sort(compareByDate);

            for (const set of setWithoutDQs) {
                thisTournament.date = setWithoutDQs[0].updatedAt;
                // Glicko Update
                const glickoMatches = [];
                const winnerOldPoints = Math.ceil(glickoPlayers[entrantIdToPlayerId(set.winnerId, playersMap)].getRating());
                const loserOldPoints = Math.ceil(glickoPlayers[entrantIdToPlayerId(set.loserId, playersMap)].getRating());
                glickoMatches.push([
                    glickoPlayers[entrantIdToPlayerId(set.winnerId, playersMap)],
                    glickoPlayers[entrantIdToPlayerId(set.loserId, playersMap)],
                    1
                ]);
                glickoRankings.updateRatings(glickoMatches);
                const winnerNewPoints = Math.ceil(glickoPlayers[entrantIdToPlayerId(set.winnerId, playersMap)].getRating());
                const loserNewPoints = Math.ceil(glickoPlayers[entrantIdToPlayerId(set.loserId, playersMap)].getRating());
                const winnerPointsDelta = winnerNewPoints - winnerOldPoints;
                const loserPointsDelta = loserNewPoints - loserOldPoints;

                let winnerScore;
                let loserScore;
                if (set.entrant1Score >= set.entrant2Score) {
                    winnerScore = set.entrant1Score;
                    loserScore = set.entrant2Score;
                } else {
                    winnerScore = set.entrant2Score;
                    loserScore = set.entrant1Score;
                }

                setArray.push({
                    bracketId: set.phaseGroupId,
                    winnerId: entrantIdToPlayerId(set.winnerId, playersMap),
                    loserId: entrantIdToPlayerId(set.loserId, playersMap),
                    label: set.fullRoundText,
                    smashId: set.id,
                    loserScore,
                    winnerScore,
                    winnerOldPoints,
                    winnerNewPoints,
                    loserOldPoints,
                    loserNewPoints,
                    winnerPointsDelta,
                    loserPointsDelta,
                    date: set.updatedAt
                });

                if (set.games.length > 0) {
                    for (const match of set.games) {
                        if (match.winnerId !== null && match.loserId !== null) {
                            const matchObj = {
                                setId: match.setId,
                                winnerId: entrantIdToPlayerId(match.winnerId, playersMap),
                                loserId: entrantIdToPlayerId(match.loserId, playersMap),
                                number: match.orderNum,
                                date: match.updatedAt,
                                smashId: match.id
                            };

                            if (match.selections) {
                                if (
                                    match.selections[match.winnerId] &&
                                    match.selections[match.winnerId].character
                                ) {
                                    matchObj.winnerCharacter =
                                        match.selections[
                                            match.winnerId
                                        ].character[0].selectionValue;
                                }
                                if (
                                    match.selections[match.loserId] &&
                                    match.selections[match.loserId].character
                                ) {
                                    matchObj.loserCharacter =
                                        match.selections[match.loserId].character[0].selectionValue;
                                }
                            }
                            matchArray.push(matchObj);
                        }
                    }
                }
            }
        }
        tournamentArray.push(thisTournament);
    }
    return {
        tournamentArray,
        bracketGroupArray,
        bracketArray,
        setArray,
        matchArray,
        glickoPlayers
    };
}

/* ==========================================
*  Main Code Execution
/* ========================================== */

const main = async () => {
    // Setting up circuits
    const circuits = JSON.parse(fs.readFileSync(circuitsPath, { encoding: 'UTF8' }));
    const circuitsToAdd = await toAdd(circuits, 'Circuit', 'name');
    if (circuitsToAdd.length > 0) {
        console.log('Adding the following circuits:');
        for (const circuit of circuitsToAdd) {
            console.log(`--------${circuit.name}`);
        }
        await createCircuits(circuitsToAdd);
    } else {
        console.log('Circuits are up to date');
    }

    // Setting up tournaments
    const tournaments = JSON.parse(fs.readFileSync(tournamentsPath, { encoding: 'UTF8' }));
    const tournamentsToAdd = await toAdd(tournaments, 'Tournament', 'url');
    let info;
    if (tournamentsToAdd.length > 0) {
        console.log('Adding the following tournaments:');
        for (const tournament of tournamentsToAdd) {
            console.log(`--------${tournament.name}`);
        }
        info = await fetchAllDataForTournaments(tournamentsToAdd);
    } else {
        console.log('Tournaments are up to date');
    }

    // Add Tournament Query
    if (info) {
        console.log('Executing Tournaments Query...');
        await createTournaments(info.tournamentArray);
        console.log('Executing Bracket Groups Query...');
        await createBracketGroups(info.bracketGroupArray);
        console.log('Executing Brackets Query...');
        await createBrackets(info.bracketArray);
        console.log('Executing Sets Query...');
        await createSets(info.setArray);
        console.log('Executing Matches Query...');
        await createMatches(info.matchArray);
        console.log('Updating players rankings...');
        await updatePlayerRatings(info.glickoPlayers);
    }
};

main().catch(e => console.error(e));
