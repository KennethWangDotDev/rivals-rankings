/* ==========================================
*  Dependencies & Setup
/* ========================================== */

import { createCircuitsQuery, createTournament, queryExisting } from './queries';

const fs = require('fs');
const got = require('got');
const path = require('path');

const circuitsPath = path.resolve(__dirname, './circuits.json');
const tournamentsPath = path.resolve(__dirname, './tournaments.json');

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
        .join('/event/')
        .concat('?expand[]=phase&expand[]=groups&expand[]=event');
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

async function createCircuits(circuits) {
    const query = await createCircuitsQuery(circuits);
    return query;
}

async function createTournaments(tournaments) {
    const bracketGroupArray = [];
    const bracketArray = [];
    const setArray = [];
    const matchArray = [];
    for (const tournament of tournaments) {
        const { url } = tournament;
        const eventResponse = await got(eventUrlToApiEndpoint(url), {
            json: true
        });
        const event = eventResponse.body.entities;

        // Get list of bracket group
        for (const bracketGroup of event.phase) {
            bracketGroupArray.push({
                smashId: bracketGroup.id,
                label: bracketGroup.name
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
            const setsWithGames = sets.filter(set => set.games.length > 0);
            for (const set of setsWithGames) {
                setArray.push({
                    bracketId: set.phaseGroupId,
                    winnerEntrantId: set.winnerId,
                    loserEntrantId: set.loserId,
                    label: set.fullRoundText,
                    setId: set.id
                });
                for (const match of setsWithGames.games) {
                    const matchObj = {
                        setId: match.setId,
                        winnerEntrantId: match.winnerId,
                        loserEntrantId: match.loserId,
                        number: match.orderNum,
                        date: match.updatedAt
                    };

                    if (match.selections) {
                        if (
                            match.selections[match.winnerId] &&
                            match.selections[match.winnerId].character
                        ) {
                            matchObj.winnerCharacter =
                                match.selections[match.winnerId].character.selectionValue;
                        }
                        if (
                            match.selections[match.loserId] &&
                            match.selections[match.loserId].character
                        ) {
                            matchObj.loserCharacter =
                                match.selections[match.loserId].character.selectionValue;
                        }
                    }

                    matchArray.push(matchObj);
                }
            }
        }
    }
}

/* ==========================================
*  Main Code Execution
/* ========================================== */

const main = async () => {
    // Setting up circuits
    const circuits = JSON.parse(fs.readFileSync(circuitsPath, { encoding: 'UTF8' }));
    const circuitsToAdd = await toAdd(circuits, 'Circuit', 'name');
    if (circuitsToAdd.length > 0) {
        console.log(`Adding the following circuits:\n${circuitsToAdd}`);
        await createCircuits(circuitsToAdd);
    } else {
        console.log('Circuits are up to date');
    }

    // Setting up tournaments
    // const tournaments = JSON.parse(fs.readFileSync(tournamentsPath, { encoding: 'UTF8' }));
    // const tournamentsToAdd = await toAdd(circuits, 'Tournament', 'url');
    // if (tournamentsToAdd.length > 0) {
    //     console.log(`Adding the following tournaments:\n${tournamentsToAdd}`);
    //     await createTournaments(tournamentsToAdd);
    // } else {
    //     console.log('Tournaments are up to date');
    // }

    // console.log('Done!');
};

main().catch(e => console.error(e));
